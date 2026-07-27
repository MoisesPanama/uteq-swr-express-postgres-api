require('dotenv').config();

const app = require('./app');
const { sequelize, probarConexion } = require('./config/database');

const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    await probarConexion();

    await sequelize.sync({
      alter: false
    });

    console.log('Modelos sincronizados con PostgreSQL.');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(
        `API de escenarios: http://localhost:${PORT}/api/escenarios`
      );
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor.');
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();
