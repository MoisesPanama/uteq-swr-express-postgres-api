const express = require('express');

const escenarioController =
  require('../controllers/escenario.controller');

const {
  validarId,
  validarEscenario,
  manejarValidaciones
} = require('../middlewares/escenario.validator');

const router = express.Router();

router.get(
  '/',
  escenarioController.listar
);

router.get(
  '/:id',
  validarId,
  manejarValidaciones,
  escenarioController.buscarPorId
);

router.post(
  '/',
  validarEscenario,
  manejarValidaciones,
  escenarioController.crear
);

router.put(
  '/:id',
  validarId,
  validarEscenario,
  manejarValidaciones,
  escenarioController.actualizar
);

router.delete(
  '/:id',
  validarId,
  manejarValidaciones,
  escenarioController.eliminar
);

module.exports = router;
