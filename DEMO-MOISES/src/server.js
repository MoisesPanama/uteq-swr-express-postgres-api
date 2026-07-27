const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();