import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';

const getProgresoKey = () => {
  try {
    const userStr = localStorage.getItem('chess_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      return `chess_retos_progreso_${userObj.id || userObj.username || 'anon'}`;
    }
  } catch {}
  return 'chess_retos_progreso_anon';
};

const updateRetoProgreso = (key, value, isAccumulator = false) => {
  try {
    const hoyKey = new Date().toDateString();
    const storageKey = getProgresoKey();
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (stored.fecha !== hoyKey) {
      stored.fecha = hoyKey;
      stored.puzzles_resueltos = 0;
      stored.casillas_seguidas = 0;
      stored.contrarreloj_completados = [];
      stored.adivina_aciertos = 0;
      stored.aperturas_perfectas = [];
    }
    
    if (isAccumulator) {
      stored[key] = (stored[key] || 0) + value;
    } else {
      if (Array.isArray(stored[key])) {
        if (!stored[key].includes(value)) stored[key].push(value);
      } else {
        stored[key] = Math.max(stored[key] || 0, value);
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(stored));
  } catch {}
};

// FENs y soluciones verificados con chess.js
const PUZZLES = [
  {
    id: 1,
    titulo: 'Mate en 1 (Pasillo)',
    fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    solucion: ['Rd8#'],
    descripcion: 'Las blancas aprovechan la debilidad de la primera fila para dar el mate del pasillo.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 2,
    titulo: 'Horquilla de caballo',
    fen: 'q3k3/8/8/3N4/8/8/8/4K3 w - - 0 1',
    solucion: ['Nc7+'],
    descripcion: 'Usa el caballo blanco para dar un jaque doble y ganar la dama negra.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 3,
    titulo: 'Clavada ganadora',
    fen: '4k3/4q3/8/8/8/8/4R1K1/8 w - - 0 1',
    solucion: ['Rxe7+'],
    descripcion: 'Clava la dama enemiga contra el rey y gánala de manera simple.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 4,
    titulo: 'Mate de la coz (Ahogado)',
    fen: '6rk/5ppp/7N/8/8/8/8/6K1 w - - 0 1',
    solucion: ['Nf7#'],
    descripcion: 'El caballo remata al rey negro que se encuentra completamente asfixiado por sus propias piezas.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 5,
    titulo: 'Jaque descubierto',
    fen: '3k4/8/8/q7/3B4/8/8/3R2K1 w - - 0 1',
    solucion: ['Bb6+', 'Ke8', 'Bxa5'],
    descripcion: 'Mueve el alfil con doble jaque y descubre el ataque de tu torre sobre la dama rival para ganarla.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 6,
    titulo: 'Mate Árabe',
    fen: '7k/6R1/5N2/8/8/8/8/6K1 w - - 0 1',
    solucion: ['Rh7#'],
    descripcion: 'El rey negro está atrapado en la esquina. Remata coordinando la torre y el caballo.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 7,
    titulo: 'Mate de Anastasia',
    fen: 'r4r1k/1p2Nppp/8/7Q/8/5R2/6PP/6K1 w - - 0 1',
    solucion: ['Qxh7+', 'Kxh7', 'Rh3#'],
    descripcion: 'Sacrifica la dama en h7 para abrir la columna h y remata de forma brillante con la torre.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 8,
    titulo: 'Mate de Charreteras',
    fen: '3rkr2/8/8/3Q4/5N2/8/8/4K3 w - - 0 1',
    solucion: ['Qe6#'],
    descripcion: 'El rey negro está flanqueado por sus propias torres. Da mate en el centro con la dama defendida.',
    dificultad: 'Media',
    turno: 'w',
  },
  {
    id: 9,
    titulo: 'Coronación y Mate',
    fen: 'k7/5P2/2B5/8/8/8/8/4K3 w - - 0 1',
    solucion: ['f8=Q#'],
    descripcion: 'Promociona tu peón a dama dando jaque mate apoyado por la diagonal del alfil.',
    dificultad: 'Fácil',
    turno: 'w',
  },
  {
    id: 10,
    titulo: 'Mate con Caballo y Alfil',
    fen: 'k3N3/8/8/8/8/4B3/8/4K3 w - - 0 1',
    solucion: ['Nc7#'],
    descripcion: 'Usa el salto de caballo a c7 coordinado con el alfil para cerrar el escape del rey.',
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
        updateRetoProgreso('puzzles_resueltos', 1, true);
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
        updateRetoProgreso('puzzles_resueltos', 1, true);
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
