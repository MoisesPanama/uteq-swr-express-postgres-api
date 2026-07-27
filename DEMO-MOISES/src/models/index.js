const sequelize = require('../config/database');
const Libro = require('./libro.model');
const Editorial = require('./editorial.model');
const Idioma = require('./idioma.model');
const EstadoLibro = require('./estadoLibro.model');

// ── Relaciones (acceso a datos relacional con Sequelize) ──────────
// Un Libro pertenece a una Editorial, un Idioma y un EstadoLibro.
// Cada tabla de referencia puede tener muchos libros asociados.
Libro.belongsTo(Editorial, { foreignKey: 'editorialId', as: 'editorial' });
Editorial.hasMany(Libro, { foreignKey: 'editorialId', as: 'libros' });

Libro.belongsTo(Idioma, { foreignKey: 'idiomaId', as: 'idioma' });
Idioma.hasMany(Libro, { foreignKey: 'idiomaId', as: 'libros' });

Libro.belongsTo(EstadoLibro, { foreignKey: 'estadoId', as: 'estado' });
EstadoLibro.hasMany(Libro, { foreignKey: 'estadoId', as: 'libros' });

const db = {
  sequelize,
  Libro,
  Editorial,
  Idioma,
  EstadoLibro,
};

module.exports = db;