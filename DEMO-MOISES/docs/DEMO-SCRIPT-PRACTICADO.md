# Guion de la Demo — API de Libros (Express + Sequelize + PostgreSQL)
### Notas de la práctica ya ensayada (CRUD completo)

## 1. Antes de empezar (verificar en la terminal)

```powershell
cd DEMO-MOISES
node -v
npm -v
psql --version
```

## 2. Levantar el servidor

**Decir:**
> "Vamos a mostrar una API REST construida con Express.js, usando Sequelize como ORM para conectarnos a PostgreSQL. La entidad principal es `Libro`, con relaciones reales a tres tablas de catálogo: `Editorial`, `Idioma` y `EstadoLibro`. El diseño está inspirado en el módulo de gestión bibliotecaria de mi proyecto final de curso."

```powershell
npm run dev
```

**Decir mientras carga:**
> "Estamos levantando el servidor Express. Sequelize va a verificar la conexión a PostgreSQL y sincronizar los cuatro modelos con sus tablas."

Confirmar en consola:
```
Conexión a PostgreSQL establecida correctamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en http://localhost:3000
```

Si la base está vacía o se reinició, correr antes `npm run seed` — puebla editoriales, idiomas, estados y dos libros de ejemplo ("Rayuela" y "Cien años de soledad").

## 3. Endpoint GET — listar libros

Abrir una terminal nueva (dejar la del servidor corriendo).

**Decir:**
> "Este primer endpoint hace un GET a `/api/libros`. El controller llama al service, que usa `Libro.findAll()` con `include` para traer también editorial, idioma y estado — solo los libros con estado ACTIVO, paginados."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros?page=1&limit=10"
```

**Decir (si ya hay datos del seed):**
> "Esto confirma que los datos persisten en PostgreSQL, no se pierden al reiniciar el servidor — a diferencia de guardar en memoria."

## 4. Endpoint GET por ID

**Decir:**
> "Si necesitamos el detalle de un solo libro, usamos `/api/libros/:id`. Sequelize resuelve `findByPk` con los mismos `include`, y si el id no existe, el middleware de errores devuelve un 404 en vez de un fallo genérico."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros/1"
```

## 5. Endpoint POST — crear un libro

**Decir:**
> "Ahora vamos a crear un nuevo libro. Enviamos un JSON con isbn, título, resumen, año, las tres llaves foráneas (editorial, idioma, estado) y el stock. Express lo parsea con `express.json()`, `express-validator` valida los campos obligatorios, y el service comprueba que el ISBN no esté repetido y que el stock disponible no supere al stock total antes de llamar a `Libro.create()`."

```powershell
$body = @{
  isbn = "9780307474728"
  titulo = "El Amor en los Tiempos del Colera"
  resumen = "Novela de Gabriel Garcia Marquez."
  anioPublicacion = 1985
  editorialId = 3
  idiomaId = 1
  estadoId = 1
  stockTotal = 4
  stockDisponible = 4
  ubicacionFisica = "A-14"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $body -ContentType "application/json"
```

**Resultado real de la práctica:** `201 Created`, libro creado con `id: 4`, con `editorial`, `idioma` y `estado` ya resueltos (Debolsillo / Español / ACTIVO).

## 6. Endpoint PUT — actualizar un libro

**Decir:**
> "Vamos a actualizar el stock disponible del libro que acabamos de crear, de 4 a 1. El service vuelve a validar las mismas reglas de negocio antes de guardar."

```powershell
$bodyUpdate = @{
  isbn = "9780307474728"
  titulo = "El Amor en los Tiempos del Colera"
  resumen = "Novela de Gabriel Garcia Marquez."
  anioPublicacion = 1985
  editorialId = 3
  idiomaId = 1
  estadoId = 1
  stockTotal = 4
  stockDisponible = 1
  ubicacionFisica = "A-14"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/libros/4" -Method Put -Body $bodyUpdate -ContentType "application/json"
```

**Resultado real de la práctica:** `200 OK`, `stockDisponible: 1`, `actualizado_en` con timestamp nuevo.

## 7. Endpoint DELETE — soft delete

**Decir:**
> "Este DELETE no borra físicamente la fila. Cambia el `estadoId` del libro a DADO_DE_BAJA. Así el histórico se conserva y el registro sigue existiendo en la base de datos."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros/4" -Method Delete
```

Debería devolver `204 No Content`.

**Confirmar con un GET:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros"
```

**Decir:**
> "El libro 4 ya no aparece en el listado de activos, pero como no se borró, su ISBN sigue bloqueado. Si intentamos crear otro libro con ese mismo ISBN, el sistema lo rechaza — eso es exactamente el comportamiento esperado del soft delete, no un error."

## 8. Manejo de errores

**a) POST incompleto:**

**Decir:**
> "Ahora vamos a mostrar qué pasa si se envía una petición incompleta. El controller valida los campos antes de tocar la base de datos, así que debería devolver un error 400 controlado, no un fallo genérico del servidor."

```powershell
$bodyIncompleto = @{ titulo = "Libro sin ISBN" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $bodyIncompleto -ContentType "application/json"
} catch {
    $_.ErrorDetails.Message
}
```

**Decir:**
> "Como ven, el servidor rechazó la petición con un error 400 y un arreglo con un mensaje por cada campo obligatorio faltante, en vez de crear un registro incompleto o fallar de forma genérica."

**b) ISBN duplicado:**

**Decir:**
> "Si intentamos crear un libro reutilizando el ISBN de uno que ya existe (incluso uno dado de baja), el service lo detecta y responde con un 409 Conflict."

```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $body -ContentType "application/json"
} catch {
    $_.ErrorDetails.Message
}
```

## 9. Puntos clave de configuración del ORM (para explicar, no ejecutar)

- `src/config/database.js` → instancia de Sequelize con credenciales desde `.env`.
- `src/models/libro.model.js` → define la tabla `libros` con `sequelize.define()`.
- `src/models/index.js` → relaciones `belongsTo` de `Libro` hacia `Editorial`, `Idioma` y `EstadoLibro`.
- `src/services/libro.service.js` → reglas de negocio (ISBN único, stock, soft delete), separadas del controller.
- `src/middlewares/libro.validator.js` → validación declarativa con `express-validator`.
- `src/middlewares/errorHandler.js` → maneja 400/404/409 con el status real; solo loguea en consola los 500 no controlados.
- `src/server.js` → `sequelize.authenticate()` + `sequelize.sync()`.
- `src/seed.js` → siembra editoriales, idiomas, estados y libros de ejemplo (`npm run seed`).

## 10. Si algo falla en vivo (plan B)

- Si el servidor no arranca: revisar que PostgreSQL esté corriendo (`psql --version` y que el servicio de Windows esté activo).
- Si da error de conexión: verificar `.env` (host, usuario, password, puerto).
- Si `npm run dev` no reacciona: cerrar terminal, abrir una nueva, correr `npm install` de nuevo.
- Si el POST de errores no lanza el catch esperado: usar la versión sin `try/catch` (el mensaje de error sigue estando en el texto de la excepción de PowerShell, solo se ve menos limpio).
- Si falta el PATH de PostgreSQL tras reiniciar el equipo: confirmar que `C:\Program Files\PostgreSQL\18\bin` quedó agregado de forma **permanente** en las Variables de Entorno de Windows, y cerrar/abrir VS Code por completo (no solo la terminal) para que el PATH nuevo se aplique.
- Si un ISBN "ya existe" sin razón aparente: es el soft delete funcionando — usar un ISBN distinto para cada intento en vivo.