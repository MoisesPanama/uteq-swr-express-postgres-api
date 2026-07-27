# UTEQ SWR — Express + PostgreSQL API

API REST desarrollada con **Express.js**, **Sequelize** (ORM) y **PostgreSQL**, como parte de la exposición "Frameworks del Back-End" — Segundo Corte, Aplicaciones Web, SOFT-R, Paralelo A, UTEQ.

## Integrantes

- Carvajal Loor Johan Stalin
- Panamá Murillo Moisés Antonio
- Umaginga Arevalo Jefferson Manuel

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Express.js |
| ORM | Sequelize |
| Base de datos | PostgreSQL |
| Runtime | Node.js |

## Estructura del proyecto

```
src/
├── config/
│   └── database.js         # Configuración de conexión a PostgreSQL vía Sequelize
├── models/
│   ├── index.js             # Punto central + relaciones entre modelos
│   ├── libro.model.js       # Modelo Sequelize de la entidad Libro
│   ├── editorial.model.js   # Tabla de referencia: editoriales
│   ├── idioma.model.js      # Tabla de referencia: idiomas
│   └── estadoLibro.model.js # Tabla de referencia: estados del libro
├── controllers/
│   └── libro.controller.js  # Maneja las peticiones HTTP (req/res), CRUD completo
├── services/
│   └── libro.service.js     # Lógica de negocio y acceso a datos (reglas, soft delete)
├── routes/
│   └── libro.routes.js      # Definición de endpoints
├── middlewares/
│   ├── errorHandler.js      # Manejo centralizado de errores (404/409/400/500)
│   └── libro.validator.js   # Validación declarativa con express-validator
├── seed.js                  # Siembra datos de referencia + libros de ejemplo
├── app.js                   # Configuración de Express y middlewares globales
└── server.js                 # Punto de entrada: conecta BD y levanta el servidor

docs/
├── DEMO-SCRIPT.md              # Guion paso a paso para la demo en vivo
├── DEMO-SCRIPT-PRACTICADO.md   # Guion con notas de la práctica ya ensayada
└── postman-collection.json     # Colección de Postman con GET/POST/PUT/DELETE
```

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación

1. Clonar el repositorio y entrar a esta carpeta:
```bash
git clone https://github.com/MoisesPanama/uteq-swr-express-postgres-api.git
cd uteq-swr-express-postgres-api/DEMO-MOISES
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE uteq_libros_db;
```

4. Configurar variables de entorno (copiar `.env.example` a `.env` y completar con tus credenciales):
```bash
cp .env.example .env
```

5. Sembrar datos de referencia y libros de ejemplo (recomendado antes de la demo):
```bash
npm run seed
```

## Uso

Levantar el servidor en modo desarrollo (con recarga automática):
```bash
npm run dev
```

Levantar el servidor en modo producción:
```bash
npm start
```

El servidor corre por defecto en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/libros?page=1&limit=10` | Lista libros activos, paginado |
| GET | `/api/libros/:id` | Busca un libro por id (con editorial/idioma/estado) |
| POST | `/api/libros` | Crea un nuevo libro |
| PUT | `/api/libros/:id` | Actualiza un libro existente |
| DELETE | `/api/libros/:id` | Da de baja un libro (soft delete: cambia su estado, no borra la fila) |

### Ejemplo de body para POST / PUT

```json
{
  "isbn": "9788420471839",
  "titulo": "Rayuela",
  "resumen": "Novela de Julio Cortázar, hito del boom latinoamericano.",
  "anioPublicacion": 1963,
  "editorialId": 3,
  "idiomaId": 1,
  "estadoId": 1,
  "stockTotal": 5,
  "stockDisponible": 5,
  "ubicacionFisica": "A-12"
}
```

## ORM y acceso a datos

Sequelize gestiona la conexión y el mapeo objeto-relacional:

- La conexión se define en `src/config/database.js`, usando variables de entorno (`.env`) para las credenciales.
- El modelo `Libro` (`src/models/libro.model.js`) define la estructura de la tabla `libros` mediante `sequelize.define()`.
- `Libro` tiene una relación `belongsTo` con tres tablas de referencia: `Editorial`, `Idioma` y `EstadoLibro` (`src/models/index.js`). Estas relaciones se resuelven con `include` en las consultas, devolviendo el nombre y no solo el id foráneo.
- Las reglas de negocio (ISBN único, stock disponible ≤ stock total) viven en `src/services/libro.service.js`, separadas del controlador.
- La eliminación es un **soft delete**: `DELETE /api/libros/:id` no borra la fila, cambia `estadoId` al estado `DADO_DE_BAJA`. Por eso el ISBN de un libro "eliminado" sigue bloqueado para nuevos registros — es el comportamiento esperado.
- Al iniciar el servidor, `sequelize.authenticate()` verifica la conexión y `sequelize.sync()` sincroniza los modelos con la base de datos. `npm run seed` puebla las tablas de referencia y algunos libros de ejemplo.

### Modelo de datos (relaciones)

```
Editorial (1) ──< (N) Libro (N) >── (1) Idioma
                       │
                       ∨ (N) >── (1)
                   EstadoLibro
```

## Documentación de la demo

- [`docs/DEMO-SCRIPT.md`](./docs/DEMO-SCRIPT.md) — guion completo con los comandos listos para la exposición en vivo.
- [`docs/DEMO-SCRIPT-PRACTICADO.md`](./docs/DEMO-SCRIPT-PRACTICADO.md) — notas de la práctica ya ensayada (qué salió bien, comportamientos a explicar como el del soft delete con ISBN).
- [`docs/postman-collection.json`](./docs/postman-collection.json) — colección de Postman con las peticiones GET, GET/:id, POST, PUT, DELETE y casos de error, listas para importar.

## Contexto académico

Universidad Técnica Estatal de Quevedo (UTEQ) — Ingeniería de Software — Aplicaciones Web — 5to Nivel, Paralelo A.