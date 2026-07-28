const { apiClient, describirError } = require('../config/apiClient');

/**
 * GET /login -> muestra el formulario
 */
function mostrarLogin(req, res) {
  res.render('login', { error: null, mensaje: null, logueado: Boolean(req.cookies.artisync_token) });
}

/**
 * POST /login
 * Consume: POST /api/auth/login (público, devuelve el JWT)
 * Guarda el accessToken en una cookie httpOnly.
 */
async function procesarLogin(req, res) {
  const { correo, contrasena } = req.body;
  try {
    const { data: tokenResponse } = await apiClient.post('/api/auth/login', {
      correo,
      contrasena,
    });

    res.cookie('artisync_token', tokenResponse.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.render('login', {
      error: null,
      logueado: true,
      mensaje: `Login correcto. Bienvenido, ${tokenResponse.correo} (roles: ${(tokenResponse.roles || []).join(', ')})`,
    });
  } catch (err) {
    res.render('login', { error: describirError(err), mensaje: null, logueado: false });
  }
}

/**
 * POST /logout -> borra la cookie con el JWT
 */
function logout(req, res) {
  res.clearCookie('artisync_token');
  res.redirect('/');
}

module.exports = { mostrarLogin, procesarLogin, logout };
