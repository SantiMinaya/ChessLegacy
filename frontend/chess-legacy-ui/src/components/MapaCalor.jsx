import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { partidasAPI, jugadoresAPI } from '../services/api';
import { chessMasters } from '../data/masters';

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['8','7','6','5','4','3','2','1'];

const PIEZAS = {
  all: 'Todas las piezas',
  p: 'Peones',
  n: 'Caballos',
  b: 'Alfiles',
  r: 'Torres',
  q: 'Damas',
  k: 'Reyes',
};

function calcularCalor(partidas, pieza, color) {
  const mapa = {};
  FILES.forEach(f => RANKS.forEach(r => { mapa[f + r] = 0; }));
  let total = 0;

  for (const p of partidas) {
    if (!p.pgn) continue;
    try {
      const lines = p.pgn.split('\n').filter(l => !l.trim().startsWith('['));
      const text = lines.join(' ').trim();
      const tokens = text.split(/\s+/).filter(t => t && !/^\d+\./.test(t) && !['1-0','0-1','1/2-1/2','*'].includes(t));
      const g = new Chess();
      for (const t of tokens) {
        try {
          if (!g.move(t)) break;
          // Recorrer el tablero y contar piezas en cada casilla
          const board = g.board();
          for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
              const sq = board[rank][file];
              if (!sq) continue;
              if (sq.color !== color) continue;
              if (pieza !== 'all' && sq.type !== pieza) continue;
              const casilla = FILES[file] + (8 - rank);
              mapa[casilla]++;
              total++;
            }
          }
        } catch { break; }
      }
    } catch {}
  }

  // Normalizar 0-100
  const max = Math.max(...Object.values(mapa), 1);
  const normalizado = {};
  Object.entries(mapa).forEach(([k, v]) => { normalizado[k] = Math.round((v / max) * 100); });
  return { mapa: normalizado, total };
}

function colorCalor(valor) {
  if (valor === 0) return 'transparent';
  const r = Math.round(212 * valor / 100);
  const g = Math.round(175 * valor / 100);
  const b = Math.round(55 * valor / 100);
  const alpha = 0.15 + (valor / 100) * 0.75;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function MapaCalor() {
  const [masterSel, setMasterSel] = useState(null);
  const [pieza, setPieza] = useState('all');
  const [colorSel, setColorSel] = useState('w');
  const [mapa, setMapa] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [numPartidas, setNumPartidas] = useState(0);

  useEffect(() => {
    jugadoresAPI.getAll().then(r => setJugadores(r.data)).catch(() => {});
  }, []);

  const calcular = async (master, p, c) => {
    if (!jugadores.length) return;
    setLoading(true);
    setMapa(null);
    try {
      const jugador = jugadores.find(j => j.nombre?.toLowerCase().includes(master.name.split(' ').pop().toLowerCase()));
      if (!jugador) { setLoading(false); return; }
      // Cargar hasta 100 partidas
      const r = await partidasAPI.getAll({ jugadorId: jugador.id, pageSize: 100 });
      const lista = r.data.partidas || [];
      setNumPartidas(lista.length);
      const { mapa: m, total: t } = calcularCalor(lista, p, c);
      setMapa(m);
      setTotal(t);
    } catch {}
    setLoading(false);
  };

  const handleMaster = (m) => {
    setMasterSel(m);
    calcular(m, pieza, colorSel);
  };

  const handlePieza = (p) => {
    setPieza(p);
    if (masterSel) calcular(masterSel, p, colorSel);
  };

  const handleColor = (c) => {
    setColorSel(c);
    if (masterSel) calcular(masterSel, pieza, c);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 8px' }}>🔥 Mapa de Calor de Casillas</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        Visualiza qué casillas ocupa más cada maestro con sus piezas a lo largo de sus partidas históricas.
      </p>

      {/* Selector de maestro */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {chessMasters.map(m => (
          <button key={m.id} onClick={() => handleMaster(m)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: masterSel?.id === m.id ? 'var(--accent)' : 'var(--bg-card)',
            color: masterSel?.id === m.id ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${masterSel?.id === m.id ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 20, padding: '6px 12px', cursor: 'pointer', fontSize: 13,
            transition: 'all var(--transition)',
          }}>
            <img src={m.photo} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
            {m.name.split(' ').pop()}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['w','b'].map(c => (
            <button key={c} onClick={() => handleColor(c)} style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
              background: colorSel === c ? 'var(--accent)' : 'var(--bg-card)',
              color: colorSel === c ? 'var(--accent-text)' : 'var(--text-primary)',
              border: `1px solid ${colorSel === c ? 'var(--accent)' : 'var(--border)'}`,
            }}>
              {c === 'w' ? '♔ Blancas' : '♚ Negras'}
            </button>
          ))}
        </div>
        <select value={pieza} onChange={e => handlePieza(e.target.value)} style={{
          padding: '6px 12px', borderRadius: 6, background: 'var(--bg-secondary)',
          border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer',
        }}>
          {Object.entries(PIEZAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {masterSel && !loading && mapa && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {numPartidas} partidas · {total.toLocaleString()} posiciones analizadas
          </span>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <p>Analizando partidas de {masterSel?.name}...</p>
        </div>
      )}

      {!masterSel && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 12 }}>
          👆 Selecciona un maestro para ver su mapa de calor
        </div>
      )}

      {mapa && !loading && (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Tablero con mapa de calor */}
          <div>
            <div style={{ display: 'inline-block', border: '2px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              {RANKS.map(rank => (
                <div key={rank} style={{ display: 'flex' }}>
                  <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                    {rank}
                  </div>
                  {FILES.map((file, fi) => {
                    const casilla = file + rank;
                    const valor = mapa[casilla] || 0;
                    const isLight = (fi + parseInt(rank)) % 2 === 1;
                    const baseColor = isLight ? '#f0d9b5' : '#b58863';
                    return (
                      <div key={casilla} title={`${casilla}: ${valor}%`} style={{
                        width: 52, height: 52, position: 'relative',
                        background: baseColor,
                      }}>
                        {valor > 0 && (
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: colorCalor(valor),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {valor >= 60 && (
                              <span style={{ fontSize: 10, fontWeight: 'bold', color: '#1a1a2e', opacity: 0.8 }}>
                                {valor}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div style={{ display: 'flex', paddingLeft: 20 }}>
                {FILES.map(f => (
                  <div key={f} style={{ width: 52, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 0' }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leyenda y top casillas */}
          <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Leyenda */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <h4 style={{ color: 'var(--accent)', margin: '0 0 10px', fontSize: 13 }}>Leyenda</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[10,30,50,70,90,100].map(v => (
                    <div key={v} style={{ width: 20, height: 20, background: colorCalor(v), border: '1px solid var(--border-subtle)', borderRadius: 2 }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Menos → Más frecuente</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                El número indica el % relativo respecto a la casilla más ocupada.
              </p>
            </div>

            {/* Top 10 casillas */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <h4 style={{ color: 'var(--accent)', margin: '0 0 10px', fontSize: 13 }}>
                🔥 Top casillas — {masterSel?.name}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(mapa)
                  .sort(([,a],[,b]) => b - a)
                  .slice(0, 10)
                  .map(([casilla, valor], i) => (
                    <div key={casilla} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 16 }}>#{i+1}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-primary)', width: 24 }}>{casilla}</span>
                      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 3, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${valor}%`, height: '100%', background: colorCalor(valor), borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 30, textAlign: 'right' }}>{valor}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
