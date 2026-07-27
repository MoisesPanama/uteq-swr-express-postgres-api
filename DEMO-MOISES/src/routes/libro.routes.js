const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');
const { reglasLibro, reglasId, manejarValidacion } = require('../middlewares/libro.validator');

router.get('/libros', libroController.getLibros);
router.get('/libros/:id', reglasId, manejarValidacion, libroController.getLibroPorId);
router.post('/libros', reglasLibro, manejarValidacion, libroController.postLibro);
router.put('/libros/:id', reglasId, reglasLibro, manejarValidacion, libroController.putLibro);
router.delete('/libros/:id', reglasId, manejarValidacion, libroController.deleteLibro);

module.exports = router;