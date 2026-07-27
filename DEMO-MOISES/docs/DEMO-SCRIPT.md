# Guion de la Demo — API de Libros (Express + Sequelize + PostgreSQL)

Guion probado el 26-27 de julio de 2026 con arranque de cero (VS Code
cerrado y reabierto, sin nada en memoria). Todo funcionó a la primera desde
el paso 1 hasta el paso 8. Sigue esto tal cual el día de la exposición.

---

## 0. Antes de abrir VS Code

PostgreSQL corre como servicio de Windows, sigue activo aunque cierres
VS Code. No hace falta "prenderlo" a mano.

## 1. Abrir la terminal de VS Code y entrar a la carpeta del proyecto

```powershell
cd DEMO-MOISES
```

## 2. Comprobar versiones (para que el profe vea que las herramientas están listas)

```powershell
node -v
npm -v
psql --version
```

## 3. Confirmar que el archivo de configuración existe

```powershell
Test-Path .env
```

Si da `True`, seguir. Si da `False`, copiar el de ejemplo:
```powershell
cp .env.example .env
```

## 4. Instalar dependencias (rápido si `node_modules` ya existe)

```powershell
npm install
```

## 5. Confirmar que la base de datos existe

```powershell
psql -U postgres -c "\l" | Select-String "uteq_libros_db"
```

Si no aparece nada, crearla:
```powershell
psql -U postgres -c "CREATE DATABASE uteq_libros_db;"
```

## 6. Sembrar los datos de ejemplo

```powershell
npm run seed
```

**Debe verse:**
```
Seed completado: estados_libro, editoriales, idiomas y libros de ejemplo.
```

## 7. Levantar el servidor

```powershell
npm run dev
```

**Debe verse:**
```
Conexión a PostgreSQL establecida correctamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en http://localhost:3000
```

**Qué decir mientras carga:**
> "Estamos levantando un servidor Express con Sequelize como ORM, conectado a PostgreSQL. Sequelize traduce nuestro código JavaScript en consultas SQL y sincroniza los modelos `Libro`, `Editorial`, `Idioma` y `EstadoLibro` con sus tablas correspondientes."

Dejar esta terminal corriendo. Abrir una **segunda terminal** (ícono `+`)
para las pruebas.

## 8. Batería de pruebas CRUD completa

**Importante:** usar un ISBN generado con la hora actual en cada intento,
para no chocar nunca con pruebas anteriores (el soft delete deja el ISBN
"ocupado" aunque el libro no aparezca en el listado — es el comportamiento
correcto, no un error).

```powershell
# --- GET listar ---
(Invoke-RestMethod -Uri "http://localhost:3000/api/libros?page=1&limit=10") | ConvertTo-Json -Depth 5
```
**Qué decir:**
> "Este endpoint consulta los libros con estado ACTIVO, paginados, e incluye los datos de editorial, idioma y estado gracias a los `include` de Sequelize — no solo el id foráneo."

```powershell
# --- GET por id ---
Invoke-RestMethod -Uri "http://localhost:3000/api/libros/1" | ConvertTo-Json -Depth 5
```
**Qué decir:**
> "Aquí traemos un solo libro por su id. Si no existe, el middleware de errores devuelve un 404 controlado."

```powershell
# --- POST crear (ISBN único basado en la hora, evita el 409) ---
$isbnUnico = "999" + (Get-Date -Format "MMddHHmmss")

$body = @{
  isbn = $isbnUnico
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

$creado = Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $body -ContentType "application/json"
$creado | ConvertTo-Json -Depth 5
Write-Host "ID creado: $($creado.id)"
```
**Qué decir:**
> "Enviamos un JSON en el body. Express lo parsea con `express.json()`, `express-validator` valida los campos obligatorios, y el service verifica que el ISBN sea único y que el stock disponible no supere al stock total antes de usar `Libro.create()`."

```powershell
# --- PUT actualizar (usa el id real que acaba de devolver el POST) ---
$bodyUpdate = @{
  isbn = $isbnUnico
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

Invoke-RestMethod -Uri "http://localhost:3000/api/libros/$($creado.id)" -Method Put -Body $bodyUpdate -ContentType "application/json" | ConvertTo-Json -Depth 5
```
**Qué decir:**
> "Actualizamos el stock disponible del libro que acabamos de crear. El service vuelve a aplicar las mismas reglas de negocio: ISBN único y stockDisponible ≤ stockTotal."

```powershell
# --- DELETE (soft delete) ---
Invoke-RestMethod -Uri "http://localhost:3000/api/libros/$($creado.id)" -Method Delete
```
**Qué decir:**
> "Este DELETE no borra la fila de la base de datos. Cambia el `estadoId` del libro a DADO_DE_BAJA. Es un soft delete: el registro sigue existiendo, solo deja de aparecer en el listado de libros activos."

```powershell
# --- Confirmar que ya no aparece en el listado ---
(Invoke-RestMethod -Uri "http://localhost:3000/api/libros") | ConvertTo-Json -Depth 5
```
**Qué decir:**
> "El libro recién creado ya no aparece en el listado de activos, pero sigue en la base de datos. Por eso, si intentamos crear otro libro con el mismo ISBN, el sistema lo va a rechazar como duplicado — es la prueba de que el soft delete funciona de verdad."

