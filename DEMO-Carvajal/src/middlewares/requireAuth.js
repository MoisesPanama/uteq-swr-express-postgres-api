/**
 * Middleware de ejemplo: protege rutas que necesitan el JWT.
 * Si no hay cookie con el token, redirige al login.
 */
function requireAuth(req, res, next) {
  if (!req.cookies.artisync_token) {
    return res.redirect('/login');
  }
  next();
}

module.exports = requireAuth;
