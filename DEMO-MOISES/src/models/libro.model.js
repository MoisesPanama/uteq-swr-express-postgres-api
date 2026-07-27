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
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  portadaUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'portada_url',
  },
  anioPublicacion: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'anio_publicacion',
  },
  // Llaves foráneas explícitas (Sequelize también las crea al definir
  // las asociaciones en models/index.js, pero declararlas aquí deja
  // claro en el modelo cuáles son las columnas de la relación).
  editorialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'editorial_id',
  },
  idiomaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idioma_id',
  },
  estadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'estado_id',
  },
  stockTotal: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
    field: 'stock_total',
  },
  stockDisponible: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
    field: 'stock_disponible',
  },
  ubicacionFisica: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'ubicacion_fisica',
  },
}, {
  tableName: 'libros',
  timestamps: true,
  createdAt: 'fecha_registro',
  updatedAt: 'actualizado_en',
});

module.exports = Libro;