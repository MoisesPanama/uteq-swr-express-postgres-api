const { Libro, Editorial, Idioma, EstadoLibro } = require('../models');

const ESTADO_ACTIVO = 'ACTIVO';
const ESTADO_DADO_DE_BAJA = 'DADO_DE_BAJA';

// Incluye las tablas relacionadas para no devolver solo los IDs,
// sino también el nombre de la editorial, el idioma y el estado.
const INCLUDES = [
  { model: Editorial, as: 'editorial', attributes: ['id', 'nombre', 'paisOrigen'] },
  { model: Idioma, as: 'idioma', attributes: ['id', 'nombre', 'codigoIso'] },
  { model: EstadoLibro, as: 'estado', attributes: ['id', 'nombre'] },
];

async function listarLibros({ page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const estadoActivo = await EstadoLibro.findOne({ where: { nombre: ESTADO_ACTIVO } });

  const { rows, count } = await Libro.findAndCountAll({
    where: estadoActivo ? { estadoId: estadoActivo.id } : undefined,
    include: INCLUDES,
    order: [['titulo', 'ASC']],
    limit,
    offset,
  });

  return {
    data: rows,
    paginacion: {
      total: count,
      pagina: page,
      totalPaginas: Math.ceil(count / limit) || 1,
    },
  };
}

async function buscarLibroPorId(id) {
  const libro = await Libro.findByPk(id, { include: INCLUDES });
  if (!libro) {
    const error = new Error(`Libro no encontrado con id: ${id}`);
    error.status = 404;
    throw error;
  }
  return libro;
}

function validarStock(stockTotal, stockDisponible) {
  if (stockTotal == null || stockDisponible == null) return;
  if (stockDisponible > stockTotal) {
    const error = new Error('El stock disponible no puede ser mayor al stock total');
    error.status = 400;
    throw error;
  }
}

async function crearLibro(datos) {
  const existente = await Libro.findOne({ where: { isbn: datos.isbn } });
  if (existente) {
    const error = new Error(`ISBN ya registrado: ${datos.isbn}`);
    error.status = 409;
    throw error;
  }
  validarStock(datos.stockTotal, datos.stockDisponible);

  const nuevoLibro = await Libro.create(datos);
  return buscarLibroPorId(nuevoLibro.id);
}

async function actualizarLibro(id, datos) {
  const libro = await Libro.findByPk(id);
  if (!libro) {
    const error = new Error(`Libro no encontrado con id: ${id}`);
    error.status = 404;
    throw error;
  }

  if (datos.isbn) {
    const otroConMismoIsbn = await Libro.findOne({
      where: { isbn: datos.isbn },
    });
    if (otroConMismoIsbn && otroConMismoIsbn.id !== libro.id) {
      const error = new Error(`ISBN ya usado por otro libro: ${datos.isbn}`);
      error.status = 409;
      throw error;
    }
  }

  validarStock(
    datos.stockTotal ?? libro.stockTotal,
    datos.stockDisponible ?? libro.stockDisponible
  );

  await libro.update(datos);
  return buscarLibroPorId(id);
}

async function eliminarLibro(id) {
  const libro = await Libro.findByPk(id);
  if (!libro) {
    const error = new Error(`Libro no encontrado con id: ${id}`);
    error.status = 404;
    throw error;
  }

  const estadoDadoDeBaja = await EstadoLibro.findOne({ where: { nombre: ESTADO_DADO_DE_BAJA } });
  if (!estadoDadoDeBaja) {
    const error = new Error(`Catálogo estados_libro sin fila '${ESTADO_DADO_DE_BAJA}'`);
    error.status = 500;
    throw error;
  }

  // Soft delete: no se borra la fila, se marca como dada de baja.
  libro.estadoId = estadoDadoDeBaja.id;
  await libro.save();
}

module.exports = {
  listarLibros,
  buscarLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};