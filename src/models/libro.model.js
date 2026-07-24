const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Libro = sequelize.define('Libro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isbn: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  autor: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  anioPublicacion: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'anio_publicacion',
  },
  stockDisponible: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
    field: 'stock_disponible',
  },
}, {
  tableName: 'libros',
  timestamps: true,
});

module.exports = Libro;