const libroService = require('../services/libro.service');

async function getLibros(req, res) {
  try {
    const libros = await libroService.obtenerTodosLosLibros();
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los libros', error: error.message });
  }
}

async function postLibro(req, res) {
  try {
    const { isbn, titulo, autor, anioPublicacion, stockDisponible } = req.body;

    if (!isbn || !titulo || !autor || !anioPublicacion) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: isbn, titulo, autor, anioPublicacion' });
    }

    const nuevoLibro = await libroService.crearLibro({
      isbn,
      titulo,
      autor,
      anioPublicacion,
      stockDisponible,
    });

    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el libro', error: error.message });
  }
}

module.exports = {
  getLibros,
  postLibro,
};