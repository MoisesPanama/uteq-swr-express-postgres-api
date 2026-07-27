const { body, param, validationResult } = require('express-validator');

const validarId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo.')
];

const validarEscenario = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio.')
    .isLength({ min: 3, max: 150 })
    .withMessage('El nombre debe tener entre 3 y 150 caracteres.'),

  body('descripcion')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede superar los 1000 caracteres.'),

  body('tipoVia')
    .notEmpty()
    .withMessage('El tipo de vía es obligatorio.')
    .isIn(['URBANA', 'RURAL', 'AUTOPISTA', 'MIXTA'])
    .withMessage(
      'El tipo de vía debe ser URBANA, RURAL, AUTOPISTA o MIXTA.'
    ),

  body('nivelDificultad')
    .notEmpty()
    .withMessage('El nivel de dificultad es obligatorio.')
    .isInt({ min: 1, max: 5 })
    .withMessage('El nivel de dificultad debe estar entre 1 y 5.'),

  body('clima')
    .notEmpty()
    .withMessage('El clima es obligatorio.')
    .isIn(['SOLEADO', 'LLUVIOSO', 'NUBLADO', 'NOCTURNO'])
    .withMessage(
      'El clima debe ser SOLEADO, LLUVIOSO, NUBLADO o NOCTURNO.'
    ),

  body('densidadTrafico')
    .notEmpty()
    .withMessage('La densidad de tráfico es obligatoria.')
    .isIn(['BAJA', 'MEDIA', 'ALTA'])
    .withMessage(
      'La densidad de tráfico debe ser BAJA, MEDIA o ALTA.'
    )
];

function manejarValidaciones(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Los datos enviados no son válidos.',
      errors: errores.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
}

module.exports = {
  validarId,
  validarEscenario,
  manejarValidaciones
};
