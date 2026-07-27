# DEMO PRACTICADO - EXPRESS.JS

## Objetivo

Realizar una demostración del funcionamiento de una API REST desarrollada con Express.js, Sequelize y PostgreSQL utilizando la entidad Escenario.

---

# 1. Presentación

Explicar brevemente el proyecto.

"Este proyecto consiste en una API REST desarrollada con Express.js.
Para la demostración se reutiliza la entidad Escenario del proyecto SBVIA, implementando un CRUD completo conectado a PostgreSQL mediante Sequelize."

---

# 2. Mostrar la estructura del proyecto

Explicar las carpetas principales.

- src/config
- src/models
- src/services
- src/controllers
- src/routes
- src/middlewares
- docs

---

# 3. Mostrar package.json

Explicar:

- Dependencias
- Scripts
- Express
- Sequelize
- PostgreSQL
- Nodemon

---

# 4. Mostrar .env

Explicar que:

- Guarda la configuración.
- No debe subirse a GitHub.
- Contiene la información de conexión.

---

# 5. Mostrar database.js

Explicar:

- Sequelize crea la conexión.
- authenticate() verifica la conexión.
- Las credenciales se leen desde .env.

---

# 6. Mostrar el modelo Escenario

Explicar:

- Representa la tabla escenarios.
- Cada atributo corresponde a una columna.
- Sequelize genera la tabla automáticamente.

---

# 7. Mostrar Service

Explicar:

Aquí se encuentra la lógica del sistema.

Funciones:

- listarEscenarios()
- buscarEscenarioPorId()
- crearEscenario()
- actualizarEscenario()
- eliminarEscenario()

---

# 8. Mostrar Controller

Explicar:

Recibe las peticiones HTTP.

Se comunica con el Service.

Devuelve respuestas JSON.

---

# 9. Mostrar Routes

Explicar los endpoints.

GET /api/escenarios

POST /api/escenarios

PUT /api/escenarios/:id

DELETE /api/escenarios/:id

---

# 10. Ejecutar el proyecto

Abrir la terminal.

Ejecutar:

npm run dev

Esperar:

Conexión exitosa.

Servidor iniciado.

---

# 11. Abrir Postman

Realizar

GET

http://localhost:3000/api/escenarios

Explicar que se consultan todos los escenarios.

---

# 12. Crear un escenario

POST

http://localhost:3000/api/escenarios

Enviar un JSON válido.

Explicar que:

- El middleware valida.
- El controlador recibe.
- El servicio procesa.
- Sequelize realiza el INSERT.
- PostgreSQL almacena la información.

---

# 13. Consultar nuevamente

GET

Comprobar que el nuevo registro fue almacenado.

---

# 14. Actualizar

PUT

Modificar el escenario.

---

# 15. Eliminar

DELETE

Explicar que la eliminación es lógica.

El campo activo cambia a false.

---

# 16. Conclusión

Con esta práctica se demostró:

Conexión entre Express y PostgreSQL.

 Uso de Sequelize como ORM.
 
 Arquitectura por capas.

Implementación de una API REST.

Operaciones CRUD mediante solicitudes HTTP.