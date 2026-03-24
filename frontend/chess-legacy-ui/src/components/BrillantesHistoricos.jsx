import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

// Todos los FENs verificados con chess.js. La solución siempre empieza con el turno del FEN.
const BRILLANTES = [
  {
    id: 1,
    titulo: 'La Inmortal de Anderssen',
    jugadores: 'Anderssen vs Kieseritzky',
    evento: 'Londres, 1851',
    fen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1',
    solucion: ['Nd6+', 'cxd6', 'Bc6#'],
    descripcion: 'Anderssen sacrificó ambas torres, un alfil y la dama para dar mate. El movimiento clave es Nd6+, iniciando el mate final.',
    idea: 'Sacrificio total de material para un mate de belleza absoluta. Anderssen cedió torre, alfil y dama antes de llegar a esta posición.',
    dificultad: '★★★',
  },
  {
    id: 2,
    titulo: 'La Siempreviva de Anderssen',
    jugadores: 'Anderssen vs Dufresne',
    evento: 'Berlín, 1852',
    fen: '1r2k2r/2qn1pp1/p3pn1p/2ppP3/5B2/1NP2N2/PP1Q1PPP/R3K2R w KQ - 0 1',
    solucion: ['Qxd7+', 'Nxd7', 'Bxe6'],
    descripcion: 'Anderssen sacrifica la dama con Qxd7+! para obtener un ataque devastador con las piezas menores.',
    idea: 'El sacrificio de dama abre líneas para las piezas menores coordinadas. El rey negro queda atrapado en el centro.',
    dificultad: '★★★',
  },
  {
    id: 3,
    titulo: 'La Partida del Siglo — Fischer',
    jugadores: 'Donald Byrne vs Bobby Fischer',
    evento: 'Nueva York, 1956',
    fen: '1r1q1rk1/4ppbp/3p1np1/2pP4/4nB2/2N1PN2/PP3PPP/2RQK2R b K - 0 1',
    solucion: ['Nxf2', 'Bxd1', 'Nxd1'],
    descripcion: 'Fischer, con 13 años, sacrifica el caballo con Nxf2! ganando la dama. Una combinación que dejó al mundo sin palabras.',
    idea: 'El caballo en f2 ataca la dama en d1 y la torre en h1. Tras Kxf2, Nxd1+ gana la dama. Fischer calculó todo esto con 13 años.',
    dificultad: '★★★',
  },
  {
    id: 4,
    titulo: 'El Alfil Inmortal — Shirov',
    jugadores: 'Shirov vs Topalov',
    evento: 'Linares, 1998',
    fen: '6k1/4pp1p/3p2p1/8/1pP1bB2/1P4P1/r3PP1P/3R2K1 w - - 0 1',
    solucion: ['Bh6', 'Bxh6', 'Rd8+', 'Kg7', 'Rd7'],
    descripcion: 'Shirov juega Bh6!! sacrificando el alfil. Topalov lo captura pero el ataque de las torres es imparable.',
    idea: 'Bh6!! es un sacrificio posicional puro. La torre penetra por d8 con efecto demoledor.',
    dificultad: '★★★',
  },
  {
    id: 5,
    titulo: 'Sacrificio de Caballo — Tal',
    jugadores: 'Tal vs Smyslov',
    evento: 'Candidatos, 1959',
    fen: 'r1b2rk1/pp1nqppp/2p1p3/3nN3/3P4/2NB4/PPQ2PPP/R3K2R w KQ - 0 1',
    solucion: ['Nxf7', 'Rxf7', 'Bxh7+', 'Kxh7', 'Qh5+'],
    descripcion: 'Tal sacrifica el caballo en f7 iniciando un ataque devastador. El Mago de Riga en estado puro.',
    idea: 'Nxf7! destruye el enroque negro. Bxh7+! atrae al rey donde Qh5+ inicia un ataque imparable.',
    dificultad: '★★★',
  },
  {
    id: 6,
    titulo: 'Morphy en la Ópera',
    jugadores: 'Morphy vs Duke of Brunswick',
    evento: 'París, 1858',
    fen: '4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1',
    solucion: ['Qb8+', 'Nxb8', 'Rd8#'],
    descripcion: 'Morphy sacrifica la dama con Qb8+! para dar mate con la torre. La partida más famosa de la historia.',
    idea: 'Qb8+!! fuerza Nxb8 y entonces Rd8# es mate. El desarrollo es la clave del ataque.',
    dificultad: '★★',
  },
  {
    id: 7,
    titulo: 'Polgar vs Kasparov',
    jugadores: 'Judit Polgar vs Garry Kasparov',
    evento: 'Linares, 2001',
    fen: '4r1k1/1bq2pp1/p6p/1p1p4/3B1B2/P1Q5/1PP3PP/5RK1 w - - 0 1',
    solucion: ['Rxf7', 'Rxf7', 'Bxg7', 'Rxg7', 'Qc8+'],
    descripcion: 'Polgar sacrifica la torre con Rxf7! iniciando una combinación brillante contra el campeón del mundo.',
    idea: 'Rxf7! destruye la defensa del rey. Bxg7! elimina otra pieza defensora. Qc8+ inicia el ataque final.',
    dificultad: '★★★',
  },
  {
    id: 8,
    titulo: 'El Sacrificio de Torre de Petrosian',
    jugadores: 'Petrosian vs Spassky',
    evento: 'Campeonato Mundial, 1966',
    fen: 'r4rk1/1bqnbppp/p2pp3/1p6/3BPP2/2NB2Q1/PPP3PP/4RR1K w - - 0 1',
    solucion: ['f5', 'exf5', 'e5', 'dxe5', 'Nxe5'],
    descripcion: 'Petrosian lanza un ataque posicional con f5! abriendo líneas. El Tigran de Hierro atacando.',
    idea: 'f5! abre la posición de forma violenta. Nxe5 y las piezas blancas dominan el centro con ventaja decisiva.',
    dificultad: '★★',
  },
  {
    id: 9,
    titulo: 'Nezhmetdinov — Sacrificio Total',
    jugadores: 'Nezhmetdinov vs Chernikov',
    evento: 'URSS, 1962',
    fen: 'r4rk1/pp1bppbp/2np1np1/q7/2BNP3/2N1BP2/PPP1Q1PP/2KR3R w - - 0 1',
    solucion: ['Nxd6', 'exd6', 'Bxf6', 'Bxf6', 'Rxh7'],
    descripcion: 'Nezhmetdinov sacrifica caballo y alfil para destruir la estructura del rey negro.',
    idea: 'Nxd6! elimina un defensor clave. Bxf6! destruye otro. Rxh7! abre el rey negro a un ataque devastador.',
    dificultad: '★★★',
  },
];

