import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

// Puzzles hardcodeados extraídos de posiciones clásicas famosas
const PUZZLES = [
  {
    id: 1, titulo: 'Mate en 2 — Morphy',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    solucion: ['Bxf7+', 'Ke7', 'Nd5#'],
    descripcion: 'Las blancas dan mate en 2 movimientos',
    dificultad: 'Fácil',
  },
  {
    id: 2, titulo: 'Horquilla de caballo',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
    solucion: ['Nxe5', 'Nxe5', 'Qh5'],
    descripcion: 'Gana material con una combinación táctica',
    dificultad: 'Fácil',
  },
  {
    id: 3, titulo: 'Clavada decisiva',
    fen: '2kr3r/ppp2ppp/2n5/3Rp1B1/8/2P5/PP3PPP/R5K1 w - - 0 1',
    solucion: ['Rd8+', 'Rxd8', 'Rxd8#'],
    descripcion: 'Usa la clavada para dar mate',
    dificultad: 'Media',
  },
  {
    id: 4, titulo: 'Sacrificio de dama',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1',
    solucion: ['Qd8+', 'Kh7', 'Qg8+', 'Kxg8', 'f8=Q#'],
    descripcion: 'Sacrifica la dama para coronar con mate',
    dificultad: 'Difícil',
  },
  {
    id: 5, titulo: 'Ataque a la descubierta',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
    solucion: ['Nxe5', 'Nxe5', 'Bxf7+'],
    descripcion: 'Ataque a la descubierta ganando material',
    dificultad: 'Media',
  },
  {
    id: 6, titulo: 'Mate del pasillo',
    fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
    solucion: ['Ra8#'],
    descripcion: 'Mate del pasillo clásico',
    dificultad: 'Fácil',
  },
  {
    id: 7, titulo: 'Doble jaque',
    fen: 'r1bqkb1r/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6',
    solucion: ['Ng5', 'O-O', 'Nxf7'],
    descripcion: 'Ataque al punto f7 con doble amenaza',
    dificultad: 'Media',
  },
  {
    id: 8, titulo: 'Mate de Anastasia',
    fen: '5rk1/pp3ppp/8/8/8/8/PP3PPP/4RNK1 w - - 0 1',
    solucion: ['Ng3', 'Kh8', 'Nf5', 'Kg8', 'Re8#'],
    descripcion: 'El clásico mate de Anastasia',
    dificultad: 'Difícil',
  },
];

const DIFICULTAD_COLOR = { 'Fácil': '#4caf50', 'Media': '#ff9800', 'Difícil': '#f44336' };

export default function PuzzlesTacticos() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [idx, setIdx] = useState(0);
  const [game, setGame] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highlight, setHighlight] = useState({});
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const puzzle = PUZZLES[idx];

  useEffect(() => {
    if (!puzzle) return;
    setGame(new Chess(puzzle.fen));
    setStepIdx(0);
    setFeedback(null);
    setHighlight({});
    setSolved(false);
    setShowHint(false);
  }, [idx]);

  // Tras el movimiento del usuario correcto, jugar respuesta del oponente
  useEffect(() => {
    if (!game || !puzzle || solved) return;
    const isOpponentTurn = stepIdx % 2 === 1 && stepIdx < puzzle.solucion.length;
    if (!isOpponentTurn) return;

    const timer = setTimeout(() => {
      const g = new Chess(game.fen());
      const move = g.move(puzzle.solucion[stepIdx]);
      if (move) {
        setGame(g);
        setHighlight({ [move.from]: { background: 'rgba(255,165,0,0.4)' }, [move.to]: { background: 'rgba(255,165,0,0.4)' } });
        playSound(move.flags.includes('c') ? 'capture' : 'move');
        const next = stepIdx + 1;
        setStepIdx(next);
        if (next >= puzzle.solucion.length) { setSolved(true); setScore(s => s + 1); playSound('correct'); setFeedback('solved'); }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [stepIdx, game]); // eslint-disable-line

  const onPieceDrop = (from, to) => {
    if (!game || solved || feedback === 'wrong') return false;
    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const expected = puzzle.solucion[stepIdx];
    if (move.san === expected) {
      setGame(g);
      setHighlight({ [from]: { background: 'rgba(76,175,80,0.4)' }, [to]: { background: 'rgba(76,175,80,0.4)' } });
      playSound(move.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= puzzle.solucion.length) { setSolved(true); setScore(s => s + 1); playSound('correct'); setFeedback('solved'); }
      else setFeedback(null);
    } else {
      setHighlight({ [from]: { background: 'rgba(244,67,54,0.4)' }, [to]: { background: 'rgba(244,67,54,0.4)' } });
      setFeedback('wrong');
      playSound('error');
      setTimeout(() => {
        setGame(new Chess(puzzle.fen));
        setStepIdx(0);
        setHighlight({});
        setFeedback('retry');
      }, 1000);
    }
    return true;
  };

  const nextPuzzle = () => {
    if (idx + 1 >= PUZZLES.length) { setDone(true); return; }
    setIdx(i => i + 1);
  };

  if (done) {
    const pct = Math.round((score / PUZZLES.length) * 100);
    return (
      <div className="done-screen">
        <div className="done-icon">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <h2>¡Puzzles completados!</h2>
        <div className="done-stats">
          <div className="done-stat"><span>{score}</span><label>Resueltos</label></div>
          <div className="done-stat"><span>{PUZZLES.length - score}</span><label>Fallados</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <div className="done-actions">
          <button onClick={() => { setIdx(0); setScore(0); setDone(false); }}>🔄 Repetir</button>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>{puzzle.titulo}</h2>
          <span style={{ fontSize: 12, color: DIFICULTAD_COLOR[puzzle.dificultad] }}>● {puzzle.dificultad}</span>
        </div>
        <span className="color-badge">{idx + 1}/{PUZZLES.length}</span>
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
          <p style={{ color: '#c0c0c0', fontSize: 14, margin: '0 0 12px' }}>{puzzle.descripcion}</p>

          <div className={`feedback-box ${feedback === 'solved' ? 'ok' : feedback === 'wrong' || feedback === 'retry' ? 'error' : ''}`}>
            {feedback === 'solved' ? '✅ ¡Puzzle resuelto!' :
             feedback === 'wrong' ? '❌ Movimiento incorrecto' :
             feedback === 'retry' ? '🔄 Inténtalo de nuevo' :
             '🎯 Encuentra la mejor jugada'}
          </div>

          {showHint && (
            <div className="feedback-box hint" style={{ marginTop: 8 }}>
              💡 Pista: {puzzle.solucion[0]}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {!solved && <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setShowHint(true)}>💡 Pista</button>}
            {solved && <button className="start-btn" style={{ flex: 1 }} onClick={nextPuzzle}>Siguiente →</button>}
            <button className="abandon-btn" onClick={() => setIdx(i => (i + 1) % PUZZLES.length)}>⏭ Saltar</button>
          </div>

          <div className="training-stats" style={{ marginTop: 12 }}>
            <span className="stat-ok">✅ {score}</span>
            <span className="stat-err">❌ {idx - score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