```powershell
# --- Error: campos obligatorios faltantes ---
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body (@{titulo="Libro sin ISBN"} | ConvertTo-Json) -ContentType "application/json"
} catch { $_.ErrorDetails.Message }
```
**Qué decir:**
> "El controller valida los campos antes de llegar a la base de datos, devolviendo un error 400 claro con un mensaje por cada campo obligatorio faltante."

```powershell
# --- Error: ISBN duplicado (reusando el mismo isbn recién dado de baja) ---
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $body -ContentType "application/json"
} catch { $_.ErrorDetails.Message }
```
**Qué decir:**
> "Y aquí confirmamos el 409: el ISBN sigue bloqueado porque el registro nunca se borró de la base de datos, solo cambió de estado."

### Qué debe salir en cada prueba

| Paso | Resultado esperado |
|---|---|
| GET listar | Solo libros con estado ACTIVO, con `editorial`/`idioma`/`estado` anidados |
| GET por id | El objeto del libro 1 (Rayuela) completo |
| POST | `201`, objeto con `id` autogenerado, `editorial`/`idioma`/`estado` resueltos |
| PUT | `200`, `stockDisponible: 1`, `actualizado_en` con timestamp nuevo |
| DELETE | Sin body de respuesta (`204`) |
| GET tras DELETE | El libro recién creado y dado de baja **ya no aparece** |
| Error campos faltantes | `400` con un mensaje por cada campo obligatorio |
| Error ISBN duplicado | `409` con `"ISBN ya registrado: <isbn>"` |

### Qué decir si el profe pregunta por qué un ISBN "ya existe"

> "El DELETE es un soft delete: no borra la fila, solo cambia el estado a
> DADO_DE_BAJA. El registro sigue en la base de datos, así que su ISBN
> sigue bloqueado para nuevos libros. Es la prueba de que el soft delete
> realmente conserva el histórico."

## 9. Puntos clave de configuración del ORM (para explicar, no ejecutar)

- `src/config/database.js` → instancia de Sequelize con credenciales desde `.env`.
- `src/models/libro.model.js` → define la tabla `libros` con `sequelize.define()`.
- `src/models/index.js` → relaciones `belongsTo` de `Libro` hacia `Editorial`, `Idioma` y `EstadoLibro`.
- `src/services/libro.service.js` → reglas de negocio (ISBN único, stock, soft delete), separadas del controller.
- `src/middlewares/libro.validator.js` → validación declarativa con `express-validator`.
- `src/middlewares/errorHandler.js` → maneja 400/404/409 con el status real; solo loguea en consola los 500 no controlados.
- `src/server.js` → `sequelize.authenticate()` + `sequelize.sync()` (crea/actualiza las tablas automáticamente, sin migraciones manuales).
- `src/seed.js` → siembra editoriales, idiomas, estados y libros de ejemplo (`npm run seed`).

## 10. Cierre: comprobar todo también en Postman

Con el servidor ya corriendo (paso 7), abrir Postman y correr, en orden,
las peticiones de la colección `docs/postman-collection.json`:

1. Listar libros (GET)
2. Obtener libro por ID (GET)
3. Crear libro (POST) — **cambiar el ISBN del body antes de mandar**, para no chocar con pruebas previas
4. Actualizar libro (PUT) — usar el `id` real que devolvió el paso 3
5. Eliminar libro (DELETE) — mismo `id`
6. Error - Campos faltantes (POST)
7. Error - ISBN duplicado (POST) — reusar el ISBN del paso 3, ya dado de baja

Si las 7 responden con los códigos de la tabla de arriba (201/200/204/400/409),
la demo está lista.

## 11. Si algo falla en vivo (plan B)

- Si el servidor no arranca: revisar que PostgreSQL esté corriendo (`psql --version` y que el servicio de Windows esté activo).
- Si da error de conexión (`28P01 auth_failed` o similar): verificar `.env` — sobre todo que `DB_PASSWORD` tenga tu password real de PostgreSQL, no el placeholder `tu_password` del `.env.example`. **Nunca correr `cp .env.example .env` si `.env` ya existe**, porque sobrescribe tu password real con el de ejemplo.
- Si `npm run dev` no reacciona: cerrar terminal, abrir una nueva, correr `npm install` de nuevo.
- Si falta el PATH de PostgreSQL: confirmar que `C:\Program Files\PostgreSQL\18\bin` esté agregado de forma **permanente** en las Variables de Entorno de Windows, y que se cerró/abrió VS Code por completo (no solo la terminal) para que el nuevo PATH se aplique.
- Si el puerto 3000 está ocupado: cambiar `PORT` en `.env`.
- Si PUT/DELETE devuelven "Cannot PUT/DELETE /api/libros/": significa que `$creado` quedó vacío porque el POST anterior falló (revisar el error del POST primero, normalmente ISBN duplicado).
- Si un ISBN "ya existe" y no debería: recordar que el DELETE es soft delete — ese ISBN sigue bloqueado a propósito. Usar un ISBN distinto (o el truco de `$isbnUnico` con la hora) para la demo en vivo.