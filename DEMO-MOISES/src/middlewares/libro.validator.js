const { body, param, validationResult } = require('express-validator');

// Reglas de validación declarativa para los campos del libro.
const reglasLibro = [
  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 255 }).withMessage('El título no puede superar 255 caracteres'),
  body('isbn')
    .trim()
    .notEmpty().withMessage('El ISBN es obligatorio')
    .matches(/^[0-9-]{10,17}$/).withMessage('ISBN inválido')
    .isLength({ max: 13 }).withMessage('El ISBN no puede superar 13 caracteres'),
  body('anioPublicacion')
    .notEmpty().withMessage('El año de publicación es obligatorio')
    .isInt({ min: 1000, max: 2100 }).withMessage('Año inválido'),
  body('editorialId')
    .notEmpty().withMessage('La editorial es obligatoria')
    .isInt().withMessage('editorialId debe ser numérico'),
  body('idiomaId')
    .notEmpty().withMessage('El idioma es obligatorio')
    .isInt().withMessage('idiomaId debe ser numérico'),
  body('estadoId')
    .notEmpty().withMessage('El estado es obligatorio')
    .isInt().withMessage('estadoId debe ser numérico'),
  body('stockTotal')
    .notEmpty().withMessage('El stock total es obligatorio')
    .isInt({ min: 0 }).withMessage('stockTotal debe ser un entero >= 0'),
  body('stockDisponible')
    .notEmpty().withMessage('El stock disponible es obligatorio')
    .isInt({ min: 0 }).withMessage('stockDisponible debe ser un entero >= 0'),
  body('resumen').optional({ nullable: true }).isString(),
  body('portadaUrl').optional({ nullable: true }).isLength({ max: 1000 }),
];

const reglasId = [
  param('id').isInt().withMessage('El id debe ser numérico'),
];

function manejarValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
}

module.exports = { reglasLibro, reglasId, manejarValidacion };