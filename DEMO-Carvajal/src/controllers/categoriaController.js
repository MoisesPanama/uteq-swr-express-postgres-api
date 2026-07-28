const { apiClient, describirError } = require('../config/apiClient');

/**
 * GET /
 * Consume: GET /api/v1/categorias  (público en el backend)
 */
async function mostrarCategorias(req, res) {
  try {
    const { data: categorias } = await apiClient.get('/api/v1/categorias');

    // Debug: revisa la terminal donde corre "npm start" para confirmar
    // cuántas categorías está devolviendo realmente el backend.
    console.log(`[categorias] GET /api/v1/categorias -> ${categorias.length} categorías recibidas`);

    res.render('index', {
      categorias,
      logueado: Boolean(req.cookies.artisync_token),
      error: null,
    });
  } catch (err) {
    console.error('[categorias] Error al consumir /api/v1/categorias:', err.message);
    res.render('index', {
      categorias: [],
      logueado: Boolean(req.cookies.artisync_token),
      error: describirError(err),
    });
  }
}

module.exports = { mostrarCategorias };
