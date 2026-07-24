const express = require('express');
const cors = require('cors');
const libroRoutes = require('./routes/libro.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba rápida (útil para la demo, confirma que el server está vivo)
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Libros - UTEQ - Express + Sequelize + PostgreSQL' });
});

// Rutas de la API
app.use('/api', libroRoutes);

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

module.exports = app;