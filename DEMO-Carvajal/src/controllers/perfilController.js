const { apiClient, describirError } = require('../config/apiClient');

/**
 * GET /perfil
 * Ruta protegida: reenvía el JWT guardado en la cookie como
 * "Authorization: Bearer <token>" al backend.
 * Consume: GET /api/usuarios/me (requiere autenticación)
 */
async function mostrarPerfil(req, res) {
  const token = req.cookies.artisync_token; // requireAuth ya garantizó que existe
  try {
    const { data: perfil } = await apiClient.get('/api/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.render('perfil', { perfil, error: null, logueado: true });
  } catch (err) {
    res.render('perfil', { perfil: null, error: describirError(err), logueado: true });
  }
}

module.exports = { mostrarPerfil };
