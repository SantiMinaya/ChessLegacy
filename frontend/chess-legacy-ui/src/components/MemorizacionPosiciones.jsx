import { useState, useEffect, useRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const POSICIONES = [
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', desc: 'Italiana — movimiento 4', dificultad: 1 },
  { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', desc: 'Italiana — tensión central', dificultad: 1 },
  { fen: 'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5', desc: 'Gambito de Dama — posición típica', dificultad: 2 },
  { fen: 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6', desc: 'Italiana — posición compleja', dificultad: 2 },
  { fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 2 7', desc: 'Italiana — ambos enrocados', dificultad: 2 },
  { fen: 'r2qkb1r/ppp2ppp/2np1n2/4p3/2BPP1b1/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 7', desc: 'Apertura con clavada', dificultad: 3 },
  { fen: 'r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPP2PPP/R2QKB1R w KQ - 0 8', desc: 'Dragón — posición típica', dificultad: 3 },
  { fen: '2rq1rk1/pp1bppbp/3p1np1/8/3NP3/2N1BP2/PPP2PPP/2RQK2R w K - 0 10', desc: 'Posición de medio juego', dificultad: 3 },
];

const TIEMPO_MEMORIZAR = { 1: 10, 2: 8, 3: 6 };
const FEN_INICIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const FEN_VACIO = '8/8/8/8/8/8/8/8 w - - 0 1';

const PIEZAS_PALETA = [
  { tipo: 'p', color: 'w', label: '♙' }, { tipo: 'n', color: 'w', label: '♘' },
  { tipo: 'b', color: 'w', label: '♗' }, { tipo: 'r', color: 'w', label: '♖' },
  { tipo: 'q', color: 'w', label: '♕' }, { tipo: 'k', color: 'w', label: '♔' },
  { tipo: 'p', color: 'b', label: '♟' }, { tipo: 'n', color: 'b', label: '♞' },
  { tipo: 'b', color: 'b', label: '♝' }, { tipo: 'r', color: 'b', label: '♜' },
  { tipo: 'q', color: 'b', label: '♛' }, { tipo: 'k', color: 'b', label: '♚' },
];

function contarDiferencias(fenObjetivo, fenActual) {
  try {
    const g1 = new Chess(fenObjetivo);
    const g2 = new Chess(fenActual);
    const board1 = g1.board();
    const board2 = g2.board();
    let correctas = 0;
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const s1 = board1[r][f];
        const s2 = board2[r][f];
        if (!s1 && !s2) correctas++;
        else if (s1 && s2 && s1.type === s2.type && s1.color === s2.color) correctas++;
      }
    }
    return { correctas, pct: Math.round((correctas / 64) * 100) };
  } catch { return { correctas: 0, pct: 0 }; }
}

// Convierte un FEN a objeto {casilla: {tipo, color}}
function fenAPiezas(fen) {
  try {
    const g = new Chess(fen);
    const board = g.board();
    const piezas = {};
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sq = board[r][f];
        if (sq) {
          const casilla = 'abcdefgh'[f] + (8 - r);
          piezas[casilla] = { tipo: sq.type, color: sq.color };
        }
      }
    }
    return piezas;
  } catch { return {}; }
}

// Construye un FEN a partir de un objeto {casilla: {tipo, color}}
function piezasAFen(piezas) {
  const rows = [];
  for (let r = 8; r >= 1; r--) {
    let row = '';
    let empty = 0;
    for (const f of 'abcdefgh') {
      const sq = piezas[f + r];
      if (sq) {
        if (empty > 0) { row += empty; empty = 0; }
        const c = sq.color === 'w' ? sq.tipo.toUpperCase() : sq.tipo.toLowerCase();
        row += c;
      } else {
        empty++;
      }
    }
    if (empty > 0) row += empty;
    rows.push(row);
  }
  return rows.join('/') + ' w - - 0 1';
}

const TOTAL_RONDAS = 5;

