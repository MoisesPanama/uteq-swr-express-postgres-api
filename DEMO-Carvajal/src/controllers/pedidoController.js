const { apiClient, describirError } = require('../config/apiClient');

/**
 * POST /catalogo/:idServicio/contratar
 * Parte TRANSACCIONAL: crea un pedido real contra el backend.
 * Consume: POST /api/v1/pedidos  (requiere JWT, rol CLIENTE o ADMIN)
 */
async function contratarServicio(req, res) {
  const { idServicio } = req.params;
  const token = req.cookies.artisync_token;

  try {
    await apiClient.post(
      '/api/v1/pedidos',
      { idServicio: Number(idServicio) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.redirect('/catalogo?ok=1');
  } catch (err) {
    console.error('[pedidos] Error al crear el pedido:', err.message);
    res.redirect(`/catalogo?error=${encodeURIComponent(describirError(err))}`);
  }
}

/**
 * GET /pedidos
 * Lista los pedidos del cliente autenticado.
 * Consume: GET /api/v1/pedidos/mis-pedidos  (requiere JWT, rol CLIENTE o ADMIN)
 */
async function listarMisPedidos(req, res) {
  const token = req.cookies.artisync_token;
  try {
    const { data: pedidos } = await apiClient.get('/api/v1/pedidos/mis-pedidos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.render('pedidos', { pedidos, error: null, logueado: true });
  } catch (err) {
    console.error('[pedidos] Error al listar mis-pedidos:', err.message);
    res.render('pedidos', { pedidos: [], error: describirError(err), logueado: true });
  }
}

module.exports = { contratarServicio, listarMisPedidos };
