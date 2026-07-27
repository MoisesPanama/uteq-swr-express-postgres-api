const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla de referencia: catálogo de idiomas.
// Un Libro pertenece a un Idioma (relación 1:N).
const Idioma = sequelize.define('Idioma', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  codigoIso: {
    type: DataTypes.STRING(5),
    allowNull: false,
    unique: true,
    field: 'codigo_iso',
  },
}, {
  tableName: 'idiomas',
  timestamps: false,
});

module.exports = Idioma;