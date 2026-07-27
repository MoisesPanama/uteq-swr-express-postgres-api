function rutaNoEncontrada(req, res) {
  return res.status(404).json({
    success: false,
    data: null,
    message: `La ruta ${req.method} ${req.originalUrl} no existe.`
  });
}

function manejarError(error, req, res, next) {
  console.error(error);

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeDatabaseError'
  ) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'No fue posible procesar los datos enviados.',
      error: error.message
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    message: 'Ocurrió un error interno en el servidor.'
  });
}

module.exports = {
  rutaNoEncontrada,
  manejarError
};
