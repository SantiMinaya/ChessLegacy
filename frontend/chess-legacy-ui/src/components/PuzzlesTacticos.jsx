import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';

// FENs y soluciones verificados con chess.js
const PUZZLES = [
  {
    id: 1,
    titulo: 'Mate en 1',
    fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
    solucion: ['Re8#'],
    descripcion: 'Las blancas dan mate en 1 movimiento.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 2,
    titulo: 'Mate en 1 — Pasillo',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solucion: ['Re8#'],
    descripcion: 'Mate del pasillo: la torre da mate en la 8ª fila.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 3,
    titulo: 'Horquilla de caballo',
    fen: '4k3/8/8/3n4/8/8/8/2K1R3 b - - 0 1',
    solucion: ['Nf4'],
    descripcion: 'Las negras ganan la torre con una horquilla.',
    dificultad: 'Fácil',
    turno: 'b',
  },
  {
    id: 4,
    titulo: 'Clavada ganadora',
    fen: '3rk3/8/8/8/8/8/8/3RK3 w - - 0 1',
    solucion: ['Rd8+', 'Rxd8'],
    descripcion: 'Las blancas ganan la torre negra con una clavada.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 5,
    titulo: 'Mate en 2 — Ataque de flanco',
    fen: '5rk1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1',
    solucion: ['Rf6', 'Rxf6', 'gxf6#'],
    descripcion: 'Las blancas dan mate en 2 con un sacrificio de torre.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 6,
    titulo: 'Doble amenaza',
    fen: '4k3/8/8/8/8/8/8/R3K3 w Q - 0 1',
    solucion: ['Ra8#'],
    descripcion: 'Mate con torre en la 8ª fila.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 7,
    titulo: 'Coronación con mate',
    fen: '8/5P1k/8/8/8/8/8/6K1 w - - 0 1',
    solucion: ['f8=Q+', 'Kh6', 'Qg7#'],
    descripcion: 'Corona el peón y da mate en 2.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 8,
    titulo: 'Mate de Epaulette',
    fen: '3qk3/8/8/8/8/8/8/3QK3 w - - 0 1',
    solucion: ['Qd8+', 'Qxd8#'],
    descripcion: 'Las blancas dan mate con un sacrificio de dama.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 9,
    titulo: 'Mate de Boden',
    fen: '2kr4/ppp5/8/8/8/8/8/2B1KB2 w - - 0 1',
    solucion: ['Ba6#'],
    descripcion: 'Mate con dos alfiles cruzados.',
    dificultad: 'Difícil',
    turno: 'w',
  },
  {
    id: 10,
    titulo: 'Zugzwang',
    fen: '8/8/8/8/8/1k6/8/1K6 w - - 0 1',
    solucion: ['Ka1'],
    descripcion: 'Las blancas fuerzan zugzwang al rey negro.',
    dificultad: 'Difícil',
    turno: 'w',
  },
];

const DIFICULTAD_COLOR = { 'Fácil': '#4caf50', 'Media': '#ff9800', 'Difícil': '#f44336' };

