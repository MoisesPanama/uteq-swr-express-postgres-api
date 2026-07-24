# Guion de la Demo — API de Libros (Express + Sequelize + PostgreSQL)

## 1. Antes de empezar (verificar en la terminal)

```powershell
node -v
npm -v
psql --version
```

## 2. Levantar el servidor

```powershell
npm run dev
```

**Qué decir mientras carga:**
> "Estamos levantando un servidor Express con Sequelize como ORM, conectado a PostgreSQL. Sequelize se encarga de traducir nuestro código JavaScript en consultas SQL, y de sincronizar el modelo `Libro` con la tabla `libros` en la base de datos."

Confirmar en consola que aparecen estas 3 líneas:
```
Conexión a PostgreSQL establecida correctamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en http://localhost:3000
```

## 3. Mostrar la ruta base (opcional, para confirmar que el server responde)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000"
```

## 4. Endpoint GET — listar libros

**Qué decir:**
> "Este endpoint consulta todos los registros de la tabla `libros` a través del modelo de Sequelize, sin escribir SQL manualmente."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros"
```

## 5. Endpoint POST — crear un libro

**Qué decir:**
> "Aquí enviamos un JSON en el body de la petición. Express lo parsea con `express.json()`, el controller valida los campos obligatorios, y el service usa `Libro.create()` de Sequelize para insertarlo en PostgreSQL."

```powershell
$body = @{
  isbn = "9788420471839"
  titulo = "Rayuela"
  autor = "Julio Cortazar"
  anioPublicacion = 1963
  stockDisponible = 3
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $body -ContentType "application/json"
```

## 6. Confirmar que se guardó (GET de nuevo)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros"
```

**Qué decir:**
> "Vemos que el nuevo libro ya aparece con su `id` autogenerado y las marcas de tiempo `createdAt`/`updatedAt` que Sequelize gestiona automáticamente."

## 7. Mostrar validación de errores (opcional, si sobra tiempo)

Enviar un POST sin campos obligatorios para mostrar el manejo de errores:

```powershell
$bodyIncompleto = @{ titulo = "Libro sin ISBN" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $bodyIncompleto -ContentType "application/json"
```

**Qué decir:**
> "El controller valida los campos antes de llegar a la base de datos, devolviendo un error 400 claro en vez de un fallo genérico."

## 8. Puntos clave de configuración del ORM (para explicar, no ejecutar)

- `src/config/database.js` → instancia de Sequelize con credenciales desde `.env`.
- `src/models/libro.model.js` → define la tabla `libros` y sus columnas con `sequelize.define()`.
- `src/server.js` → `sequelize.authenticate()` verifica la conexión, `sequelize.sync()` crea/actualiza la tabla automáticamente.

## 9. Si algo falla en vivo (plan B)

- Si el servidor no arranca: revisar que PostgreSQL esté corriendo (`psql --version` y que el servicio de Windows esté activo).
- Si da error de conexión: verificar `.env` (host, usuario, password, puerto).
- Si `npm run dev` no reacciona: cerrar terminal, abrir una nueva, correr `npm install` de nuevo.