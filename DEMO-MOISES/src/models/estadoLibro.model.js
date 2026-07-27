const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabla de referencia: catálogo de estados posibles de un libro.
// Valores esperados: ACTIVO, DADO_DE_BAJA, EN_REPARACION, PERDIDO.
// El DELETE de un libro NO borra la fila: le cambia el estado a
// 'DADO_DE_BAJA' (soft delete).
const EstadoLibro = sequelize.define('EstadoLibro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'estados_libro',
  timestamps: false,
});

module.exports = EstadoLibro;