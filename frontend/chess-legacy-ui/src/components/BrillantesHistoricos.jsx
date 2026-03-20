import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const BRILLANTES = [
  {
    id: 1,
    titulo: 'La Inmortal de Anderssen',
    jugadores: 'Anderssen vs Kieseritzky',
    evento: 'Londres, 1851',
    orientacion: 'white',
    fen: 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1',
    solucion: ['Nd6+', 'cxd6', 'Bc6#'],
    descripcion: 'Anderssen sacrificó ambas torres, un alfil y la dama para dar mate. El movimiento clave es Nd6+, iniciando el mate final tras haber sacrificado todo.',
    idea: 'Sacrificio total de material para un mate de belleza absoluta. Anderssen cedió torre, alfil y dama antes de llegar a esta posición.',
    dificultad: '★★★',
    color: '#d4af37',
  },
  {
    id: 2,
    titulo: 'La Siempreviva de Anderssen',
    jugadores: 'Anderssen vs Dufresne',
    evento: 'Berlín, 1852',
    orientacion: 'white',
    fen: '1r2k2r/2qn1pp1/p3pn1p/2ppP3/5B2/1NP2N2/PP1Q1PPP/R3K2R w KQ - 0 1',
    solucion: ['Qxd7+', 'Nxd7', 'Bxe6'],
    descripcion: 'Anderssen sacrifica la dama con Qxd7+! para obtener un ataque devastador con las piezas menores.',
    idea: 'El sacrificio de dama abre líneas para las piezas menores coordinadas. La idea es que el rey negro queda atrapado en el centro.',
    dificultad: '★★★',
    color: '#d4af37',
  },
  {
    id: 3,
    titulo: 'La Partida del Siglo — Fischer',
    jugadores: 'Donald Byrne vs Bobby Fischer',
    evento: 'Nueva York, 1956',
    orientacion: 'black',
    fen: '1r1q1rk1/4ppbp/3p1np1/2pP4/4nB2/2N1PN2/PP3PPP/2RQK2R b K - 0 1',
    solucion: ['Nxf2', 'Bxd1', 'Nxd1'],
    descripcion: 'Fischer, con 13 años, sacrifica el caballo con Nxf2! ganando la dama. Una combinación que dejó al mundo sin palabras.',
    idea: 'El caballo en f2 ataca simultáneamente la dama en d1 y la torre en h1. Tras Kxf2, Nxd1+ gana la dama. Fischer calculó todo esto con 13 años.',
    dificultad: '★★★',
    color: '#2196f3',
  },
  {
    id: 4,
    titulo: 'El Alfil Inmortal — Shirov',
    jugadores: 'Shirov vs Topalov',
    evento: 'Linares, 1998',
    orientacion: 'white',
    fen: '6k1/4pp1p/3p2p1/8/1pP1bB2/1P4P1/r3PP1P/3R2K1 w - - 0 1',
    solucion: ['Bh6', 'Bxh6', 'Rd8+', 'Kg7', 'Rd7'],
    descripcion: 'Shirov juega Bh6!! sacrificando el alfil. Topalov lo captura pero el ataque de las torres es imparable. Considerada una de las jugadas más bellas del siglo XX.',
    idea: 'Bh6!! es un sacrificio posicional puro. El alfil en h6 no puede ser capturado sin consecuencias devastadoras. La torre penetra por d8 con efecto demoledor.',
    dificultad: '★★★',
    color: '#d4af37',
  },
  {
    id: 5,
    titulo: 'La Inmortal de Kasparov',
    jugadores: 'Kasparov vs Topalov',
    evento: 'Wijk aan Zee, 1999',
    orientacion: 'white',
    fen: '6k1/4pp1p/3p2p1/8/1pP5/1P2r1P1/4PP1P/3R2K1 w - - 0 1',
    solucion: ['Rd8+', 'Kf7', 'Rd7+', 'Ke6', 'Rxe7+'],
    descripcion: 'Kasparov sacrificó ambas torres en movimientos anteriores. Aquí ejecuta el remate con Rd8+, una combinación que Kasparov calculó con 15 movimientos de profundidad.',
    idea: 'La posición es el resultado de Rxd4!! y Rxd5!! previos. Las torres de Kasparov dominan absolutamente. El rey negro no tiene escapatoria.',
    dificultad: '★★★',
    color: '#d4af37',
  },
  {
    id: 6,
    titulo: 'Sacrificio de Caballo — Tal',
    jugadores: 'Tal vs Smyslov',
    evento: 'Candidatos, 1959',
    orientacion: 'white',
    fen: 'r1b2rk1/pp1nqppp/2p1p3/3nN3/3P4/2NB4/PPQ2PPP/R3K2R w KQ - 0 1',
    solucion: ['Nxf7', 'Rxf7', 'Bxh7+', 'Kxh7', 'Qh5+'],
    descripcion: 'Tal sacrifica el caballo en f7 iniciando un ataque devastador. Smyslov no pudo encontrar la defensa correcta ante la tormenta táctica del Mago de Riga.',
    idea: 'Nxf7! destruye el enroque negro. Tras Rxf7, Bxh7+! atrae al rey a h7 donde Qh5+ inicia un ataque imparable. Tal calculó variantes imposibles de refutar.',
    dificultad: '★★★',
    color: '#d4af37',
  },
  {
    id: 7,
    titulo: 'Morphy en la Ópera',
    jugadores: 'Morphy vs Duke of Brunswick',
    evento: 'París, 1858',
    orientacion: 'white',
    fen: '4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1',
    solucion: ['Qb8+', 'Nxb8', 'Rd8#'],
    descripcion: 'Morphy sacrifica la dama con Qb8+! para dar mate con la torre. La partida más famosa de la historia, jugada durante una ópera en París.',
    idea: 'Qb8+!! fuerza Nxb8 y entonces Rd8# es mate. Morphy desarrolló todas sus piezas antes de atacar, demostrando que el desarrollo es la clave del ataque.',
    dificultad: '★★',
    color: '#d4af37',
  },
  {
    id: 8,
    titulo: 'Polgar vs Kasparov',
    jugadores: 'Judit Polgar vs Garry Kasparov',
    evento: 'Linares, 2001',
    orientacion: 'white',
    fen: '4r1k1/1bq2pp1/p6p/1p1p4/3B1B2/P1Q5/1PP3PP/5RK1 w - - 0 1',
    solucion: ['Rxf7', 'Rxf7', 'Bxg7', 'Rxg7', 'Qc8+'],
    descripcion: 'Polgar sacrifica la torre con Rxf7! iniciando una combinación brillante contra el campeón del mundo. Una de las victorias más impresionantes de Judit.',
    idea: 'Rxf7! destruye la defensa del rey. Tras Rxf7, Bxg7! elimina otra pieza defensora. Qc8+ inicia el ataque final que Kasparov no pudo detener.',
    dificultad: '★★★',
    color: '#d4af37',
  },
  {
    id: 9,
    titulo: 'El Sacrificio de Torre de Petrosian',
    jugadores: 'Petrosian vs Spassky',
    evento: 'Campeonato Mundial, 1966',
    orientacion: 'white',
    fen: 'r4rk1/1bqnbppp/p2pp3/1p6/3BPP2/2NB2Q1/PPP3PP/4RR1K w - - 0 1',
    solucion: ['f5', 'exf5', 'e5', 'dxe5', 'Nxe5'],
    descripcion: 'Petrosian lanza un ataque posicional con f5! abriendo líneas. Una demostración de cómo el "Tigran de Hierro" podía atacar cuando era necesario.',
    idea: 'f5! abre la posición de forma violenta. exf5, e5! dxe5, Nxe5 y las piezas blancas dominan el centro con una ventaja decisiva.',
    dificultad: '★★',
    color: '#d4af37',
  },
  {
    id: 10,
    titulo: 'Rxg7!! — Sacrificio de Torre',
    jugadores: 'Nezhmetdinov vs Chernikov',
    evento: 'URSS, 1962',
    orientacion: 'white',
    fen: 'r4rk1/pp1bppbp/2np1np1/q7/2BNP3/2N1BP2/PPP1Q1PP/2KR3R w - - 0 1',
    solucion: ['Nxd6', 'exd6', 'Bxf6', 'Bxf6', 'Rxh7'],
    descripcion: 'Nezhmetdinov sacrifica caballo y alfil para destruir la estructura del rey negro. Una combinación de belleza excepcional.',
    idea: 'Nxd6! elimina un defensor clave. Bxf6! destruye otro. Rxh7! es el golpe final que abre el rey negro a un ataque devastador.',
    dificultad: '★★★',
    color: '#d4af37',
  },
];

