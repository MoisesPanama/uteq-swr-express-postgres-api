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
│   └── database.js        # Configuración de conexión a PostgreSQL vía Sequelize
├── models/
│   ├── index.js            # Punto central de acceso a los modelos
│   └── libro.model.js      # Modelo Sequelize de la entidad Libro
├── controllers/
│   └── libro.controller.js # Maneja las peticiones HTTP (req/res)
├── services/
│   └── libro.service.js    # Lógica de negocio y acceso a datos
├── routes/
│   └── libro.routes.js     # Definición de endpoints
├── middlewares/
│   └── errorHandler.js     # Manejo centralizado de errores
├── app.js                  # Configuración de Express y middlewares globales
└── server.js                # Punto de entrada: conecta BD y levanta el servidor

docs/
└── DEMO-SCRIPT.md          # Guion paso a paso para la demo en vivo
```

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/MoisesPanama/uteq-swr-express-postgres-api.git
cd uteq-swr-express-postgres-api
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
| GET | `/api/libros` | Lista todos los libros registrados |
| POST | `/api/libros` | Crea un nuevo libro |

### Ejemplo de body para POST

```json
{
  "isbn": "9788420471839",
  "titulo": "Rayuela",
  "autor": "Julio Cortazar",
  "anioPublicacion": 1963,
  "stockDisponible": 3
}
```

## ORM y acceso a datos

Sequelize gestiona la conexión y el mapeo objeto-relacional:

- La conexión se define en `src/config/database.js`, usando variables de entorno (`.env`) para las credenciales.
- El modelo `Libro` (`src/models/libro.model.js`) define la estructura de la tabla `libros` mediante `sequelize.define()`.
- Al iniciar el servidor, `sequelize.authenticate()` verifica la conexión y `sequelize.sync()` sincroniza el modelo con la base de datos.

## Documentación de la demo

Ver [`docs/DEMO-SCRIPT.md`](./docs/DEMO-SCRIPT.md) para el guion completo con los comandos listos para la exposición en vivo.

## Contexto académico

Universidad Técnica Estatal de Quevedo (UTEQ) — Ingeniería de Software — Aplicaciones Web — 5to Nivel, Paralelo A.