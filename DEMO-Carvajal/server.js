/**
 * ArtiSync - Frontend Node.js (Express)
 * ---------------------------------------
 * Punto de entrada. Node.js NO tiene base de datos propia: actúa como
 * cliente HTTP del backend Java (Spring Boot), usando axios para
 * consumir la API y EJS para renderizar el HTML (SSR).
 *
 * Estructura:
 *   server.js              -> arranca la app
 *   src/config/            -> cliente axios centralizado
 *   src/controllers/       -> lógica de cada ruta (llama a la API)
 *   src/routes/            -> mapea URLs a controllers
 *   src/middlewares/       -> ej. requireAuth (protección con JWT)
 *   views/                 -> plantillas EJS
 *   public/                -> CSS estático
 */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./src/routes');
const { API_BASE_URL } = require('./src/config/apiClient');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); // leer formularios HTML
app.use(cookieParser());

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Frontend Node.js escuchando en http://localhost:${PORT}`);
  console.log(`Consumiendo el backend ArtiSync en ${API_BASE_URL}`);
});
