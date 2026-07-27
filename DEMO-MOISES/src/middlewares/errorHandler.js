// Manejo centralizado de errores: cada error de negocio trae su propio
// `status` (404, 409, 400...) y aquí solo se traduce a la respuesta JSON.
// Lo no controlado cae a 500.
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (status === 500) {
    console.error('Error no controlado:', err.stack);
  }

  res.status(status).json({
    mensaje: status === 500 ? 'Ocurrió un error inesperado en el servidor' : err.message,
    ...(status === 500 && { error: err.message }),
  });
}

module.exports = errorHandler;