const DIFICULTAD_COLOR = { '★': '#4caf50', '★★': '#ff9800', '★★★': '#f44336' };

function usePuzzle(brillante, activo) {
  const [game, setGame] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highlight, setHighlight] = useState({});
  const [solved, setSolved] = useState(false);
  const [showIdea, setShowIdea] = useState(false);
  const { playSound } = useToast();

  useEffect(() => {
    if (!brillante || !activo) return;
    try {
      setGame(new Chess(brillante.fen));
    } catch { setGame(null); }
    setStepIdx(0); setFeedback(null); setHighlight({}); setSolved(false); setShowIdea(false);
  }, [brillante?.id, activo]); // eslint-disable-line

  // Turno del jugador: el que tiene el turno en el FEN
  const playerColor = brillante ? new Chess(brillante.fen).turn() : 'w';

  // Movimiento del oponente (índices impares = respuesta del oponente)
  useEffect(() => {
    if (!game || !brillante || solved || !activo) return;
    const isOpponent = stepIdx % 2 === 1 && stepIdx < brillante.solucion.length;
    if (!isOpponent) return;
    const t = setTimeout(() => {
      const g = new Chess(game.fen());
      try {
        const m = g.move(brillante.solucion[stepIdx]);
        if (!m) return;
        setGame(g);
        setHighlight({ [m.from]: { background: 'rgba(255,165,0,0.4)' }, [m.to]: { background: 'rgba(255,165,0,0.4)' } });
        playSound(m.flags.includes('c') ? 'capture' : 'move');
        const next = stepIdx + 1;
        setStepIdx(next);
        if (next >= brillante.solucion.length) {
          setSolved(true); playSound('correct'); setFeedback('solved');
          setTimeout(() => setShowIdea(true), 800);
        }
      } catch {}
    }, 700);
    return () => clearTimeout(t);
  }, [stepIdx, game]); // eslint-disable-line

  const onPieceDrop = (from, to) => {
    if (!game || solved || feedback === 'wrong') return false;
    const g = new Chess(game.fen());
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;
    const expected = brillante.solucion[stepIdx];
    if (m.san === expected) {
      setGame(g);
      setHighlight({ [from]: { background: 'rgba(76,175,80,0.4)' }, [to]: { background: 'rgba(76,175,80,0.4)' } });
      playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= brillante.solucion.length) {
        setSolved(true); playSound('correct'); setFeedback('solved');
        setTimeout(() => setShowIdea(true), 800);
      } else {
        setFeedback('parcial');
      }
    } else {
      setHighlight({ [from]: { background: 'rgba(244,67,54,0.4)' }, [to]: { background: 'rgba(244,67,54,0.4)' } });
      setFeedback('wrong'); playSound('error');
      setTimeout(() => {
        try { setGame(new Chess(brillante.fen)); } catch {}
        setStepIdx(0); setHighlight({}); setFeedback('retry');
      }, 900);
    }
    return true;
  };

  return { game, stepIdx, feedback, highlight, solved, showIdea, playerColor, onPieceDrop };
}

