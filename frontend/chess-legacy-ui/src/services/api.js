import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const partidasAPI = {
  getAll: (params = {}) => axios.get(`${API_URL}/partidas`, { params }),
  getById: (id) => axios.get(`${API_URL}/partidas/${id}`),
  buscarPorPgn: (jugadorId, pgnStart) => axios.get(`${API_URL}/partidas/buscar-por-pgn`, { params: { jugadorId, pgnStart } }),
};

export const jugadoresAPI = {
  getAll: () => axios.get(`${API_URL}/jugadores`),
  getById: (id) => axios.get(`${API_URL}/jugadores/${id}`),
};

export const analisisAPI = {
  evaluar: (fen) => axios.post(`${API_URL}/analisis/evaluar`, { fen }),
};

export const aperturasAPI = {
  getAll: () => axios.get(`${API_URL}/aperturas`),
  getVariantes: (apertura) => axios.get(`${API_URL}/aperturas/${encodeURIComponent(apertura)}/variantes`),
  getAprendizaje: (apertura, variante) => axios.get(`${API_URL}/aperturas/aprendizaje`, { params: { apertura, variante } }),
};
