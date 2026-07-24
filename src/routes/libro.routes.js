const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');

router.get('/libros', libroController.getLibros);
router.post('/libros', libroController.postLibro);

module.exports = router;