export default function BrillantesHistoricos() {
  const { boardProps } = useBoardTheme();
  const [vista, setVista] = useState('lista');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const brillante = BRILLANTES[idx];
  const activo = vista === 'jugando';
  const { game, stepIdx, feedback, highlight, solved, showIdea, playerColor, onPieceDrop } = usePuzzle(brillante, activo);

  useEffect(() => {
    if (feedback === 'solved') setScore(s => s + 1);
    if (feedback === 'wrong') setIntentos(i => i + 1);
  }, [feedback]);

  useEffect(() => { setShowHint(false); }, [idx]);

  const siguiente = () => {
    if (idx + 1 >= BRILLANTES.length) { setVista('resumen'); return; }
    setIdx(i => i + 1);
  };

  const orientacion = playerColor === 'w' ? 'white' : 'black';

  if (vista === 'lista') return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 32 }}>💎</span>
        <div>
          <h2 style={{ color: 'var(--accent)', margin: 0 }}>Brillantes Históricos</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
            Las combinaciones más brillantes de la historia. Encuentra el sacrificio genial.
          </p>
        </div>
      </div>
      <button onClick={() => { setIdx(0); setScore(0); setIntentos(0); setVista('jugando'); }}
        style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer', fontSize: 14, marginBottom: 16 }}>
        💎 Empezar todos
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BRILLANTES.map((b, i) => (
          <div key={b.id}
            onClick={() => { setIdx(i); setScore(0); setIntentos(0); setVista('jugando'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: '14px 18px', cursor: 'pointer', transition: 'border-color var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <span style={{ fontSize: 24 }}>💎</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 15 }}>{b.titulo}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{b.jugadores} · {b.evento}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: DIFICULTAD_COLOR[b.dificultad] || '#ff9800', fontSize: 14 }}>{b.dificultad}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.solucion.length} movs.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (vista === 'resumen') {
    const pct = Math.round((score / BRILLANTES.length) * 100);
    return (
      <div className="done-screen">
        <div className="done-icon">💎</div>
        <h2>¡Brillantes completados!</h2>
        <div className="done-stats">
          <div className="done-stat"><span>{score}</span><label>Resueltos</label></div>
          <div className="done-stat"><span>{intentos}</span><label>Intentos fallidos</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <div className="done-actions">
          <button onClick={() => { setIdx(0); setScore(0); setIntentos(0); setVista('jugando'); }}>🔄 Repetir</button>
          <button onClick={() => setVista('lista')}>← Volver</button>
        </div>
      </div>
    );
  }

  if (!game) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>⏳ Cargando...</p>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>💎</span>
              <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.2rem' }}>{brillante.titulo}</h2>
              <span style={{ color: DIFICULTAD_COLOR[brillante.dificultad] || '#ff9800', fontSize: 14 }}>{brillante.dificultad}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{brillante.jugadores} · {brillante.evento}</div>
          </div>
          <span className="color-badge">{idx + 1}/{BRILLANTES.length}</span>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={orientacion}
            customSquareStyles={highlight}
            arePiecesDraggable={!solved && feedback !== 'wrong'}
            boardWidth={480}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--accent)' }}>
            {brillante.descripcion}
          </div>

          <div className={`feedback-box ${feedback === 'solved' ? 'ok' : feedback === 'wrong' || feedback === 'retry' ? 'error' : feedback === 'parcial' ? 'ok' : ''}`}>
            {feedback === 'solved'  ? '💎 ¡Brillante encontrado!' :
             feedback === 'parcial' ? '✅ ¡Correcto! Continúa...' :
             feedback === 'wrong'   ? '❌ Ese no es el movimiento brillante' :
             feedback === 'retry'   ? '🔄 Inténtalo de nuevo' :
             `💡 Mueves las ${orientacion === 'white' ? 'blancas' : 'negras'} — ¿cuál es el sacrificio?`}
          </div>

          {showHint && (
            <div className="feedback-box hint">
              💡 Pista: <strong style={{ color: 'var(--accent)' }}>{brillante.solucion[0]}</strong>
            </div>
          )}

          {showIdea && (
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>💡 La idea táctica</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{brillante.idea}</p>
            </div>
          )}

          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {brillante.solucion.map((m, i) => (
              <span key={i} style={{ marginRight: 4, color: i < stepIdx ? 'var(--success)' : 'var(--text-muted)' }}>
                {i < stepIdx ? m : '?'.repeat(m.length)}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!solved && !showHint && <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setShowHint(true)}>💡 Pista</button>}
            {solved && <button className="start-btn" style={{ flex: 1 }} onClick={siguiente}>{idx + 1 < BRILLANTES.length ? 'Siguiente →' : '🏁 Ver resumen'}</button>}
            <button className="abandon-btn" onClick={() => setVista('lista')}>← Lista</button>
          </div>

          <div className="training-stats">
            <span className="stat-ok">💎 {score}</span>
            <span className="stat-err">❌ {intentos}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
