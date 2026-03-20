import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const partidasAPI = {
  getAll: (params = {}) => axios.get(`${API_URL}/partidas`, { params }),
  getById: (id) => axios.get(`${API_URL}/partidas/${id}`),
  buscarPorPgn: (jugadorId, pgnStart) => axios.get(`${API_URL}/partidas/buscar-por-pgn`, { params: { jugadorId, pgnStart } }),
  getDelDia: () => axios.get(`${API_URL}/partidas/del-dia`),
  buscarPorFen: (fen) => axios.get(`${API_URL}/partidas/buscar-fen`, { params: { fen } }),
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
  getAprendizajeRandom: () => axios.get(`${API_URL}/aperturas/aprendizaje/random`),
  getAprendizajeEspaciado: (token) => axios.get(`${API_URL}/aperturas/aprendizaje/random-espaciado`, { headers: { Authorization: `Bearer ${token}` } }),
};

export const authAPI = {
  login: (username, password) => axios.post(`${API_URL}/auth/login`, { username, password }),
  register: (username, password) => axios.post(`${API_URL}/auth/register`, { username, password }),
};

export const progresoAPI = {
  get: (token) => axios.get(`${API_URL}/progreso`, { headers: { Authorization: `Bearer ${token}` } }),
  guardarSesion: (token, data) => axios.post(`${API_URL}/progreso/sesion`, data, { headers: { Authorization: `Bearer ${token}` } }),
  guardarTorneo: (token, data) => axios.post(`${API_URL}/progreso/torneo`, data, { headers: { Authorization: `Bearer ${token}` } }),
  getCalendario: (token) => axios.get(`${API_URL}/progreso/calendario`, { headers: { Authorization: `Bearer ${token}` } }),
  guardarPartida: (token, data) => axios.post(`${API_URL}/progreso/partida`, data, { headers: { Authorization: `Bearer ${token}` } }),
  getPartidas: (token) => axios.get(`${API_URL}/progreso/partidas`, { headers: { Authorization: `Bearer ${token}` } }),
  getClasificacion: () => axios.get(`${API_URL}/clasificacion`),
  subirFoto: (token, fotoBase64) => axios.post(`${API_URL}/progreso/foto`, { fotoBase64 }, { headers: { Authorization: `Bearer ${token}` } }),
  registrarLogro: (token, codigo) => axios.post(`${API_URL}/progreso/logro`, { codigo }, { headers: { Authorization: `Bearer ${token}` } }),
};
