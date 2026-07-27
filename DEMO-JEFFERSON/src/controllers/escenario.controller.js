const escenarioService = require('../services/escenario.service');

async function listar(req, res, next) {
  try {
    const escenarios = await escenarioService.listarEscenarios();

    return res.status(200).json({
      success: true,
      data: escenarios,
      message: 'Escenarios consultados correctamente.'
    });
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const escenario =
      await escenarioService.buscarEscenarioPorId(req.params.id);

    if (!escenario) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Escenario no encontrado.'
      });
    }

    return res.status(200).json({
      success: true,
      data: escenario,
      message: 'Escenario encontrado correctamente.'
    });
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const escenario =
      await escenarioService.crearEscenario(req.body);

    return res.status(201).json({
      success: true,
      data: escenario,
      message: 'Escenario creado correctamente.'
    });
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const escenario =
      await escenarioService.actualizarEscenario(
        req.params.id,
        req.body
      );

    if (!escenario) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Escenario no encontrado.'
      });
    }

    return res.status(200).json({
      success: true,
      data: escenario,
      message: 'Escenario actualizado correctamente.'
    });
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    const escenario =
      await escenarioService.eliminarEscenario(req.params.id);

    if (!escenario) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Escenario no encontrado.'
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Escenario eliminado correctamente.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  buscarPorId,
  crear,
  actualizar,
  eliminar
};
