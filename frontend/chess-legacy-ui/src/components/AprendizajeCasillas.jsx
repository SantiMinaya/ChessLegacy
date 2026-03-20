import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['1','2','3','4','5','6','7','8'];
const ALL_SQUARES = FILES.flatMap(f => RANKS.map(r => f + r));

// FEN vacío válido para react-chessboard (rey fuera del tablero no es posible,
// usamos la posición inicial pero sin piezas visibles no es posible en chess.js,
// así que usamos un FEN con solo reyes en esquinas que no interfieren)
const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

const PIECE_POSITIONS = [
  { fen: '8/8/8/8/8/8/8/4B3 w - - 0 1', moves: ['Bc3','Bd2','Bf2','Bg3','Bh4','Bd4','Bc5','Bb6','Ba7'] },
  { fen: '8/8/8/8/8/8/8/3N4 w - - 0 1', moves: ['Nb3','Nf3','Ne2','Nc2'] },
  { fen: '8/8/8/8/8/8/8/3Q4 w - - 0 1', moves: ['Qa4','Qd4','Qh5','Qh1','Qa1'] },
  { fen: '8/8/8/8/8/8/8/3R4 w - - 0 1', moves: ['Ra1','Rh1','Rd8','Rd4'] },
  { fen: '8/8/8/8/8/8/8/6B1 w - - 0 1', moves: ['Bf2','Be3','Bd4','Bc5','Bb6','Ba7','Bh2'] },
];

function getSquareColor(sq) {
  const file = sq.charCodeAt(0) - 97;
  const rank = parseInt(sq[1]) - 1;
  return (file + rank) % 2 === 0 ? 'negra' : 'blanca';
}

function pickPieceRound() {
  const entry = PIECE_POSITIONS[Math.floor(Math.random() * PIECE_POSITIONS.length)];
  const move = entry.moves[Math.floor(Math.random() * entry.moves.length)];
  return { entry, move, game: new Chess(entry.fen) };
}

const TOTAL = 10;

const btnStyle = {
  display: 'flex', alignItems: 'center', gap: 16,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.3)',
  borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
};

export default function AprendizajeCasillas() {
  const { playSound } = useToast();
  const [mode, setMode] = useState(null);

  // Estado modo casilla
  const [target, setTarget] = useState('');

  // Estado modo pieza
  const [pieceRound, setPieceRound] = useState(null);

  // Estado común
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const [highlight, setHighlight] = useState({});

  function startMode(m) {
    setMode(m);
    setScore(0);
    setRound(0);
    setDone(false);
    setFeedback(null);
    setHighlight({});
    if (m === 'casilla') {
      setTarget(ALL_SQUARES[Math.floor(Math.random() * ALL_SQUARES.length)]);
    } else {
      setPieceRound(pickPieceRound());
    }
  }

  function advanceRound(wasCorrect) {
    const nextRound = round + 1;
    if (nextRound >= TOTAL) {
      setRound(nextRound);
      setDone(true);
      return;
    }
    setTimeout(() => {
      setRound(nextRound);
      setFeedback(null);
      setHighlight({});
      if (mode === 'casilla') {
        setTarget(ALL_SQUARES[Math.floor(Math.random() * ALL_SQUARES.length)]);
      } else {
        setPieceRound(pickPieceRound());
      }
    }, 1000);
  }

  const handleSquareClick = (sq) => {
    if (feedback !== null || done) return;
    const correct = sq === target;
    setHighlight({
      [sq]: { background: correct ? 'rgba(76,175,80,0.7)' : 'rgba(244,67,54,0.7)' },
      ...(!correct ? { [target]: { background: 'rgba(76,175,80,0.5)' } } : {}),
    });
    setFeedback(correct ? 'ok' : 'error');
    if (correct) { setScore(s => s + 1); playSound('correct'); }
    else playSound('error');
    advanceRound(correct);
  };

  const handlePieceDrop = (from, to) => {
    if (!pieceRound || feedback !== null) return false;
    const g = new Chess(pieceRound.game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const correct = move.san === pieceRound.move;
    setHighlight({
      [from]: { background: correct ? 'rgba(76,175,80,0.4)' : 'rgba(244,67,54,0.4)' },
      [to]:   { background: correct ? 'rgba(76,175,80,0.7)' : 'rgba(244,67,54,0.7)' },
    });
    setFeedback(correct ? 'ok' : 'error');
    if (correct) { setScore(s => s + 1); playSound('correct'); }
    else playSound('error');
    advanceRound(correct);
    return true;
  };

  if (!mode) return (
    <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ color: '#d4af37', margin: 0 }}>🗺️ Aprender Casillas</h2>
      <p style={{ color: '#c0c0c0', margin: 0 }}>Entrena tu conocimiento del tablero</p>
      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        <button onClick={() => startMode('casilla')} style={btnStyle}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#e0e0e0' }}>Encuentra la casilla</div>
            <div style={{ fontSize: 12, color: '#888' }}>Se muestra "e4" y tienes que hacer clic en esa casilla del tablero vacío</div>
          </div>
        </button>
        <button onClick={() => startMode('pieza')} style={btnStyle}>
          <span style={{ fontSize: 28 }}>♞</span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#e0e0e0' }}>Mueve la pieza</div>
            <div style={{ fontSize: 12, color: '#888' }}>Se muestra "Bc5" y tienes que mover el alfil a esa casilla</div>
          </div>
        </button>
      </div>
    </div>
  );

  if (done) {
    const pct = Math.round((score / TOTAL) * 100);
    return (
      <div className="done-screen">
        <div className="done-icon">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <h2>¡Completado!</h2>
        <div className="done-stats">
          <div className="done-stat"><span>{score}</span><label>Correctas</label></div>
          <div className="done-stat"><span>{TOTAL - score}</span><label>Errores</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <div className="done-actions">
          <button onClick={() => setMode(null)}>← Volver</button>
          <button onClick={() => startMode(mode)}>🔄 Repetir</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="training-header">
        <h2 style={{ color: '#d4af37' }}>
          {mode === 'casilla' ? '🎯 Encuentra la casilla' : '♞ Mueve la pieza'}
        </h2>
        <span className="color-badge">{round + 1}/{TOTAL}</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          {mode === 'casilla' ? (
            <Chessboard
              position={EMPTY_FEN}
              onSquareClick={handleSquareClick}
              customSquareStyles={highlight}
              arePiecesDraggable={false}
              boardWidth={480}
            />
          ) : (
            <Chessboard
              position={pieceRound?.game.fen() || EMPTY_FEN}
              onPieceDrop={handlePieceDrop}
              customSquareStyles={highlight}
              arePiecesDraggable={feedback === null}
              boardWidth={480}
            />
          )}
        </div>

        <div className="training-sidebar">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 52, fontWeight: 'bold', color: '#d4af37', letterSpacing: 3 }}>
              {mode === 'casilla' ? target : pieceRound?.move}
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              {mode === 'casilla'
                ? `Casilla ${getSquareColor(target)}`
                : 'Realiza este movimiento'}
            </div>
          </div>

          <div className={`feedback-box ${feedback || ''}`}>
            {feedback === 'ok'    ? '✅ ¡Correcto!' :
             feedback === 'error' ? '❌ Incorrecto' :
             mode === 'casilla'   ? '👆 Haz clic en la casilla' :
                                    '🖱️ Arrastra la pieza'}
          </div>

          <div className="training-stats" style={{ marginTop: 12 }}>
            <span className="stat-ok">✅ {score}</span>
            <span className="stat-err">❌ {round - score}</span>
          </div>

          <button className="abandon-btn" onClick={() => setMode(null)}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
