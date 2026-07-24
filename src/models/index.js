const sequelize = require('../config/database');
const Libro = require('./libro.model');

const db = {
  sequelize,
  Libro,
};

module.exports = db;