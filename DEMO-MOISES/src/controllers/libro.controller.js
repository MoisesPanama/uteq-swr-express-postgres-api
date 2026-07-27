const libroService = require('../services/libro.service');

async function getLibros(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);

    const resultado = await libroService.listarLibros({ page, limit });
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

async function getLibroPorId(req, res, next) {
  try {
    const libro = await libroService.buscarLibroPorId(req.params.id);
    res.status(200).json(libro);
  } catch (error) {
    next(error);
  }
}

async function postLibro(req, res, next) {
  try {
    const nuevoLibro = await libroService.crearLibro(req.body);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    next(error);
  }
}

async function putLibro(req, res, next) {
  try {
    const libroActualizado = await libroService.actualizarLibro(req.params.id, req.body);
    res.status(200).json(libroActualizado);
  } catch (error) {
    next(error);
  }
}

async function deleteLibro(req, res, next) {
  try {
    await libroService.eliminarLibro(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLibros,
  getLibroPorId,
  postLibro,
  putLibro,
  deleteLibro,
};