const DIFICULTAD_COLOR = { '★': '#4caf50', '★★': '#ff9800', '★★★': '#f44336' };

export default function BrillantesHistoricos() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [vista, setVista] = useState('lista'); // lista | jugando | resumen
  const [idx, setIdx] = useState(0);
  const [game, setGame] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highlight, setHighlight] = useState({});
  const [solved, setSolved] = useState(false);
  const [showIdea, setShowIdea] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [intentos, setIntentos] = useState(0);

  const brillante = BRILLANTES[idx];

  useEffect(() => {
    if (!brillante || vista !== 'jugando') return;
    setGame(new Chess(brillante.fen));
    setStepIdx(0);
    setFeedback(null);
    setHighlight({});
    setSolved(false);
    setShowIdea(false);
    setShowHint(false);
  }, [idx, vista]);

  // Movimiento del oponente
  useEffect(() => {
    if (!game || !brillante || solved || vista !== 'jugando') return;
    const isOpponent = stepIdx % 2 === 1 && stepIdx < brillante.solucion.length;
    if (!isOpponent) return;
    const t = setTimeout(() => {
      const g = new Chess(game.fen());
      const m = g.move(brillante.solucion[stepIdx]);
      if (m) {
        setGame(g);
        setHighlight({ [m.from]: { background: 'rgba(255,165,0,0.4)' }, [m.to]: { background: 'rgba(255,165,0,0.4)' } });
        playSound(m.flags.includes('c') ? 'capture' : 'move');
        const next = stepIdx + 1;
        setStepIdx(next);
        if (next >= brillante.solucion.length) {
          setSolved(true);
          setScore(s => s + 1);
          playSound('correct');
          setFeedback('solved');
          setTimeout(() => setShowIdea(true), 800);
        }
      }
    }, 700);
    return () => clearTimeout(t);
  }, [stepIdx, game]); // eslint-disable-line

  const onPieceDrop = (from, to) => {
    if (!game || solved || feedback === 'wrong') return false;
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;

    const expected = brillante.solucion[stepIdx];
    if (m.san === expected) {
      setGame(g);
      setHighlight({ [from]: { background: 'rgba(76,175,80,0.4)' }, [to]: { background: 'rgba(76,175,80,0.4)' } });
      playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= brillante.solucion.length) {
        setSolved(true);
        setScore(s => s + 1);
        playSound('correct');
        setFeedback('solved');
        setTimeout(() => setShowIdea(true), 800);
      } else {
        setFeedback('parcial');
      }
    } else {
      setHighlight({ [from]: { background: 'rgba(244,67,54,0.4)' }, [to]: { background: 'rgba(244,67,54,0.4)' } });
      setFeedback('wrong');
      setIntentos(i => i + 1);
      playSound('error');
      setTimeout(() => {
        setGame(new Chess(brillante.fen));
        setStepIdx(0);
        setHighlight({});
        setFeedback('retry');
      }, 900);
    }
    return true;
  };

  const siguiente = () => {
    if (idx + 1 >= BRILLANTES.length) { setVista('resumen'); return; }
    setIdx(i => i + 1);
  };

  // ── LISTA ──
  if (vista === 'lista') return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 32 }}>💎</span>
        <div>
          <h2 style={{ color: 'var(--accent)', margin: 0 }}>Brillantes Históricos</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
            Las combinaciones más brillantes de la historia del ajedrez. Encuentra el sacrificio genial.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => { setIdx(0); setScore(0); setIntentos(0); setVista('jugando'); }}
          style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}>
          💎 Empezar todos
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BRILLANTES.map((b, i) => (
          <div key={b.id} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--border-radius)', padding: '14px 18px',
            cursor: 'pointer', transition: 'border-color var(--transition)',
          }}
            onClick={() => { setIdx(i); setScore(0); setIntentos(0); setVista('jugando'); }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>💎</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 15 }}>{b.titulo}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{b.jugadores} · {b.evento}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <span style={{ color: DIFICULTAD_COLOR[b.dificultad] || '#ff9800', fontSize: 14 }}>{b.dificultad}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.solucion.length} movs.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RESUMEN ──
  if (vista === 'resumen') {
    const pct = Math.round((score / BRILLANTES.length) * 100);
    return (
      <div className="done-screen">
        <div className="done-icon">💎</div>
        <h2>¡Brillantes completados!</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px' }}>
          Has recorrido las combinaciones más bellas de la historia del ajedrez
        </p>
        <div className="done-stats">
          <div className="done-stat"><span>{score}</span><label>Resueltos</label></div>
          <div className="done-stat"><span>{BRILLANTES.length - score}</span><label>Con pista</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <div className="done-actions">
          <button onClick={() => { setIdx(0); setScore(0); setIntentos(0); setVista('jugando'); }}>🔄 Repetir</button>
          <button onClick={() => setVista('lista')}>← Volver</button>
        </div>
      </div>
    );
  }

  // ── JUGANDO ──
  if (!game) return null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>💎</span>
              <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.2rem' }}>{brillante.titulo}</h2>
              <span style={{ color: DIFICULTAD_COLOR[brillante.dificultad] || '#ff9800', fontSize: 14 }}>{brillante.dificultad}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {brillante.jugadores} · {brillante.evento}
            </div>
          </div>
          <span className="color-badge">{idx + 1}/{BRILLANTES.length}</span>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={brillante.orientacion}
            customSquareStyles={highlight}
            arePiecesDraggable={!solved && feedback !== 'wrong'}
            boardWidth={480}
            {...boardProps}
          />
        </div>

        <div className="training-sidebar">
          {/* Descripción */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--accent)' }}>
            {brillante.descripcion}
          </div>

          {/* Feedback */}
          <div className={`feedback-box ${feedback === 'solved' ? 'ok' : feedback === 'wrong' || feedback === 'retry' ? 'error' : feedback === 'parcial' ? 'ok' : ''}`}>
            {feedback === 'solved'  ? '💎 ¡Brillante encontrado!' :
             feedback === 'parcial' ? '✅ ¡Correcto! Continúa...' :
             feedback === 'wrong'   ? '❌ Ese no es el movimiento brillante' :
             feedback === 'retry'   ? '🔄 Inténtalo de nuevo' :
             `💡 Mueves las ${brillante.orientacion === 'white' ? 'blancas' : 'negras'} — ¿cuál es el sacrificio brillante?`}
          </div>

          {/* Pista */}
          {showHint && (
            <div className="feedback-box hint">
              💡 Pista: el primer movimiento es <strong style={{ color: 'var(--accent)' }}>{brillante.solucion[0]}</strong>
            </div>
          )}

          {/* Idea táctica (tras resolver) */}
          {showIdea && (
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                💡 La idea táctica
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {brillante.idea}
              </p>
            </div>
          )}

          {/* Solución */}
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Línea: {brillante.solucion.slice(0, stepIdx).map((m, i) => (
              <span key={i} style={{ color: 'var(--success)', marginRight: 4 }}>{m}</span>
            ))}
            {brillante.solucion.slice(stepIdx).map((m, i) => (
              <span key={i} style={{ marginRight: 4 }}>{'?'.repeat(m.length)}</span>
            ))}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!solved && !showHint && (
              <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setShowHint(true)}>💡 Pista</button>
            )}
            {solved && (
              <button className="start-btn" style={{ flex: 1 }} onClick={siguiente}>
                {idx + 1 < BRILLANTES.length ? 'Siguiente brillante →' : '🏁 Ver resumen'}
              </button>
            )}
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
