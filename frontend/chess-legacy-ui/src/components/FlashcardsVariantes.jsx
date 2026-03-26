import { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useToast } from '../context/ToastContext';

const STORAGE_KEY = 'chess_flashcards_progreso';

function getProgreso() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgreso(key, correcto) {
  const p = getProgreso();
  if (!p[key]) p[key] = { aciertos: 0, fallos: 0, nivel: 0 };
  if (correcto) { p[key].aciertos++; p[key].nivel = Math.min(5, p[key].nivel + 1); }
  else { p[key].fallos++; p[key].nivel = Math.max(0, p[key].nivel - 1); }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  return p[key];
}

// Cuántos movimientos pedir según nivel (0-5)
const MOVS_POR_NIVEL = [3, 4, 5, 6, 8, 10];

export default function FlashcardsVariantes() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const inputRef = useRef(null);

  const [phase, setPhase] = useState('select'); // select | playing | resultado
  const [todasVariantes, setTodasVariantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [variante, setVariante] = useState(null); // {apertura, variante, moves[]}
  const [numMovs, setNumMovs] = useState(5);
  const [posInicial, setPosInicial] = useState('start');
  const [movsPedidos, setMovsPedidos] = useState([]); // los movimientos que hay que adivinar
  const [input, setInput] = useState('');
  const [respuestas, setRespuestas] = useState([]); // {mov, correcto, escrito}
  const [fase, setFase] = useState('escribir'); // escribir | revisar
  const [score, setScore] = useState({ aciertos: 0, fallos: 0 });
  const [progreso, setProgreso] = useState(getProgreso());

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const rAps = await aperturasAPI.getAll();
        const todas = [];
        for (const ap of rAps.data) {
          const rVars = await aperturasAPI.getVariantes(ap);
          for (const va of rVars.data) {
            const rMov = await aperturasAPI.getAprendizaje(ap, va);
            if (rMov.data.movimientos?.length >= 6) {
              todas.push({ apertura: ap, variante: va, moves: rMov.data.movimientos });
            }
          }
        }
        setTodasVariantes(todas);
      } catch {}
      setCargando(false);
    };
    cargar();
  }, []);

  const iniciarTarjeta = (v) => {
    const key = `${v.apertura}__${v.variante}`;
    const p = getProgreso()[key] || { nivel: 0 };
    const n = MOVS_POR_NIVEL[p.nivel] || 5;
    // Posición tras los primeros movimientos (antes de los que hay que adivinar)
    const inicio = Math.max(0, v.moves.length - n);
    const g = new Chess();
    for (let i = 0; i < inicio; i++) { try { g.move(v.moves[i]); } catch { break; } }
    setPosInicial(g.fen());
    setMovsPedidos(v.moves.slice(inicio, inicio + n));
    setVariante(v);
    setNumMovs(n);
    setInput('');
    setRespuestas([]);
    setFase('escribir');
    setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const iniciarAleatoria = () => {
    if (!todasVariantes.length) return;
    // Priorizar las que tienen nivel más bajo
    const p = getProgreso();
    const conNivel = todasVariantes.map(v => ({
      v,
      nivel: p[`${v.apertura}__${v.variante}`]?.nivel ?? 0,
    }));
    conNivel.sort((a, b) => a.nivel - b.nivel);
    // Elegir entre las 10 de menor nivel
    const pool = conNivel.slice(0, Math.min(10, conNivel.length));
    const sel = pool[Math.floor(Math.random() * pool.length)].v;
    iniciarTarjeta(sel);
  };

  const comprobar = () => {
    const escritos = input.trim().split(/\s+/).filter(Boolean);
    const res = movsPedidos.map((mov, i) => ({
      mov,
      escrito: escritos[i] || '',
      correcto: escritos[i]?.toLowerCase() === mov.toLowerCase(),
    }));
    const aciertos = res.filter(r => r.correcto).length;
    const fallos = res.length - aciertos;
    const key = `${variante.apertura}__${variante.variante}`;
    const nuevoProgreso = saveProgreso(key, fallos === 0);
    setRespuestas(res);
    setScore({ aciertos, fallos });
    setProgreso(getProgreso());
    setFase('revisar');
    if (fallos === 0) playSound('correct'); else playSound('error');
  };

  const nivelColor = (n) => ['#888','#ff9800','#ffcc00','#8bc34a','#4caf50','#d4af37'][n] || '#888';
  const nivelLabel = (n) => ['Nuevo','Básico','Aprendiendo','Bueno','Muy bueno','Dominado'][n] || 'Nuevo';

  if (cargando) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>⏳ Cargando variantes...</div>;

  // ── SELECT ──
  if (phase === 'select') return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 8px' }}>🃏 Flashcards de Variantes</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        Se te muestra la posición y tienes que escribir los siguientes movimientos de memoria. Sin tablero interactivo — solo tu cabeza.
      </p>
      <button onClick={iniciarAleatoria} style={{ padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer', fontSize: 15, marginBottom: 20 }}>
        🎲 Tarjeta aleatoria (prioriza las más débiles)
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
        {todasVariantes.map((v, i) => {
          const key = `${v.apertura}__${v.variante}`;
          const p = progreso[key] || { nivel: 0, aciertos: 0, fallos: 0 };
          return (
            <div key={i} onClick={() => iniciarTarjeta(v)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--border-radius)', padding: '10px 14px', cursor: 'pointer',
              transition: 'border-color var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ flex: 1 }}>
                <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>{v.apertura}</span>
                <span style={{ color: 'var(--accent)', fontSize: 13, marginLeft: 8 }}>— {v.variante}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: nivelColor(p.nivel), fontWeight: 'bold' }}>{nivelLabel(p.nivel)}</span>
                <div style={{ width: 60, height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(p.nivel / 5) * 100}%`, height: '100%', background: nivelColor(p.nivel), borderRadius: 3 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── PLAYING ──
  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>🃏 {variante.apertura} — {variante.variante}</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Escribe los siguientes {numMovs} movimientos</span>
        </div>
        <button className="abandon-btn" onClick={() => setPhase('select')}>← Volver</button>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={posInicial}
            arePiecesDraggable={false}
            boardWidth={480}
            {...boardProps}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', margin: '8px 0 0' }}>
            Posición antes de los movimientos a adivinar
          </p>
        </div>

        <div className="training-sidebar">
          {fase === 'escribir' ? (
            <>
              <div className="feedback-box">
                ✍️ Escribe los {numMovs} movimientos en notación SAN separados por espacios
                <br />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Ejemplo: e4 e5 Nf3 Nc6 Bb5
                </span>
              </div>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); comprobar(); } }}
                placeholder={`Escribe ${numMovs} movimientos...`}
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius)',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 15, fontFamily: 'monospace',
                  resize: 'none', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button className="start-btn" onClick={comprobar} disabled={!input.trim()}>
                ✅ Comprobar
              </button>
            </>
          ) : (
            <>
              <div className={`feedback-box ${score.fallos === 0 ? 'ok' : 'error'}`}>
                {score.fallos === 0 ? `✅ ¡Perfecto! ${score.aciertos}/${movsPedidos.length} correctos` : `❌ ${score.aciertos}/${movsPedidos.length} correctos`}
              </div>

              {/* Comparación movimiento a movimiento */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {respuestas.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: r.correcto ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                    border: `1px solid ${r.correcto ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
                    borderRadius: 6, padding: '6px 10px',
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}>{i + 1}.</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: r.correcto ? 'var(--success)' : 'var(--error)', minWidth: 50 }}>
                      {r.escrito || '—'}
                    </span>
                    {!r.correcto && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        → correcto: <strong style={{ color: 'var(--accent)' }}>{r.mov}</strong>
                      </span>
                    )}
                    <span style={{ marginLeft: 'auto' }}>{r.correcto ? '✅' : '❌'}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="start-btn" style={{ flex: 1 }} onClick={iniciarAleatoria}>🎲 Siguiente</button>
                <button className="abandon-btn" style={{ flex: 1 }} onClick={() => iniciarTarjeta(variante)}>🔄 Repetir</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
