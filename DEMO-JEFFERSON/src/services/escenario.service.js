const { Escenario } = require('../models');

async function listarEscenarios() {
  return Escenario.findAll({
    where: {
      activo: true
    },
    order: [['id', 'ASC']]
  });
}

async function buscarEscenarioPorId(id) {
  return Escenario.findOne({
    where: {
      id,
      activo: true
    }
  });
}

async function crearEscenario(datos) {
  return Escenario.create({
    nombre: datos.nombre,
    descripcion: datos.descripcion || null,
    tipoVia: datos.tipoVia,
    nivelDificultad: datos.nivelDificultad,
    clima: datos.clima,
    densidadTrafico: datos.densidadTrafico
  });
}

async function actualizarEscenario(id, datos) {
  const escenario = await buscarEscenarioPorId(id);

  if (!escenario) {
    return null;
  }

  await escenario.update({
    nombre: datos.nombre,
    descripcion: datos.descripcion || null,
    tipoVia: datos.tipoVia,
    nivelDificultad: datos.nivelDificultad,
    clima: datos.clima,
    densidadTrafico: datos.densidadTrafico
  });

  return escenario;
}

async function eliminarEscenario(id) {
  const escenario = await buscarEscenarioPorId(id);

  if (!escenario) {
    return null;
  }

  await escenario.update({
    activo: false
  });

  return escenario;
}

module.exports = {
  listarEscenarios,
  buscarEscenarioPorId,
  crearEscenario,
  actualizarEscenario,
  eliminarEscenario
};
