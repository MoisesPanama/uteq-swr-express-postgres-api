/**
 * Cliente HTTP centralizado hacia el backend Spring Boot de ArtiSync.
 * Todos los controllers importan esta única instancia de axios.
 */
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Traduce errores de axios (backend caído, 401, 404, 500...) a un texto simple
function describirError(err) {
  if (err.response) {
    return `El backend respondió con error ${err.response.status}: ${
      err.response.data?.mensaje || err.response.data?.message || 'sin detalle'
    }`;
  }
  return `No se pudo conectar con el backend en ${API_BASE_URL}. ¿Está corriendo el Spring Boot?`;
}

module.exports = { apiClient, API_BASE_URL, describirError };
