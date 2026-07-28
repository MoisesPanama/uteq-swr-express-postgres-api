const { apiClient, describirError } = require('../config/apiClient');

/**
 * GET /catalogo?q=&categoria=
 * Consume: GET /api/v1/catalogo  (público en el backend)
 */
async function buscarCatalogo(req, res) {
  const { q = '', categoria = '' } = req.query;
  try {
    const { data } = await apiClient.get('/api/v1/catalogo', {
      params: {
        q: q || undefined,
        categoria: categoria || undefined,
        page: 0,
        size: 12,
      },
    });

    // Debug: mira esta línea en la terminal donde corre "npm start"
    // para confirmar qué está devolviendo realmente el backend.
    console.log(
      `[catalogo] GET /api/v1/catalogo -> ${data.totalElements ?? 0} servicios en total, ${
        (data.content || []).length
      } en esta página`
    );

    res.render('catalogo', {
      servicios: data.content || [],
      q,
      categoria,
      logueado: Boolean(req.cookies.artisync_token),
      mensaje: req.query.ok ? 'Pedido creado correctamente. Puedes verlo en "Mis pedidos".' : null,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error('[catalogo] Error al consumir /api/v1/catalogo:', err.message);
    res.render('catalogo', {
      servicios: [],
      q,
      categoria,
      logueado: Boolean(req.cookies.artisync_token),
      mensaje: null,
      error: describirError(err),
    });
  }
}

module.exports = { buscarCatalogo };
