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
> "Estamos levantando un servidor Express con Sequelize como ORM, conectado a PostgreSQL. Sequelize traduce nuestro código JavaScript en consultas SQL y sincroniza los modelos `Libro`, `Editorial`, `Idioma` y `EstadoLibro` con sus tablas correspondientes."

Confirmar en consola que aparecen estas 3 líneas:
```
Conexión a PostgreSQL establecida correctamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en http://localhost:3000
```

Si es la primera vez (o se reinició la BD), correr antes:
```powershell
npm run seed
```

**Qué decir sobre el seed:**
> "El seed pobló las tablas de referencia — editoriales, idiomas y estados del libro — y creó dos libros de ejemplo. Así la demo arranca con datos reales y relaciones ya resueltas, no una base vacía."

## 3. Endpoint GET — listar libros

**Qué decir:**
> "Este endpoint consulta los libros con estado ACTIVO, paginados, e incluye los datos de editorial, idioma y estado gracias a los `include` de Sequelize — no solo el id foráneo."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros?page=1&limit=10"
```

## 4. Endpoint GET por ID — un libro puntual

**Qué decir:**
> "Aquí traemos un solo libro por su id, con sus relaciones resueltas. Si no existe, el middleware de errores devuelve un 404 controlado."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros/1"
```

## 5. Endpoint POST — crear un libro

**Qué decir:**
> "Enviamos un JSON en el body. Express lo parsea con `express.json()`, `express-validator` valida los campos obligatorios, el service verifica que el ISBN sea único y que el stock disponible no supere al stock total, y finalmente usa `Libro.create()` para insertarlo en PostgreSQL."

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

Debería devolver **201 Created** con el libro nuevo, incluyendo `editorial`, `idioma` y `estado` ya resueltos.

## 6. Endpoint PUT — actualizar un libro

**Qué decir:**
> "Actualizamos el stock disponible del libro que acabamos de crear. El service vuelve a aplicar las mismas reglas de negocio: ISBN único y stockDisponible ≤ stockTotal."

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

Debería devolver **200 OK** con `stockDisponible: 1`.

## 7. Endpoint DELETE — dar de baja un libro (soft delete)

**Qué decir:**
> "Este DELETE no borra la fila de la base de datos. Cambia el `estadoId` del libro a DADO_DE_BAJA. Es un soft delete: el registro sigue existiendo, solo deja de aparecer en el listado de libros activos."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros/4" -Method Delete
```

Debería devolver **204 No Content**.

**Confirmar el soft delete (GET de nuevo):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros"
```

**Qué decir:**
> "El libro 4 ya no aparece en el listado de activos, pero sigue en la base de datos. Por eso, si intentamos crear otro libro con el mismo ISBN, el sistema lo va a rechazar como duplicado — es la prueba de que el soft delete funciona de verdad."

## 8. Mostrar validación de errores

**a) Campos obligatorios faltantes:**
```powershell
$bodyIncompleto = @{ titulo = "Libro sin ISBN" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $bodyIncompleto -ContentType "application/json"
} catch {
    $_.ErrorDetails.Message
}
```
Debería devolver **400** con un arreglo de errores, uno por cada campo obligatorio faltante.

**b) ISBN duplicado:**
```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $body -ContentType "application/json"
} catch {
    $_.ErrorDetails.Message
}
```
Debería devolver **409 Conflict**.

**Qué decir:**
> "El controller y el service validan antes de llegar a la base de datos, devolviendo códigos de error claros (400, 404, 409) en vez de un fallo genérico 500. El middleware `errorHandler` centraliza esta lógica y solo loguea en consola los errores 500 realmente inesperados."

## 9. Puntos clave de configuración del ORM (para explicar, no ejecutar)

- `src/config/database.js` → instancia de Sequelize con credenciales desde `.env`.
- `src/models/libro.model.js` → define la tabla `libros` con `sequelize.define()`.
- `src/models/index.js` → define las relaciones `belongsTo` de `Libro` hacia `Editorial`, `Idioma` y `EstadoLibro`.
- `src/services/libro.service.js` → reglas de negocio: ISBN único, stockDisponible ≤ stockTotal, soft delete.
- `src/middlewares/libro.validator.js` → validación declarativa con `express-validator`.
- `src/server.js` → `sequelize.authenticate()` verifica la conexión, `sequelize.sync()` sincroniza los modelos.
- `src/seed.js` → puebla tablas de referencia y libros de ejemplo (`npm run seed`).

## 10. Si algo falla en vivo (plan B)

- Si el servidor no arranca: revisar que PostgreSQL esté corriendo (`psql --version` y que el servicio de Windows esté activo).
- Si da error de conexión: verificar `.env` (host, usuario, password, puerto).
- Si `npm run dev` no reacciona: cerrar terminal, abrir una nueva, correr `npm install` de nuevo.
- Si falta el PATH de PostgreSQL: confirmar que `C:\Program Files\PostgreSQL\18\bin` esté agregado de forma **permanente** en las Variables de Entorno de Windows, y que se cerró/abrió VS Code por completo (no solo la terminal) para que el nuevo PATH se aplique.
- Si un ISBN "ya existe" y no debería: recordar que el DELETE es soft delete — ese ISBN sigue bloqueado a propósito. Usar un ISBN distinto para la demo en vivo.