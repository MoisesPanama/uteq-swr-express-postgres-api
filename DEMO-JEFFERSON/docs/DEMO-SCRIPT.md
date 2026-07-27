# DEMO PRACTICADO - API REST CON EXPRESS.JS

## 1. Objetivo de la demostración

En esta práctica se demostrará el funcionamiento de una API REST desarrollada con Express.js, Sequelize y PostgreSQL.

La entidad utilizada será **Escenario**, tomada como referencia del proyecto SBVIA.

---

# 2. Iniciar el proyecto

Abrir una terminal dentro de la carpeta del proyecto y ejecutar:

```bash
npm install
```

Este comando instala todas las dependencias registradas en `package.json`.

Después iniciar el servidor:

```bash
npm run dev
```

Resultado esperado:

```text
Conexión exitosa con PostgreSQL.
Modelos sincronizados con PostgreSQL.
Servidor ejecutándose en http://localhost:3000
```

Explicación:

El comando `npm run dev` ejecuta Nodemon, el cual reinicia automáticamente el servidor cuando se modifica algún archivo.

---

# 3. Verificar que la API está funcionando

Abrir el navegador o Postman y consultar:

```http
GET http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "La API está funcionando correctamente."
}
```

Explicación:

Este endpoint permite verificar rápidamente que el servidor Express está activo.

---

# 4. Consultar todos los escenarios

Método:

```http
GET
```

URL:

```text
http://localhost:3000/api/escenarios
```

Ejemplo de respuesta:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "nombre": "Ruta Urbana Centro",
      "descripcion": "Escenario con semáforos e intersecciones.",
      "tipoVia": "URBANA",
      "nivelDificultad": 3,
      "clima": "SOLEADO",
      "densidadTrafico": "ALTA",
      "activo": true,
      "creado_en": "2026-07-27T20:00:00.000Z",
      "actualizado_en": "2026-07-27T20:00:00.000Z"
    }
  ],
  "message": "Escenarios consultados correctamente."
}
```

Explicación:

La petición GET permite obtener todos los escenarios activos registrados en PostgreSQL.

El flujo de ejecución es:

```text
Postman
   ↓
Router
   ↓
Controller
   ↓
Service
   ↓
Modelo Sequelize
   ↓
PostgreSQL
```

---

# 5. Consultar un escenario por ID

Método:

```http
GET
```

URL:

```text
http://localhost:3000/api/escenarios/1
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "nombre": "Ruta Urbana Centro",
    "descripcion": "Escenario con semáforos e intersecciones.",
    "tipoVia": "URBANA",
    "nivelDificultad": 3,
    "clima": "SOLEADO",
    "densidadTrafico": "ALTA",
    "activo": true
  },
  "message": "Escenario encontrado correctamente."
}
```

Cuando el escenario no existe:

```json
{
  "success": false,
  "data": null,
  "message": "Escenario no encontrado."
}
```

Código HTTP esperado:

```text
404 Not Found
```

---

# 6. Crear un escenario

Método:

```http
POST
```

URL:

```text
http://localhost:3000/api/escenarios
```

En Postman seleccionar:

```text
Body
raw
JSON
```

Enviar:

```json
{
  "nombre": "Intersección Escolar",
  "descripcion": "Cruce con estudiantes y límite de velocidad reducido.",
  "tipoVia": "URBANA",
  "nivelDificultad": 3,
  "clima": "SOLEADO",
  "densidadTrafico": "MEDIA"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "id": "4",
    "nombre": "Intersección Escolar",
    "descripcion": "Cruce con estudiantes y límite de velocidad reducido.",
    "tipoVia": "URBANA",
    "nivelDificultad": 3,
    "clima": "SOLEADO",
    "densidadTrafico": "MEDIA",
    "activo": true
  },
  "message": "Escenario creado correctamente."
}
```

Código HTTP esperado:

```text
201 Created
```

Explicación:

El método POST recibe datos en formato JSON. Primero se ejecuta el middleware de validación. Si los datos son correctos, el controlador llama al servicio y Sequelize guarda el registro en PostgreSQL.

---

# 7. Probar una validación incorrecta

Método:

```http
POST
```

URL:

```text
http://localhost:3000/api/escenarios
```

Enviar:

```json
{
  "nombre": "",
  "tipoVia": "CALLE",
  "nivelDificultad": 10,
  "clima": "NIEVE",
  "densidadTrafico": "MUCHA"
}
```

Respuesta esperada:

```json
{
  "success": false,
  "data": null,
  "message": "Los datos enviados no son válidos.",
  "errors": [
    {
      "field": "nombre",
      "message": "El nombre es obligatorio."
    },
    {
      "field": "tipoVia",
      "message": "El tipo de vía debe ser URBANA, RURAL, AUTOPISTA o MIXTA."
    },
    {
      "field": "nivelDificultad",
      "message": "El nivel de dificultad debe estar entre 1 y 5."
    },
    {
      "field": "clima",
      "message": "El clima debe ser SOLEADO, LLUVIOSO, NUBLADO o NOCTURNO."
    },
    {
      "field": "densidadTrafico",
      "message": "La densidad de tráfico debe ser BAJA, MEDIA o ALTA."
    }
  ]
}
```

Código HTTP esperado:

```text
400 Bad Request
```

Explicación:

Esta prueba demuestra que la aplicación no permite almacenar información incorrecta.

---

# 8. Actualizar un escenario

Método:

```http
PUT
```

URL:

```text
http://localhost:3000/api/escenarios/1
```

Enviar:

```json
{
  "nombre": "Ruta Urbana Centro Actualizada",
  "descripcion": "Escenario actualizado durante la demostración.",
  "tipoVia": "URBANA",
  "nivelDificultad": 4,
  "clima": "NUBLADO",
  "densidadTrafico": "ALTA"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "nombre": "Ruta Urbana Centro Actualizada",
    "descripcion": "Escenario actualizado durante la demostración.",
    "tipoVia": "URBANA",
    "nivelDificultad": 4,
    "clima": "NUBLADO",
    "densidadTrafico": "ALTA",
    "activo": true
  },
  "message": "Escenario actualizado correctamente."
}
```

Código HTTP esperado:

```text
200 OK
```

Explicación:

El método PUT modifica la información de un escenario existente utilizando su identificador.

---

# 9. Eliminar un escenario

Método:

```http
DELETE
```

URL:

```text
http://localhost:3000/api/escenarios/1
```

Respuesta esperada:

```json
{
  "success": true,
  "data": null,
  "message": "Escenario eliminado correctamente."
}
```

Código HTTP esperado:

```text
200 OK
```

Explicación:

La eliminación es lógica. El registro no se borra físicamente de PostgreSQL. El campo `activo` cambia de `true` a `false`.

---

# 10. Verificar la eliminación lógica

Consultar nuevamente:

```http
GET http://localhost:3000/api/escenarios
```

El escenario eliminado no debe aparecer en la lista.

Para comprobarlo directamente en PostgreSQL ejecutar:

```sql
SELECT
    id,
    nombre,
    tipo_via,
    nivel_dificultad,
    clima,
    densidad_trafico,
    activo,
    creado_en,
    actualizado_en