export default function MemorizacionPosiciones() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('menu');
  const [dificultad, setDificultad] = useState(1);
  const [orientacion, setOrientacion] = useState('white');
  const [setupInicial, setSetupInicial] = useState(true); // empezar con posición inicial o vacío
  const [ronda, setRonda] = useState(0);
  const [score, setScore] = useState(0);
  const [posActual, setPosActual] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  // Estado del tablero de reconstrucción como objeto {casilla: {tipo, color}}
  const [piezas, setPiezas] = useState({});
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null);
  const [resultado, setResultado] = useState(null);
  const timerRef = useRef(null);

  const posicionesFiltradas = POSICIONES.filter(p => p.dificultad <= dificultad);

  const fenReconstruido = piezasAFen(piezas);

  const nuevaRonda = useCallback((r) => {
    const pool = posicionesFiltradas;
    const pos = pool[r % pool.length];
    setPosActual(pos);
    // Setup inicial: posición inicial del ajedrez o vacío
    setPiezas(setupInicial ? fenAPiezas(FEN_INICIAL) : {});
    setPiezaSeleccionada(null);
    setResultado(null);
    const tiempo = TIEMPO_MEMORIZAR[dificultad] || 8;
    setTiempoRestante(tiempo);
    setPhase('memorizar');
  }, [dificultad, posicionesFiltradas, setupInicial]);

  useEffect(() => {
    if (phase !== 'memorizar') return;
    timerRef.current = setInterval(() => {
      setTiempoRestante(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('reconstruir'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const iniciar = () => { setRonda(0); setScore(0); nuevaRonda(0); };

  // Drag & drop: mover pieza de una casilla a otra
  const onPieceDrop = useCallback((from, to) => {
    if (phase !== 'reconstruir') return false;
    setPiezas(prev => {
      const next = { ...prev };
      const pieza = next[from];
      if (!pieza) return prev;
      delete next[from];
      next[to] = pieza;
      return next;
    });
    return true;
  }, [phase]);

  // Clic en casilla: colocar pieza seleccionada o quitar la existente
  const onSquareClick = useCallback((casilla) => {
    if (phase !== 'reconstruir') return;
    if (piezaSeleccionada) {
      // Colocar pieza y MANTENER la selección para poder seguir colocando
      setPiezas(prev => ({ ...prev, [casilla]: { tipo: piezaSeleccionada.tipo, color: piezaSeleccionada.color } }));
      // NO deseleccionar — el usuario puede seguir haciendo clic en más casillas
    } else {
      // Sin pieza seleccionada: quitar la pieza de esa casilla
      setPiezas(prev => {
        const next = { ...prev };
        delete next[casilla];
        return next;
      });
    }
  }, [phase, piezaSeleccionada]);

  const comprobar = () => {
    const { correctas, pct } = contarDiferencias(posActual.fen, fenReconstruido);
    const puntos = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
    setScore(s => s + puntos);
    setResultado({ correctas, pct, puntos });
    setPhase('resultado');
    if (pct >= 90) playSound('correct');
    else if (pct >= 50) playSound('move');
    else playSound('error');
  };

  const siguiente = () => {
    const next = ronda + 1;
    if (next >= TOTAL_RONDAS) { setPhase('done'); return; }
    setRonda(next);
    nuevaRonda(next);
  };

  const verDeNuevo = () => {
    clearInterval(timerRef.current);
    setTiempoRestante(5);
    setPhase('memorizar');
  };

  // ── MENÚ ──
  if (phase === 'menu') return (
    <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🧠</div>
      <h2 style={{ color: 'var(--accent)', margin: 0 }}>Memorización de Posiciones</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        Memoriza la posición en unos segundos y luego reconstruyela. Arrastra las piezas o selecciona una de la paleta y haz clic en la casilla.
      </p>

      {/* Dificultad */}
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Dificultad</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[[1,'🟢 Fácil','10s'],[2,'🟡 Normal','8s'],[3,'🔴 Difícil','6s']].map(([d,l,t]) => (
            <button key={d} onClick={() => setDificultad(d)} style={{
              padding: '10px 16px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
              background: dificultad === d ? 'var(--accent)' : 'var(--bg-card)',
              color: dificultad === d ? 'var(--accent-text)' : 'var(--text-primary)',
              border: `1px solid ${dificultad === d ? 'var(--accent)' : 'var(--border)'}`,
              display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
            }}>
              <span style={{ fontWeight: 'bold' }}>{l}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Perspectiva</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {['white','black'].map(c => (
            <button key={c} onClick={() => setOrientacion(c)} style={{
              padding: '8px 20px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
              background: orientacion === c ? 'var(--accent)' : 'var(--bg-card)',
              color: orientacion === c ? 'var(--accent-text)' : 'var(--text-primary)',
              border: `1px solid ${orientacion === c ? 'var(--accent)' : 'var(--border)'}`,
            }}>
              {c === 'white' ? '♔ Blancas' : '♚ Negras'}
            </button>
          ))}
        </div>
      </div>

      {/* Setup inicial */}
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Punto de partida para reconstruir</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={() => setSetupInicial(true)} style={{
            padding: '8px 16px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: setupInicial ? 'var(--accent)' : 'var(--bg-card)',
            color: setupInicial ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${setupInicial ? 'var(--accent)' : 'var(--border)'}`,
            display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
          }}>
            <span style={{ fontWeight: 'bold' }}>♟️ Posición inicial</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>Mueve las piezas desde el inicio</span>
          </button>
          <button onClick={() => setSetupInicial(false)} style={{
            padding: '8px 16px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: !setupInicial ? 'var(--accent)' : 'var(--bg-card)',
            color: !setupInicial ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${!setupInicial ? 'var(--accent)' : 'var(--border)'}`,
            display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
          }}>
            <span style={{ fontWeight: 'bold' }}>⬜ Tablero vacío</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>Coloca las piezas desde cero</span>
          </button>
        </div>
      </div>

      <button onClick={iniciar} style={{ padding: '14px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        🧠 Empezar
      </button>
    </div>
  );

  // ── DONE ──
  if (phase === 'done') {
    const maxScore = TOTAL_RONDAS * 3;
    const pct = Math.round((score / maxScore) * 100);
    return (
      <div className="done-screen">
        <div className="done-icon">🧠</div>
        <h2>¡Completado!</h2>
        <div className="done-stats">
          <div className="done-stat"><span>{score}</span><label>Puntos</label></div>
          <div className="done-stat"><span>{maxScore}</span><label>Máximo</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 16px' }}>
          {pct >= 80 ? '¡Memoria visual excelente!' : pct >= 50 ? 'Buen trabajo. Sigue practicando.' : 'La memoria mejora con la práctica. ¡Inténtalo de nuevo!'}
        </p>
        <div className="done-actions">
          <button onClick={iniciar}>🔄 Repetir</button>
          <button onClick={() => setPhase('menu')}>← Volver</button>
        </div>
      </div>
    );
  }

  // ── JUGANDO ──
  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>
            🧠 {phase === 'memorizar' ? '¡Memoriza!' : phase === 'reconstruir' ? 'Reconstruye la posición' : 'Resultado'}
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{posActual?.desc}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {phase === 'memorizar' && (
            <span style={{ fontSize: 24, fontWeight: 'bold', color: tiempoRestante <= 3 ? 'var(--error)' : 'var(--accent)', fontFamily: 'monospace' }}>
              ⏱ {tiempoRestante}s
            </span>
          )}
          <span className="color-badge">{ronda + 1}/{TOTAL_RONDAS}</span>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          {phase === 'memorizar' ? (
            <>
              <Chessboard
                position={posActual?.fen}
                arePiecesDraggable={false}
                boardOrientation={orientacion}
                boardWidth={480}
                {...boardProps}
              />
              <div style={{ marginTop: 8, background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                👁️ Memoriza — desaparecerá en {tiempoRestante}s
              </div>
            </>
          ) : phase === 'reconstruir' ? (
            <>
              <Chessboard
                position={fenReconstruido}
                onPieceDrop={onPieceDrop}
                onSquareClick={onSquareClick}
                boardOrientation={orientacion}
                boardWidth={480}
                arePiecesDraggable={true}
                customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px rgba(212,175,55,0.6)' }}
                {...boardProps}
              />
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                Arrastra piezas para moverlas · Selecciona paleta y haz clic en varias casillas · Clic sin selección = quitar pieza
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', margin: '0 0 4px' }}>Original</p>
                <Chessboard position={posActual?.fen} arePiecesDraggable={false} boardOrientation={orientacion} boardWidth={230} {...boardProps} />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', margin: '0 0 4px' }}>Tu reconstrucción</p>
                <Chessboard position={fenReconstruido} arePiecesDraggable={false} boardOrientation={orientacion} boardWidth={230} {...boardProps} />
              </div>
            </div>
          )}
        </div>

        <div className="training-sidebar">
          {phase === 'reconstruir' && (
            <>
              <div className="feedback-box">
                🎯 Reconstruye la posición que acabas de ver
              </div>

              {/* Paleta de piezas */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px' }}>
                  {piezaSeleccionada
                    ? `📌 ${PIEZAS_PALETA.find(p => p.tipo === piezaSeleccionada.tipo && p.color === piezaSeleccionada.color)?.label} seleccionada — haz clic en las casillas. Clic en la pieza para deseleccionar.`
                    : 'Selecciona una pieza y haz clic en las casillas donde quieras colocarla:'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                  {PIEZAS_PALETA.map((p, i) => {
                    const activa = piezaSeleccionada?.tipo === p.tipo && piezaSeleccionada?.color === p.color;
                    return (
                      <button key={i} onClick={() => setPiezaSeleccionada(activa ? null : p)} style={{
                        fontSize: 22, padding: '4px', borderRadius: 6, cursor: 'pointer',
                        background: activa ? 'var(--accent)' : 'var(--bg-card)',
                        border: `2px solid ${activa ? 'var(--accent)' : 'var(--border-subtle)'}`,
                        transition: 'all var(--transition)',
                      }}>
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="start-btn" style={{ flex: 1 }} onClick={comprobar}>✅ Comprobar</button>
                <button className="abandon-btn" onClick={verDeNuevo}>👁️ Ver (5s)</button>
              </div>

              <button className="abandon-btn" style={{ width: '100%' }} onClick={() => {
                setPiezas(setupInicial ? fenAPiezas(FEN_INICIAL) : {});
                setPiezaSeleccionada(null);
              }}>
                🔄 Resetear tablero
              </button>
            </>
          )}

          {phase === 'resultado' && resultado && (
            <>
              <div className={`feedback-box ${resultado.pct >= 80 ? 'ok' : resultado.pct >= 50 ? 'hint' : 'error'}`}>
                {resultado.pct >= 90 ? '🌟 ¡Excelente memoria!' :
                 resultado.pct >= 70 ? '✅ Muy bien' :
                 resultado.pct >= 50 ? '💡 Aceptable' : '❌ Sigue practicando'}
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: 'var(--accent)' }}>{resultado.pct}%</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{resultado.correctas}/64 casillas correctas</div>
                <div style={{ fontSize: 13, color: 'var(--accent)', marginTop: 4 }}>+{resultado.puntos} puntos</div>
              </div>
              <button className="start-btn" onClick={siguiente}>
                {ronda + 1 >= TOTAL_RONDAS ? '🏁 Ver resultado final' : 'Siguiente →'}
              </button>
            </>
          )}

          <div className="training-stats">
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>⭐ {score} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
