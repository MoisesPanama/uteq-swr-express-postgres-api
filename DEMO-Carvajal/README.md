# ArtiSync – Frontend Node.js (demo de exposición)

Frontend hecho con **Node.js + Express + EJS** que consume la API REST del
backend **Spring Boot** de ArtiSync. No tiene base de datos propia: todo dato
mostrado viene de una llamada HTTP al backend Java con **axios**.

## Requisitos

- Node.js 18+
- El backend de ArtiSync corriendo (Spring Boot, PostgreSQL, Redis) en `http://localhost:8080`

## Instalación y ejecución

```bash
cd demo-node-frontend
npm install
cp .env.example .env      # ajusta API_BASE_URL si tu backend corre en otro puerto
npm start
```

Abre `http://localhost:3000`.

## Estructura del proyecto

```
demo-node-frontend/
├── server.js                    # Arranca Express, monta el router
├── src/
│   ├── config/apiClient.js      # Instancia axios centralizada (baseURL, timeout)
│   ├── controllers/             # Un archivo por recurso, llama a la API y renderiza
│   │   ├── categoriaController.js
│   │   ├── catalogoController.js
│   │   ├── authController.js
│   │   └── perfilController.js
│   ├── routes/index.js          # Mapea URLs -> controllers
│   └── middlewares/requireAuth.js  # Protege rutas que necesitan JWT
├── views/*.ejs                  # Plantillas HTML (SSR)
└── public/style.css
```

## Rutas de la demo

| Ruta | Endpoint del backend que consume | Autenticación |
|------|-----------------------------------|----------------|
| `GET /` | `GET /api/v1/categorias` | Pública |
| `GET /catalogo?q=...` | `GET /api/v1/catalogo` | Pública |
| `POST /catalogo/:idServicio/contratar` | `POST /api/v1/pedidos` | Requiere JWT (rol CLIENTE) |
| `GET /pedidos` | `GET /api/v1/pedidos/mis-pedidos` | Requiere JWT |
| `GET /login` + `POST /login` | `POST /api/auth/login` | Pública (genera el JWT) |
| `GET /perfil` | `GET /api/usuarios/me` | Requiere JWT |

## Parte transaccional (nueva)

Desde el catálogo, si estás logueado, cada servicio tiene un botón **"Contratar
servicio"**. Ese botón hace un `POST /api/v1/pedidos` real contra el backend
(crea una fila en la tabla de pedidos) y te redirige de vuelta al catálogo con
un mensaje de confirmación. Luego puedes ver ese pedido en **"Mis pedidos"**
(`GET /api/v1/pedidos/mis-pedidos`), que muestra el título, precio pactado,
creador y la etapa actual del pedido.

Para poder contratar necesitas iniciar sesión con un usuario que tenga el rol
`CLIENTE` en el backend (el endpoint `/api/v1/pedidos` está protegido con
`@PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")`).

## Si no ves categorías ni servicios

1. **Revisa la terminal donde corre `npm start`.** Cada request a `/` o
   `/catalogo` imprime cuántos elementos devolvió realmente el backend
   (o el error de conexión si no pudo contactarlo). Por ejemplo:
   ```
   [categorias] GET /api/v1/categorias -> 0 categorías recibidas
   [catalogo] Error al consumir /api/v1/catalogo: connect ECONNREFUSED 127.0.0.1:8080
   ```
2. **`ECONNREFUSED` o "No se pudo conectar"** → el backend Spring Boot no está
   corriendo, o corre en un puerto distinto al de `API_BASE_URL` en tu `.env`.
3. **"0 categorías recibidas" sin error** → el backend respondió bien, pero
   la tabla está vacía. Necesitas datos de prueba (seed) en PostgreSQL, o
   crear una categoría manualmente (por Swagger `/swagger-ui.html` o un
   cliente como Postman) antes de la demo.
4. La interfaz ahora distingue ambos casos: un panel rojo de error (problema
   de conexión) o un panel gris de "no hay datos" (conexión OK, tabla vacía).

## Flujo que se demuestra en vivo

1. La página de inicio hace un `axios.get()` al backend y renderiza el HTML
   en el servidor (Server-Side Rendering) con EJS.
2. En `/login`, el formulario envía `correo` y `contrasena` por `POST`.
   Spring Security valida las credenciales y responde con un **JWT**.
3. Node.js guarda ese JWT en una **cookie httpOnly** (nunca en el HTML ni en
   localStorage, por seguridad).
4. En `/perfil`, Node.js reenvía el JWT en el header
   `Authorization: Bearer <token>` para acceder a una ruta protegida del
   backend — demostrando cómo un cliente Node.js maneja autenticación
   basada en tokens.
5. En `/catalogo`, con sesión iniciada, "Contratar servicio" dispara un
   `POST /api/v1/pedidos` con el mismo JWT — la parte **transaccional**:
   crea un registro real en el backend, no solo lectura de datos.
