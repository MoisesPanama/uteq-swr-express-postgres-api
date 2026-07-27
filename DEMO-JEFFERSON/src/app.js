const express = require('express');
const cors = require('cors');

const escenarioRoutes = require('./routes/escenario.routes');

const {
  rutaNoEncontrada,
  manejarError
} = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a la API REST de SBVIA.'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'La API está funcionando correctamente.'
  });
});

app.use('/api/escenarios', escenarioRoutes);

app.use(rutaNoEncontrada);
app.use(manejarError);

module.exports = app;
