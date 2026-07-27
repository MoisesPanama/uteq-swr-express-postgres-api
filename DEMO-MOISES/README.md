# UTEQ SWR — Express + PostgreSQL API

API REST desarrollada con **Express.js**, **Sequelize** (ORM) y **PostgreSQL**, como parte de la exposición "Frameworks del Back-End" — Segundo Corte, Aplicaciones Web, SOFT-R, Paralelo A, UTEQ.

## Integrantes

- Carvajal Loor Johan Stalin
- Panamá Murillo Moisés Antonio
- Umaginga Arevalo Jefferson Manuel

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Express.js 5 |
| ORM | Sequelize 6 |
| Base de datos | PostgreSQL |
| Driver de BD | `pg` / `pg-hstore` |
| Validación | express-validator |
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
├── DEMO-SCRIPT.md              # Guion paso a paso para la demo en vivo, validado en frío
└── postman-collection.json     # Colección de Postman con GET/POST/PUT/DELETE
```

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior (instalado y corriendo)
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

3. Crear la base de datos vacía en PostgreSQL (solo la base, **no** hace falta crear tablas manualmente — ver sección "Creación de tablas" más abajo):
```sql
CREATE DATABASE uteq_libros_db;
```

4. Configurar variables de entorno. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

   Estas son las variables que trae `.env.example` — ajusta `DB_USER` y `DB_PASSWORD` con las credenciales reales de tu instalación de PostgreSQL:

   ```env
   DB_NAME=uteq_libros_db
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_HOST=localhost
   DB_PORT=5432
   PORT=3000
   ```

5. Sembrar datos de referencia y libros de ejemplo (recomendado antes de la demo). Este comando también crea las tablas si aún no existen:
```bash
npm run seed
```
   Al terminar deberías ver en consola:
   ```
   Seed completado: estados_libro, editoriales, idiomas y libros de ejemplo.
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

**Salida esperada en consola si todo está bien configurado:**
```
Conexión a PostgreSQL establecida correctamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en http://localhost:3000
```

El servidor corre por defecto en `http://localhost:3000` (configurable con `PORT` en `.env`).

## Creación de tablas (sin migraciones manuales)

Este proyecto **no usa archivos de migración SQL**. Las tablas (`libros`, `editoriales`, `idiomas`, `estados_libro`) se crean y actualizan automáticamente a partir de los modelos de Sequelize:

- `src/server.js` llama a `sequelize.authenticate()` (verifica la conexión) y luego a `sequelize.sync()` (crea las tablas que falten según lo definido en `src/models/*.model.js`).
- `src/seed.js` hace lo mismo antes de insertar los datos de ejemplo, por eso `npm run seed` funciona incluso en una base de datos recién creada y vacía.
- Solo se necesita crear la base de datos vacía (`CREATE DATABASE`); el resto del esquema lo genera Sequelize a partir del código.

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

### Ejemplo de respuesta (GET `/api/libros/:id`)

Nótese cómo Sequelize resuelve las relaciones con `include`, devolviendo el objeto completo de `editorial`, `idioma` y `estado`, no solo el id foráneo:

```json
{
  "id": 1,
  "isbn": "9788420471839",
  "titulo": "Rayuela",
  "resumen": "Novela de Julio Cortázar, hito del boom latinoamericano.",
  "portadaUrl": null,
  "anioPublicacion": 1963,
  "editorialId": 3,
  "idiomaId": 1,
  "estadoId": 1,
  "stockTotal": 5,
  "stockDisponible": 5,
  "ubicacionFisica": "A-12",
  "fecha_registro": "2026-07-27T02:28:35.274Z",
  "actualizado_en": "2026-07-27T02:28:35.274Z",
  "editorial": { "id": 3, "nombre": "Debolsillo", "paisOrigen": "España" },
  "idioma": { "id": 1, "nombre": "Español", "codigoIso": "es" },
  "estado": { "id": 1, "nombre": "ACTIVO" }
}
```

## ORM y acceso a datos

Sequelize gestiona la conexión y el mapeo objeto-relacional:

- La conexión se define en `src/config/database.js`, usando variables de entorno (`.env`) para las credenciales.
- El modelo `Libro` (`src/models/libro.model.js`) define la estructura de la tabla `libros` mediante `sequelize.define()`.
- `Libro` tiene una relación `belongsTo` con tres tablas de referencia: `Editorial`, `Idioma` y `EstadoLibro` (`src/models/index.js`). Estas relaciones se resuelven con `include` en las consultas, devolviendo el objeto completo y no solo el id foráneo.
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

- [`docs/DEMO-SCRIPT.md`](./docs/DEMO-SCRIPT.md) — guion completo con los comandos listos para la exposición en vivo, ya validado con un arranque en frío (VS Code cerrado y reabierto de cero).
- [`docs/postman-collection.json`](./docs/postman-collection.json) — colección de Postman con las peticiones GET, GET/:id, POST, PUT, DELETE y casos de error, listas para importar.

## Solución de problemas comunes

- **Error de conexión a PostgreSQL / `ECONNREFUSED`**: confirmar que el servicio de PostgreSQL esté corriendo y que `DB_HOST`, `DB_PORT`, `DB_USER` y `DB_PASSWORD` en `.env` coincidan con tu instalación.
- **`psql` no reconocido / PATH de PostgreSQL no encontrado (Windows)**: agregar la ruta de instalación (ej. `C:\Program Files\PostgreSQL\18\bin`) a las Variables de Entorno del sistema de forma permanente, y reiniciar la terminal/VS Code para que tome efecto.
- **Puerto 3000 ya en uso**: cambiar `PORT` en `.env` a otro valor libre (ej. `3001`).
- **`npm run seed` falla por base de datos inexistente**: asegurarse de haber ejecutado `CREATE DATABASE uteq_libros_db;` en PostgreSQL antes del seed.
- **Un ISBN "ya existe" y no debería**: es el comportamiento esperado del soft delete — el registro sigue en la base de datos aunque no aparezca en el listado de activos. Usar un ISBN distinto para nuevas pruebas.

## Contexto académico

Universidad Técnica Estatal de Quevedo (UTEQ) — Ingeniería de Software — Aplicaciones Web — 5to Nivel, Paralelo A.