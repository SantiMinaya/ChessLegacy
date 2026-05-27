import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const PUZZLES = [
  { fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1', solucion: ['Rd8#'], titulo: 'Mate en 1 (Pasillo)', dificultad: 1 },
  { fen: 'q3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', solucion: ['Nc7+'], titulo: 'Horquilla de caballo', dificultad: 1 },
  { fen: '4k3/4q3/8/8/8/8/4R1K1/8 w - - 0 1', solucion: ['Rxe7+'], titulo: 'Clavada ganadora', dificultad: 1 },
  { fen: '6rk/5ppp/7N/8/8/8/8/6K1 w - - 0 1', solucion: ['Nf7#'], titulo: 'Mate de la coz (Ahogado)', dificultad: 2 },
  { fen: '3k4/8/8/q7/3B4/8/8/3R2K1 w - - 0 1', solucion: ['Bb6+', 'Ke8', 'Bxa5'], titulo: 'Jaque descubierto', dificultad: 2 },
  { fen: '7k/6R1/5N2/8/8/8/8/6K1 w - - 0 1', solucion: ['Rh7#'], titulo: 'Mate Árabe', dificultad: 1 },
  { fen: 'r4r1k/1p2Nppp/8/7Q/8/5R2/6PP/6K1 w - - 0 1', solucion: ['Qxh7+', 'Kxh7', 'Rh3#'], titulo: 'Mate de Anastasia', dificultad: 2 },
  { fen: '3rkr2/8/8/3Q4/5N2/8/8/4K3 w - - 0 1', solucion: ['Qe6#'], titulo: 'Mate de Charreteras', dificultad: 2 },
  { fen: 'k7/5P2/2B5/8/8/8/8/4K3 w - - 0 1', solucion: ['f8=Q#'], titulo: 'Coronación y Mate', dificultad: 1 },
  { fen: 'k3N3/8/8/8/8/4B3/8/4K3 w - - 0 1', solucion: ['Nc7#'], titulo: 'Mate con Caballo y Alfil', dificultad: 3 },
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
