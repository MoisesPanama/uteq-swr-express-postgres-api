function errorHandler(err, req, res, next) {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    mensaje: 'Ocurrió un error inesperado en el servidor',
    error: err.message,
  });
}

module.exports = errorHandler;