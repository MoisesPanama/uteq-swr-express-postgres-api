# Guion de la Demo — API de Libros (Express + Sequelize + PostgreSQL)

## 1. Antes de empezar (verificar en la terminal)

```powershell
node -v
npm -v
psql --version
```

## 2. Levantar el servidor

**Decir:**
> "Vamos a mostrar una API REST construida con Express.js, usando Sequelize como ORM para conectarnos a PostgreSQL. La entidad que manejamos es `Libro`, inspirada en el módulo de gestión bibliotecaria de mi proyecto final."

```powershell
npm run dev
```

**Decir mientras carga:**
> "Estamos levantando el servidor Express. Sequelize va a verificar la conexión a PostgreSQL y sincronizar el modelo con la tabla `libros`."

Confirmar en consola:
```
Conexión a PostgreSQL establecida correctamente.
Modelos sincronizados con la base de datos.
Servidor corriendo en http://localhost:3000
```

## 3. Endpoint GET — listar libros

Abrir una terminal nueva (dejar la del servidor corriendo).

**Decir:**
> "Este primer endpoint hace una petición GET a `/api/libros`. Por debajo, el controller llama al service, que usa `Libro.findAll()` de Sequelize para traer todos los registros de la tabla, sin escribir SQL manualmente."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros"
```

**Decir (si ya hay datos de antes):**
> "Esto confirma que los datos persisten en PostgreSQL, no se pierden al reiniciar el servidor — a diferencia de guardar en memoria."

## 4. Endpoint POST — crear un libro

**Decir:**
> "Ahora vamos a crear un nuevo libro. Enviamos un JSON en el body de la petición POST. Express lo parsea con `express.json()`, el controller valida que vengan los campos obligatorios, y el service ejecuta `Libro.create()` para insertarlo en la base de datos."

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

## 5. Confirmar con GET otra vez

**Decir:**
> "Confirmamos con otro GET que el nuevo libro ya está persistido en PostgreSQL."

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/libros"
```

**Decir:**
> "Vemos que el nuevo libro ya aparece con su `id` autogenerado y las marcas de tiempo `createdAt`/`updatedAt` que Sequelize gestiona automáticamente."

## 6. Manejo de errores (POST incompleto)

**Decir:**
> "Ahora vamos a mostrar qué pasa si se envía una petición incompleta. El controller valida los campos antes de tocar la base de datos, así que debería devolver un error 400 controlado, no un fallo genérico del servidor."

**Versión limpia (recomendada para la exposición, sin ruido de PowerShell):**

```powershell
$bodyIncompleto = @{ titulo = "Libro sin ISBN" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/libros" -Method Post -Body $bodyIncompleto -ContentType "application/json"
} catch {
    $_.ErrorDetails.Message
}
```

**Decir:**
> "Como ven, el servidor rechazó la petición con un error 400 y un mensaje claro, en vez de crear un registro incompleto o fallar de forma genérica. Esto lo maneja el controller antes de que la petición siquiera llegue al service o a la base de datos."

## 7. Puntos clave de configuración del ORM (para explicar, no ejecutar)

- `src/config/database.js` → instancia de Sequelize con credenciales desde `.env`.
- `src/models/libro.model.js` → define la tabla `libros` y sus columnas con `sequelize.define()`.
- `src/server.js` → `sequelize.authenticate()` verifica la conexión, `sequelize.sync()` crea/actualiza la tabla automáticamente.

## 8. Si algo falla en vivo (plan B)

- Si el servidor no arranca: revisar que PostgreSQL esté corriendo (`psql --version` y que el servicio de Windows esté activo).
- Si da error de conexión: verificar `.env` (host, usuario, password, puerto).
- Si `npm run dev` no reacciona: cerrar terminal, abrir una nueva, correr `npm install` de nuevo.
- Si el POST de errores no lanza el catch esperado: usar la versión sin `try/catch` (el mensaje de error sigue estando en el texto de la excepción de PowerShell, solo se ve menos limpio).