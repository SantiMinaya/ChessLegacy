import { useState, useEffect } from 'react';
import { partidasAPI, analisisAPI } from '../services/api';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import EvaluationBar from '../components/EvaluationBar';
import Select from 'react-select';
import './PartidasFamosas.css';

export default function PartidasFamosas({ jugadorId, jugadorNombre, onBack }) {
  const [partidas, setPartidas] = useState([]);
  const [partidaActual, setPartidaActual] = useState(null);
  const [position, setPosition] = useState('start');
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [filtros, setFiltros] = useState({ anioDesde: '', anioHasta: '', oponente: '', evento: '', apertura: '', variante: '' });
  const [total, setTotal] = useState(0);
  const [evaluation, setEvaluation] = useState(0);
  const [analizando, setAnalizando] = useState(false);
  const [aperturas, setAperturas] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [aperturaSeleccionada, setAperturaSeleccionada] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(`favoritos_${jugadorId}`) || '[]');
    setFavoritos(favs);
  }, [jugadorId]);

  useEffect(() => {
    cargarPartidas();
  }, [jugadorId, filtros, mostrarSoloFavoritos]);

  useEffect(() => {
    cargarAperturas();
  }, []);

  useEffect(() => {
    if (aperturaSeleccionada) {
      cargarVariantes(aperturaSeleccionada.value);
    } else {
      setVariantes([]);
    }
  }, [aperturaSeleccionada]);

  const toggleFavorito = (partidaId) => {
    const newFavoritos = favoritos.includes(partidaId)
      ? favoritos.filter(id => id !== partidaId)
      : [...favoritos, partidaId];
    
    setFavoritos(newFavoritos);
    localStorage.setItem(`favoritos_${jugadorId}`, JSON.stringify(newFavoritos));
  };

  const cargarAperturas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/aperturas');
      const data = await response.json();
      setAperturas(data.map(a => ({ value: a, label: a })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarVariantes = async (apertura) => {
    try {
      const response = await fetch(`http://localhost:5000/api/aperturas/${encodeURIComponent(apertura)}/variantes`);
      const data = await response.json();
      setVariantes(data.map(v => ({ value: v, label: v })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarPartidas = async () => {
    try {
      const params = { jugadorId, pageSize: 200 };
      if (filtros.anioDesde) params.anioDesde = parseInt(filtros.anioDesde);
      if (filtros.anioHasta) params.anioHasta = parseInt(filtros.anioHasta);
      if (filtros.oponente) params.oponente = filtros.oponente;
      if (filtros.evento) params.evento = filtros.evento;
      if (filtros.apertura) params.nombreApertura = filtros.apertura;
      if (filtros.variante) params.variante = filtros.variante;
      
      const { data } = await partidasAPI.getAll(params);
      let partidasData = data.partidas;
      
      if (mostrarSoloFavoritos) {
        partidasData = partidasData.filter(p => favoritos.includes(p.id));
      }
      
      setPartidas(partidasData);
      setTotal(partidasData.length);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({ anioDesde: '', anioHasta: '', oponente: '', evento: '', apertura: '', variante: '' });
    setAperturaSeleccionada(null);
  };

  const seleccionarPartida = (partida) => {
    setPartidaActual(partida);
    
    const moves = partida.pgn
      .replace(/\d+\./g, '')
      .replace(/[\{\[].*?[\}\]]/g, '')
      .replace(/1-0|0-1|1\/2-1\/2/g, '')
      .trim()
      .split(/\s+/)
      .filter(m => m.length > 0);
    
    setHistory(moves);
    setCurrentMove(0);
    setPosition('start');
  };

  const siguiente = () => {
    if (currentMove >= history.length) return;
    
    const chess = new Chess();
    for (let i = 0; i <= currentMove; i++) {
      try {
        chess.move(history[i]);
      } catch (e) {
        console.error('Error movimiento', i, history[i], e);
      }
    }
    setPosition(chess.fen());
    setCurrentMove(currentMove + 1);
    analizarPosicion(chess.fen());
  };

  const anterior = () => {
    if (currentMove === 0) return;
    
    const chess = new Chess();
    for (let i = 0; i < currentMove - 1; i++) {
      try {
        chess.move(history[i]);
      } catch (e) {}
    }
    const newFen = chess.fen();
    setPosition(newFen);
    setCurrentMove(currentMove - 1);
    analizarPosicion(newFen);
  };

  const reiniciar = () => {
    setPosition('start');
    setCurrentMove(0);
    setEvaluation(0);
  };

  const irAlFinal = () => {
    const chess = new Chess();
    for (let i = 0; i < history.length; i++) {
      try {
        chess.move(history[i]);
      } catch (e) {}
    }
    const finalFen = chess.fen();
    setPosition(finalFen);
    setCurrentMove(history.length);
    analizarPosicion(finalFen);
  };

  const irAMovimiento = (moveNumber) => {
    if (moveNumber === 0) {
      reiniciar();
      return;
    }
    
    const chess = new Chess();
    for (let i = 0; i < moveNumber; i++) {
      try {
        chess.move(history[i]);
      } catch (e) {}
    }
    setPosition(chess.fen());
    setCurrentMove(moveNumber);
    analizarPosicion(chess.fen());
  };

  const analizarPosicion = async (fen) => {
    setAnalizando(true);
    try {
      const { data } = await analisisAPI.evaluar(fen);
      setEvaluation(data.evaluacion);
    } catch (error) {
      console.error('Error al analizar:', error);
    } finally {
      setAnalizando(false);
    }
  };

  return (
    <div className="partidas-container">
      <button onClick={onBack} className="partidas-back-btn">← Volver</button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="partidas-title">Partidas ({total} partidas)</h2>
        <button 
          onClick={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
          className="partidas-back-btn"
          style={{ marginBottom: 0 }}
        >
          {mostrarSoloFavoritos ? '📋 Todas' : '⭐ Favoritos'} ({favoritos.length})
        </button>
      </div>
      
      <div className="filtros-container">
        <h3 style={{ marginTop: 0 }}>Filtros</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Año desde"
            value={filtros.anioDesde}
            onChange={(e) => setFiltros({ ...filtros, anioDesde: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Año hasta"
            value={filtros.anioHasta}
            onChange={(e) => setFiltros({ ...filtros, anioHasta: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Oponente"
            value={filtros.oponente}
            onChange={(e) => setFiltros({ ...filtros, oponente: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Evento"
            value={filtros.evento}
            onChange={(e) => setFiltros({ ...filtros, evento: e.target.value })}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: aperturaSeleccionada ? '1fr 1fr' : '1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Apertura</label>
            <Select
              value={aperturaSeleccionada}
              onChange={(option) => {
                setAperturaSeleccionada(option);
                setFiltros({ ...filtros, apertura: option?.value || '', variante: '' });
              }}
              options={aperturas}
              isClearable
              placeholder="Buscar apertura..."
              styles={{
                control: (base) => ({ ...base, minHeight: '38px' }),
                menu: (base) => ({ ...base, zIndex: 9999 })
              }}
            />
          </div>
          {aperturaSeleccionada && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Variante</label>
              <Select
                value={variantes.find(v => v.value === filtros.variante) || null}
                onChange={(option) => setFiltros({ ...filtros, variante: option?.value || '' })}
                options={variantes}
                isClearable
                placeholder="Seleccionar variante..."
                styles={{
                  control: (base) => ({ ...base, minHeight: '38px' }),
                  menu: (base) => ({ ...base, zIndex: 9999 })
                }}
              />
            </div>
          )}
        </div>
        <button onClick={limpiarFiltros} style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>Limpiar filtros</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px' }}>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {partidas.map(p => (
            <div
              key={p.id}
              className={`partida-item ${partidaActual?.id === p.id ? 'selected' : ''}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div onClick={() => seleccionarPartida(p)} style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.evento}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>vs {p.oponente}</div>
                <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>{p.anio}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorito(p.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px',
                  filter: favoritos.includes(p.id) ? 'none' : 'grayscale(100%) brightness(2)'
                }}
              >
                ⭐
              </button>
            </div>
          ))}
        </div>

        <div>
          {partidaActual ? (
            <>
              <div className="partida-info">
                <div style={{ flex: 1 }}>
                  <h3>{partidaActual.evento} ({partidaActual.anio})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                    <div><strong>Oponente:</strong> {partidaActual.oponente}</div>
                    <div><strong>Resultado:</strong> {partidaActual.resultado || 'N/A'}</div>
                    <div><strong>ECO:</strong> {partidaActual.codigoECO || 'N/A'}</div>
                    <div><strong>Apertura:</strong> {partidaActual.nombreApertura || 'N/A'}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorito(partidaActual.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '32px',
                    cursor: 'pointer',
                    padding: '0',
                    marginLeft: '20px',
                    filter: favoritos.includes(partidaActual.id) ? 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.8))' : 'grayscale(100%) brightness(2)'
                  }}
                >
                  ⭐
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 500px 1fr', gap: '20px', alignItems: 'start' }}>
                <EvaluationBar evaluation={evaluation} inverted={partidaActual.colorJugador === 'Negras'} />
                
                <div style={{ width: '500px' }}>
                  <div className="player-name">
                    {partidaActual.colorJugador === 'Negras' ? partidaActual.oponente : jugadorNombre}
                  </div>
                  
                  <Chessboard 
                    position={position}
                    boardWidth={500}
                    animationDuration={200}
                    boardOrientation={partidaActual.colorJugador === 'Negras' ? 'black' : 'white'}
                  />
                  
                  <div className="player-name">
                    {partidaActual.colorJugador === 'Negras' ? jugadorNombre : partidaActual.oponente}
                  </div>
                  
                  <div className="controls-container">
                    <button onClick={reiniciar}>⏮ Inicio</button>
                    <button onClick={anterior} disabled={currentMove === 0}>◀ Anterior</button>
                    <button onClick={siguiente} disabled={currentMove >= history.length}>Siguiente ▶</button>
                    <button onClick={irAlFinal}>Fin ⏭</button>
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#ccc' }}>
                      Movimiento {currentMove} / {history.length}
                    </div>
                  </div>
                </div>
                
                <div className="moves-container">
                  <h4>Movimientos</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', fontSize: '13px' }}>
                    {history.map((move, idx) => (
                      <div
                        key={idx}
                        onClick={() => irAMovimiento(idx + 1)}
                        className={`move-item ${currentMove === idx + 1 ? 'current' : ''}`}
                      >
                        {Math.floor(idx / 2) + 1}{idx % 2 === 0 ? '.' : '...'} {move}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              Selecciona una partida para visualizarla
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
