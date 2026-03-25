import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progresoAPI } from '../services/api';
import { chessMasters } from '../data/masters';
import './HistorialPartidas.css';

const RESULTADO_LABEL = { win: '✅ Victoria', loss: '❌ Derrota', draw: '🤝 Tablas' };
const RESULTADO_COLOR = { win: '#4caf50', loss: '#f44336', draw: '#ff9800' };

function exportPgn(pgn, maestro, fecha) {
  const blob = new Blob([pgn], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vs_${maestro}_${fecha.slice(0, 10)}.pgn`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistorialPartidas() {
  const { user } = useAuth();
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMaestro, setFiltroMaestro] = useState('');
  const [filtroResultado, setFiltroResultado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState(''); // '' | 'torneo' | 'libre'
  const [partidaAbierta, setPartidaAbierta] = useState(null);

  const maestrosDisponibles = [...new Set(partidas.map(p => p.maestro))].sort();

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    const params = {};
    if (filtroMaestro)   params.maestro    = filtroMaestro;
    if (filtroResultado) params.resultado  = filtroResultado;
    if (filtroTipo === 'torneo') params.esTorneo = true;
    if (filtroTipo === 'libre')  params.esTorneo = false;

    progresoAPI.getPartidas(user.token, params)
      .then(r => setPartidas(r.data))
      .catch(() => setPartidas([]))
      .finally(() => setLoading(false));
  }, [user, filtroMaestro, filtroResultado, filtroTipo]);

  const stats = {
    total:    partidas.length,
    victorias: partidas.filter(p => p.resultado === 'win').length,
    derrotas:  partidas.filter(p => p.resultado === 'loss').length,
    tablas:    partidas.filter(p => p.resultado === 'draw').length,
  };
  const winrate = stats.total > 0 ? Math.round((stats.victorias / stats.total) * 100) : 0;

  return (
    <div className="historial">
      <h2>📚 Historial de Partidas</h2>
      <p className="historial-subtitle">Todas tus partidas contra los maestros</p>

      {/* Stats rápidas */}
      <div className="historial-stats">
        <div className="h-stat"><span>{stats.total}</span><label>Partidas</label></div>
        <div className="h-stat win"><span>{stats.victorias}</span><label>Victorias</label></div>
        <div className="h-stat loss"><span>{stats.derrotas}</span><label>Derrotas</label></div>
        <div className="h-stat draw"><span>{stats.tablas}</span><label>Tablas</label></div>
        <div className="h-stat"><span>{winrate}%</span><label>Winrate</label></div>
      </div>

      {/* Filtros */}
      <div className="historial-filtros">
        <select value={filtroMaestro} onChange={e => setFiltroMaestro(e.target.value)}>
          <option value="">Todos los maestros</option>
          {maestrosDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select value={filtroResultado} onChange={e => setFiltroResultado(e.target.value)}>
          <option value="">Todos los resultados</option>
          <option value="win">✅ Victorias</option>
          <option value="loss">❌ Derrotas</option>
          <option value="draw">🤝 Tablas</option>
        </select>

        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="torneo">🏆 Torneo</option>
          <option value="libre">⚔️ Partida libre</option>
        </select>

        {(filtroMaestro || filtroResultado || filtroTipo) && (
          <button className="h-clear-btn" onClick={() => { setFiltroMaestro(''); setFiltroResultado(''); setFiltroTipo(''); }}>
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>⏳ Cargando...</p>
      ) : partidas.length === 0 ? (
        <div className="historial-empty">
          <span style={{ fontSize: 48 }}>♟️</span>
          <p>No hay partidas con estos filtros</p>
        </div>
      ) : (
        <div className="historial-lista">
          {partidas.map(p => {
            const master = chessMasters.find(m => m.name === p.maestro);
            const fecha = new Date(p.fechaJugada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            const hora  = new Date(p.fechaJugada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={p.id} className={`historial-card ${partidaAbierta === p.id ? 'open' : ''}`}>
                <div className="historial-card-header" onClick={() => setPartidaAbierta(partidaAbierta === p.id ? null : p.id)}>
                  <div className="h-card-left">
                    {master?.photo
                      ? <img src={master.photo} alt={p.maestro} className="h-master-photo" />
                      : <div className="h-master-placeholder">♟</div>
                    }
                    <div>
                      <div className="h-maestro">{p.maestro}</div>
                      <div className="h-meta">
                        <span style={{ color: p.colorJugador === 'white' ? '#f0d9b5' : '#b58863' }}>
                          {p.colorJugador === 'white' ? '♔ Blancas' : '♚ Negras'}
                        </span>
                        <span className="h-sep">·</span>
                        <span>{p.totalMovimientos} movimientos</span>
                        <span className="h-sep">·</span>
                        <span>{p.esTorneo ? '🏆 Torneo' : '⚔️ Libre'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-card-right">
                    <span className="h-resultado" style={{ color: RESULTADO_COLOR[p.resultado] }}>
                      {RESULTADO_LABEL[p.resultado]}
                    </span>
                    <span className="h-fecha">{fecha} {hora}</span>
                    <span className="h-chevron">{partidaAbierta === p.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {partidaAbierta === p.id && (
                  <div className="historial-card-body">
                    <div className="h-pgn-box">
                      <pre className="h-pgn">{p.pgn}</pre>
                    </div>
                    <button className="h-export-btn" onClick={() => exportPgn(p.pgn, p.maestro, p.fechaJugada)}>
                      📥 Exportar PGN
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
