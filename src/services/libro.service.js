const { Libro } = require('../models');

async function obtenerTodosLosLibros() {
  return await Libro.findAll({
    order: [['id', 'ASC']],
  });
}

async function crearLibro(datosLibro) {
  return await Libro.create(datosLibro);
}

module.exports = {
  obtenerTodosLosLibros,
  crearLibro,
};