FROM escenarios
ORDER BY id;
```

El registro eliminado debe aparecer con:

```text
activo = false
```

---

# 11. Insertar datos iniciales

Detener el servidor con:

```text
Ctrl + C
```

Ejecutar:

```bash
npm run seed
```

Resultado esperado:

```text
Conexión exitosa con PostgreSQL.
Datos iniciales registrados correctamente.
```

Luego iniciar nuevamente:

```bash
npm run dev
```

Explicación:

El archivo `seed.js` inserta escenarios de prueba para facilitar la demostración.

---

# 12. Consultas SQL para la demostración

Consultar todos los registros:

```sql
SELECT * FROM escenarios;
```

Consultar solamente registros activos:

```sql
SELECT *
FROM escenarios
WHERE activo = true;
```

Consultar registros eliminados lógicamente:

```sql
SELECT *
FROM escenarios
WHERE activo = false;
```

Contar escenarios:

```sql
SELECT COUNT(*) AS total_escenarios
FROM escenarios;
```

Consultar por nivel de dificultad:

```sql
SELECT
    nombre,
    nivel_dificultad
FROM escenarios
ORDER BY nivel_dificultad DESC;
```

---

# 13. Comandos Git utilizados

Ver la rama actual:

```bash
git branch
```

Ver los archivos modificados:

```bash
git status
```

Agregar los cambios:

```bash
git add .
```

Crear un commit:

```bash
git commit -m "Implementar CRUD de escenarios con Express y PostgreSQL"
```

Subir la rama:

```bash
git push
```

Explicación:

El desarrollo se realiza en una rama independiente para evitar modificar directamente la rama principal.

---

# 14. Resumen de endpoints

```text
GET     /api/health
GET     /api/escenarios
GET     /api/escenarios/:id
POST    /api/escenarios
PUT     /api/escenarios/:id
DELETE  /api/escenarios/:id
```

---

# 15. Flujo completo de la API

```text
Cliente o Postman
        ↓
Método HTTP y endpoint
        ↓
Router de Express
        ↓
Middleware de validación
        ↓
Controller
        ↓
Service
        ↓
Modelo Sequelize
        ↓
PostgreSQL
        ↓
Respuesta JSON
```

---

# 16. Conclusión de la demostración

En la demostración se comprueba:

```text
 Servidor Express funcionando.
 Conexión con PostgreSQL.
 Uso de Sequelize como ORM.
 Consulta de escenarios mediante GET.
 Registro de escenarios mediante POST.
 Actualización mediante PUT.
 Eliminación lógica mediante DELETE.
 Validación de datos incorrectos.
 Persistencia de la información.
```