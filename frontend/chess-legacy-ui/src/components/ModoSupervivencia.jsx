import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const PUZZLES = [
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solucion: ['Bxf7+', 'Ke7', 'Nd5#'], titulo: 'Mate en 2', dificultad: 1 },
  { fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', solucion: ['Ra8#'], titulo: 'Mate del pasillo', dificultad: 1 },
  { fen: '2kr3r/ppp2ppp/2n5/3Rp1B1/8/2P5/PP3PPP/R5K1 w - - 0 1', solucion: ['Rd8+', 'Rxd8', 'Rxd8#'], titulo: 'Clavada', dificultad: 2 },
  { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solucion: ['Nxe5', 'Nxe5', 'Qh5'], titulo: 'Horquilla', dificultad: 2 },
  { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5', solucion: ['Nxe5', 'Nxe5', 'Bxf7+'], titulo: 'Descubierta', dificultad: 2 },
  { fen: '5rk1/pp3ppp/8/8/8/8/PP3PPP/4RNK1 w - - 0 1', solucion: ['Ng3', 'Kh8', 'Nf5', 'Kg8', 'Re8#'], titulo: 'Mate Anastasia', dificultad: 3 },
  { fen: '6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1', solucion: ['Qd8+', 'Kh7', 'Qg8+', 'Kxg8', 'f8=Q#'], titulo: 'Coronación', dificultad: 3 },
  { fen: 'r2qkb1r/ppp2ppp/2n1pn2/3p4/3P1B2/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 6', solucion: ['Bxb8', 'Rxb8', 'Nxd5'], titulo: 'Ganancia material', dificultad: 2 },
];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MAX_VIDAS = 3;

export default function ModoSupervivencia() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [phase, setPhase] = useState('menu'); // menu | playing | gameover
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [game, setGame] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [vidas, setVidas] = useState(MAX_VIDAS);
  const [racha, setRacha] = useState(0);
  const [maxRacha, setMaxRacha] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highlight, setHighlight] = useState({});
  const [solved, setSolved] = useState(false);
  const [xpGanado, setXpGanado] = useState(0);

  const puzzle = queue[qIdx];

  const start = () => {
    const q = shuffled(PUZZLES);
    setQueue(q);
    setQIdx(0);
    setVidas(MAX_VIDAS);
    setRacha(0);
    setMaxRacha(0);
    setXpGanado(0);
    setPhase('playing');
  };

  useEffect(() => {
    if (!puzzle) return;
    setGame(new Chess(puzzle.fen));
    setStepIdx(0);
    setFeedback(null);
    setHighlight({});
    setSolved(false);
  }, [qIdx, queue]);

  useEffect(() => {
    if (!game || !puzzle || solved) return;
    const isOpponent = stepIdx % 2 === 1 && stepIdx < puzzle.solucion.length;
    if (!isOpponent) return;
    const t = setTimeout(() => {
      const g = new Chess(game.fen());
      const m = g.move(puzzle.solucion[stepIdx]);
      if (m) {
        setGame(g);
        setHighlight({ [m.from]: { background: 'rgba(255,165,0,0.4)' }, [m.to]: { background: 'rgba(255,165,0,0.4)' } });
        playSound(m.flags.includes('c') ? 'capture' : 'move');
        const next = stepIdx + 1;
        setStepIdx(next);
        if (next >= puzzle.solucion.length) { setSolved(true); playSound('correct'); setFeedback('solved'); }
      }
    }, 500);
    return () => clearTimeout(t);
  }, [stepIdx, game]); // eslint-disable-line

  const onPieceDrop = (from, to) => {
    if (!game || solved || feedback === 'wrong') return false;
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;

    if (m.san === puzzle.solucion[stepIdx]) {
      setGame(g);
      setHighlight({ [from]: { background: 'rgba(76,175,80,0.4)' }, [to]: { background: 'rgba(76,175,80,0.4)' } });
      playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= puzzle.solucion.length) {
        const xp = puzzle.dificultad * 10;
        setSolved(true);
        setFeedback('solved');
        setXpGanado(x => x + xp);
        setRacha(r => { const nr = r + 1; setMaxRacha(mr => Math.max(mr, nr)); return nr; });
        playSound('correct');
      }
    } else {
      setHighlight({ [from]: { background: 'rgba(244,67,54,0.4)' }, [to]: { background: 'rgba(244,67,54,0.4)' } });
      setFeedback('wrong');
      playSound('error');
      const newVidas = vidas - 1;
      setVidas(newVidas);
      setRacha(0);
      setTimeout(() => {
        if (newVidas <= 0) { setPhase('gameover'); return; }
        setGame(new Chess(puzzle.fen));
        setStepIdx(0);
        setHighlight({});
        setFeedback('retry');
      }, 800);
    }
    return true;
  };

  const nextPuzzle = () => {
    if (qIdx + 1 >= queue.length) {
      // Añadir más puzzles mezclados
      setQueue(q => [...q, ...shuffled(PUZZLES)]);
    }
    setQIdx(i => i + 1);
  };

  if (phase === 'menu') return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 64 }}>💀</div>
      <h2 style={{ color: '#d4af37', margin: 0 }}>Modo Supervivencia</h2>
      <p style={{ color: '#c0c0c0', margin: 0 }}>Resuelve puzzles en cadena. Tienes 3 vidas — si las pierdes todas, game over. Cuantos más resuelves seguidos, más XP ganas.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {'❤️'.repeat(MAX_VIDAS).split('').map((v, i) => <span key={i} style={{ fontSize: 28 }}>{v}</span>)}
      </div>
      <button onClick={start} style={btnStyle}>🚀 Empezar</button>
    </div>
  );

  if (phase === 'gameover') return (
    <div className="done-screen">
      <div className="done-icon">💀</div>
      <h2>Game Over</h2>
      <div className="done-stats">
        <div className="done-stat"><span>{qIdx}</span><label>Puzzles</label></div>
        <div className="done-stat"><span>{maxRacha}</span><label>Máx. racha</label></div>
        <div className="done-stat"><span>{xpGanado}</span><label>XP ganado</label></div>
      </div>
      <div className="done-actions">
        <button onClick={start}>🔄 Reintentar</button>
        <button onClick={() => setPhase('menu')}>← Volver</button>
      </div>
    </div>
  );

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>{puzzle.titulo}</h2>
          <span style={{ fontSize: 12, color: '#888' }}>Puzzle #{qIdx + 1}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: '#d4af37', fontWeight: 'bold' }}>🔥 {racha}</span>
          <span style={{ color: '#888', fontSize: 13 }}>
            {Array.from({ length: MAX_VIDAS }, (_, i) => i < vidas ? '❤️' : '🖤').join('')}
          </span>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            customSquareStyles={highlight}
            arePiecesDraggable={!solved && feedback !== 'wrong'}
            boardWidth={480}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <div className={`feedback-box ${feedback === 'solved' ? 'ok' : feedback === 'wrong' || feedback === 'retry' ? 'error' : ''}`}>
            {feedback === 'solved' ? `✅ ¡Resuelto! +${puzzle.dificultad * 10} XP` :
             feedback === 'wrong' ? `❌ Incorrecto — ${vidas} vida${vidas !== 1 ? 's' : ''} restante${vidas !== 1 ? 's' : ''}` :
             feedback === 'retry' ? '🔄 Inténtalo de nuevo' :
             '🎯 Encuentra la mejor jugada'}
          </div>
          {solved && (
            <button className="start-btn" style={{ marginTop: 12 }} onClick={nextPuzzle}>
              Siguiente →
            </button>
          )}
          <div className="training-stats" style={{ marginTop: 12 }}>
            <span style={{ color: '#d4af37' }}>⚡ {xpGanado} XP</span>
            <span className="stat-ok">🔥 {racha}</span>
          </div>
          <button className="abandon-btn" onClick={() => setPhase('gameover')}>Abandonar</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '14px 28px', background: 'linear-gradient(135deg,#d4af37,#f0c040)',
  border: 'none', borderRadius: 10, fontWeight: 'bold', fontSize: 16,
  cursor: 'pointer', color: '#1a1a2e',
};
