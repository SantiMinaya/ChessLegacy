import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [jugadores, setJugadores] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [aperturas, setAperturas] = useState([]);
  const [aperturaSeleccionada, setAperturaSeleccionada] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [paginacion, setPaginacion] = useState({ page: 1, totalPages: 1, total: 0 });
  const [posiciones, setPosiciones] = useState([]);
  const [posicionActual, setPosicionActual] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [importando, setImportando] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/jugadores`).then(res => setJugadores(res.data));
  }, []);

  const cargarPosiciones = async (jugadorId) => {
    const res = await axios.get(`${API_URL}/jugadores/${jugadorId}/posiciones`);
    setPosiciones(res.data);
    setJugadorSeleccionado(jugadorId);
    setResultado(null);
  };

  const cargarAperturas = async (jugadorId) => {
    const res = await axios.get(`${API_URL}/jugadores/${jugadorId}/aperturas`);
    setAperturas(res.data);
    setJugadorSeleccionado(jugadorId);
    setAperturaSeleccionada(null);
    setPartidas([]);
    setPosiciones([]);
    setResultado(null);
  };

  const cargarPartidasPorApertura = async (codigoECO, page = 1) => {
    const res = await axios.get(`${API_URL}/jugadores/${jugadorSeleccionado}/partidas/${codigoECO}?page=${page}&pageSize=20`);
    setPartidas(res.data.partidas);
    setPaginacion({
      page: res.data.page,
      totalPages: res.data.totalPages,
      total: res.data.total
    });
    setAperturaSeleccionada(codigoECO);
    setPosiciones([]);
    setResultado(null);
  };

  const seleccionarPosicion = (posicion) => {
    setPosicionActual(posicion);
    setResultado(null);
  };

  const onDrop = async (sourceSquare, targetSquare) => {
    if (!posicionActual) return false;

    const movimiento = sourceSquare + targetSquare;

    try {
      const res = await axios.post(`${API_URL}/analisis`, {
        posicionId: posicionActual.id,
        movimientoJugado: movimiento
      });
      setResultado(res.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !jugadorSeleccionado) return;

    setImportando(true);
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('jugadorId', jugadorSeleccionado);

    try {
      const res = await axios.post(`${API_URL}/import/pgn`, formData);
      alert(res.data.mensaje);
      cargarPosiciones(jugadorSeleccionado);
    } catch (error) {
      alert('Error al importar: ' + error.message);
    } finally {
      setImportando(false);
    }
  };

  return (
    <div className="app">
      <h1>♟️ Chess Legacy</h1>
      
      <div className="jugadores">
        {jugadores.map(j => (
          <button key={j.id} onClick={() => cargarAperturas(j.id)}>
            {j.nombre}
          </button>
        ))}
      </div>

      {jugadorSeleccionado && (
        <div className="import-section">
          <label className="file-upload">
            {importando ? 'Importando...' : '📁 Importar PGN'}
            <input type="file" accept=".pgn" onChange={handleFileUpload} disabled={importando} />
          </label>
        </div>
      )}

      {aperturas.length > 0 && (
        <div className="aperturas">
          <h3>Aperturas:</h3>
          {aperturas.map(a => (
            <button key={a.codigoECO} onClick={() => cargarPartidasPorApertura(a.codigoECO)}>
              {a.codigoECO} - {a.nombreApertura} ({a.cantidadPartidas})
            </button>
          ))}
        </div>
      )}

      {partidas.length > 0 && (
        <div className="partidas">
          <h3>Partidas con {aperturaSeleccionada} ({paginacion.total} total):</h3>
          {partidas.map(p => (
            <div key={p.id} className="partida-item">
              <strong>{p.evento} ({p.anio})</strong> vs {p.oponente}
              <pre>{p.pgn}</pre>
            </div>
          ))}
          {paginacion.totalPages > 1 && (
            <div className="paginacion">
              <button 
                disabled={paginacion.page === 1}
                onClick={() => cargarPartidasPorApertura(aperturaSeleccionada, paginacion.page - 1)}
              >
                ← Anterior
              </button>
              <span>Página {paginacion.page} de {paginacion.totalPages}</span>
              <button 
                disabled={paginacion.page === paginacion.totalPages}
                onClick={() => cargarPartidasPorApertura(aperturaSeleccionada, paginacion.page + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}

      {posiciones.length > 0 && (
        <div className="posiciones">
          <h3>Posiciones disponibles:</h3>
          {posiciones.map(p => (
            <button key={p.id} onClick={() => seleccionarPosicion(p)}>
              {p.tipoPosicion} - {p.movimientoHistorico}
            </button>
          ))}
        </div>
      )}

      {posicionActual && (
        <div className="tablero">
          <Chessboard 
            position={posicionActual.fen} 
            onPieceDrop={onDrop}
          />
        </div>
      )}

      {resultado && (
        <div className="resultado">
          <h2>Resultado del Análisis</h2>
          <p><strong>Tu movimiento:</strong> {resultado.movimientoJugado}</p>
          <p><strong>Mejor movimiento:</strong> {resultado.mejorMovimiento}</p>
          <p><strong>Precisión:</strong> {resultado.scorePrecision.toFixed(1)}/100</p>
          <p><strong>Estilo:</strong> {resultado.scoreEstilo.toFixed(1)}/100</p>
          <p><strong>Score Final:</strong> {resultado.scoreFinal.toFixed(1)}/100</p>
          <p className="mensaje">{resultado.mensaje}</p>
        </div>
      )}
    </div>
  );
}

export default App;
