const { Router } = require('express');
const requireAuth = require('../middlewares/requireAuth');

const { mostrarCategorias } = require('../controllers/categoriaController');
const { buscarCatalogo } = require('../controllers/catalogoController');
const { mostrarLogin, procesarLogin, logout } = require('../controllers/authController');
const { mostrarPerfil } = require('../controllers/perfilController');
const { contratarServicio, listarMisPedidos } = require('../controllers/pedidoController');

const router = Router();

// Públicas
router.get('/', mostrarCategorias);
router.get('/catalogo', buscarCatalogo);
router.get('/login', mostrarLogin);
router.post('/login', procesarLogin);
router.post('/logout', logout);

// Protegidas (requieren JWT en cookie)
router.get('/perfil', requireAuth, mostrarPerfil);
router.post('/catalogo/:idServicio/contratar', requireAuth, contratarServicio); // transaccional
router.get('/pedidos', requireAuth, listarMisPedidos); // transaccional

module.exports = router;