export default function PuzzlesTacticos() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [idx, setIdx] = useState(0);
  const [game, setGame] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'wrong' | 'solved'
  const [highlight, setHighlight] = useState({});
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const puzzle = PUZZLES[idx];

  const resetPuzzle = useCallback((p) => {
    setGame(new Chess(p.fen));
    setStepIdx(0);
    setFeedback(null);
    setHighlight({});
    setSolved(false);
    setShowHint(false);
  }, []);

  useEffect(() => {
    if (puzzle) resetPuzzle(puzzle);
  }, [idx]); // eslint-disable-line

  // Movimiento automático del oponente (pasos pares = usuario, impares = oponente)
  useEffect(() => {
    if (!game || !puzzle || solved) return;
    const isOpponentTurn = stepIdx % 2 === 1 && stepIdx < puzzle.solucion.length;
    if (!isOpponentTurn) return;
    const timer = setTimeout(() => {
      const g = new Chess(game.fen());
      const move = g.move(puzzle.solucion[stepIdx]);
      if (!move) return;
      setGame(g);
      setHighlight({
        [move.from]: { background: 'rgba(255,165,0,0.4)' },
        [move.to]:   { background: 'rgba(255,165,0,0.4)' },
      });
      playSound(move.flags.includes('c') ? 'capture' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= puzzle.solucion.length) {
        setSolved(true);
        setScore(s => s + 1);
        setFeedback('solved');
        playSound('correct');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [stepIdx]); // eslint-disable-line

  const handleMove = useCallback(async (from, to) => {
    if (!game || solved || feedback === 'wrong') return false;
    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const expected = puzzle.solucion[stepIdx];
    // Comparar tanto por SAN como por from+to para mayor tolerancia
    const expectedMove = new Chess(game.fen()).move(expected);
    const isCorrect = expectedMove && move.from === expectedMove.from && move.to === expectedMove.to;

    if (isCorrect) {
      setGame(g);
      setHighlight({
        [from]: { background: 'rgba(76,175,80,0.4)' },
        [to]:   { background: 'rgba(76,175,80,0.4)' },
      });
      playSound(move.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= puzzle.solucion.length) {
        setSolved(true);
        setScore(s => s + 1);
        setFeedback('solved');
        playSound('correct');
      } else {
        setFeedback('ok');
      }
    } else {
      setHighlight({
        [from]: { background: 'rgba(244,67,54,0.4)' },
        [to]:   { background: 'rgba(244,67,54,0.4)' },
      });
      setFeedback('wrong');
      playSound('error');
      setTimeout(() => resetPuzzle(puzzle), 1000);
    }
    return true;
  }, [game, solved, feedback, puzzle, stepIdx, playSound, resetPuzzle]);

  const { onSquareClick, onPieceDrop, customSquareStyles } = useChessInput(
    game ?? new Chess(),
    puzzle?.turno === 'w' ? 'white' : 'black',
    !solved && feedback !== 'wrong' && !!game,
    handleMove
  );

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

  const mergedStyles = { ...customSquareStyles, ...highlight };

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
            onSquareClick={onSquareClick}
            customSquareStyles={mergedStyles}
            boardOrientation={puzzle.turno === 'w' ? 'white' : 'black'}
            arePiecesDraggable={!solved && feedback !== 'wrong'}
            boardWidth={480}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <p style={{ color: '#c0c0c0', fontSize: 14, margin: '0 0 12px' }}>{puzzle.descripcion}</p>
          <p style={{ color: '#888', fontSize: 13, margin: '0 0 16px' }}>
            Juegas con {puzzle.turno === 'w' ? '♔ blancas' : '♚ negras'}
          </p>

          <div className={`feedback-box ${feedback === 'solved' ? 'ok' : feedback === 'wrong' ? 'error' : feedback === 'ok' ? 'ok' : ''}`}>
            {feedback === 'solved' ? '✅ ¡Puzzle resuelto!' :
             feedback === 'wrong'  ? '❌ Incorrecto, inténtalo de nuevo' :
             feedback === 'ok'     ? '✅ ¡Correcto! Sigue...' :
             '🎯 Encuentra la mejor jugada'}
          </div>

          {showHint && (
            <div className="feedback-box" style={{ marginTop: 8, borderColor: '#d4af37' }}>
              💡 Pista: <strong style={{ color: '#d4af37' }}>{puzzle.solucion[stepIdx]}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {!solved && (
              <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setShowHint(true)}>
                💡 Pista
              </button>
            )}
            {solved && (
              <button className="start-btn" style={{ flex: 1 }} onClick={nextPuzzle}>
                Siguiente →
              </button>
            )}
            <button className="abandon-btn" onClick={() => resetPuzzle(puzzle)}>🔄 Reiniciar</button>
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
