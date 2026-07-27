const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla de referencia: catálogo de editoriales.
// Un Libro pertenece a una Editorial (relación 1:N).
const Editorial = sequelize.define('Editorial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  paisOrigen: {
    type: DataTypes.STRING(80),
    allowNull: true,
    field: 'pais_origen',
  },
}, {
  tableName: 'editoriales',
  timestamps: false,
});

module.exports = Editorial;