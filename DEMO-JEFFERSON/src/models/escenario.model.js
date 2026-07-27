const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Escenario = sequelize.define(
  'Escenario',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es obligatorio.'
        },
        len: {
          args: [3, 150],
          msg: 'El nombre debe tener entre 3 y 150 caracteres.'
        }
      }
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    tipoVia: {
      type: DataTypes.ENUM(
        'URBANA',
        'RURAL',
        'AUTOPISTA',
        'MIXTA'
      ),
      allowNull: false,
      field: 'tipo_via'
    },

    nivelDificultad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'nivel_dificultad',
      validate: {
        min: {
          args: [1],
          msg: 'El nivel mínimo es 1.'
        },
        max: {
          args: [5],
          msg: 'El nivel máximo es 5.'
        }
      }
    },

    clima: {
      type: DataTypes.ENUM(
        'SOLEADO',
        'LLUVIOSO',
        'NUBLADO',
        'NOCTURNO'
      ),
      allowNull: false
    },

    densidadTrafico: {
      type: DataTypes.ENUM(
        'BAJA',
        'MEDIA',
        'ALTA'
      ),
      allowNull: false,
      field: 'densidad_trafico'
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'escenarios',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  }
);

module.exports = Escenario;
