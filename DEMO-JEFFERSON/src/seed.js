require('dotenv').config();

const { sequelize, probarConexion } = require('./config/database');
const { Escenario } = require('./models');

const escenariosIniciales = [
  {
    nombre: 'Ruta Urbana Centro',
    descripcion:
      'Escenario con semáforos, intersecciones y cruces peatonales.',
    tipoVia: 'URBANA',
    nivelDificultad: 3,
    clima: 'SOLEADO',
    densidadTrafico: 'ALTA'
  },
  {
    nombre: 'Autopista con lluvia',
    descripcion:
      'Conducción a alta velocidad sobre pavimento mojado.',
    tipoVia: 'AUTOPISTA',
    nivelDificultad: 4,
    clima: 'LLUVIOSO',
    densidadTrafico: 'MEDIA'
  },
  {
    nombre: 'Vía rural nocturna',
    descripcion:
      'Carretera rural con poca iluminación y tráfico reducido.',
    tipoVia: 'RURAL',
    nivelDificultad: 2,
    clima: 'NOCTURNO',
    densidadTrafico: 'BAJA'
  }
];

async function ejecutarSeed() {
  try {
    await probarConexion();
    await sequelize.sync();

    const cantidad = await Escenario.count();

    if (cantidad > 0) {
      console.log('La tabla escenarios ya contiene información.');
      return;
    }

    await Escenario.bulkCreate(escenariosIniciales);

    console.log('Datos iniciales registrados correctamente.');
  } catch (error) {
    console.error('Error al insertar los datos iniciales.');
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
}

ejecutarSeed();
