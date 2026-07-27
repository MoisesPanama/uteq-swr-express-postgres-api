const { Sequelize } = require('sequelize');
require('dotenv').config();

const mostrarConsultas =
  String(process.env.DB_LOGGING).toLowerCase() === 'true';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: mostrarConsultas ? console.log : false,
    define: {
      freezeTableName: true
    }
  }
);

async function probarConexion() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa con PostgreSQL.');
  } catch (error) {
    console.error('No fue posible conectar con PostgreSQL.');
    throw error;
  }
}

module.exports = {
  sequelize,
  probarConexion
};
