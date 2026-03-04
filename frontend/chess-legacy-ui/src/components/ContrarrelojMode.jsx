import { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';

const SECONDS_PER_MOVE = 10;
const PHASES = { SELECT: 'select', PLAYING: 'playing', DONE: 'done' };

export default function ContrarrelojMode() {
  const [phase, setPhase] = useState(PHASES.SELECT);
  const [color, setColor] = useState('white');
  const [game, setGame] = useState(new Chess());
  const [theoryMoves, setTheoryMoves] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, errors: 0, timeouts: 0 });
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_MOVE);
  const [showingCorrect, setShowingCorrect] = useState(false);
  const [aperturaInfo, setAperturaInfo] = useState(null);
  const timerRef = useRef(null);

  const buildTheoryMoves = useCallback((rawMoves) => {
    const tmp = new Chess();
    return rawMoves.map(mv => { const r = tmp.move(mv); return r?.san; }).filter(Boolean);
  }, []);

  const isMyTurn = useCallback((idx, g) => {
    const turn = g.turn();
    return (color === 'white' && turn === 'w') || (color === 'black' && turn === 'b');
  }, [color]);

  const stopTimer = () => { clearInterval(timerRef.current); };

  const handleTimeout = useCallback((currentGame, idx, moves) => {
    stopTimer();
    const expected = moves[idx];
    setStats(s => ({ ...s, timeouts: s.timeouts + 1, errors: s.errors + 1 }));
    setShowingCorrect(true);
    setFeedback({ type: 'error', msg: `⏰ ¡Tiempo! El movimiento era: ${expected}` });
    setTimeout(() => {
      const gc = new Chess(currentGame.fen());
      gc.move(expected);
      setGame(gc);
      setTimeout(() => {
        setGame(new Chess(currentGame.fen()));
        setShowingCorrect(false);
        setTimeLeft(SECONDS_PER_MOVE);
        setFeedback({ type: 'hint', msg: `💡 Inténtalo: ${expected}` });
      }, 1500);
    }, 300);
  }, []);

  const playOpponentMove = useCallback((currentGame, idx, moves) => {
    if (idx >= moves.length) { setPhase(PHASES.DONE); return; }
    stopTimer();
    setTimeout(() => {
      const g = new Chess(currentGame.fen());
      g.move(moves[idx]);
      setGame(g);
      setMoveIndex(idx + 1);
      setFeedback({ type: 'ok', msg: `Movimiento: ${moves[idx]}` });
      setTimeLeft(SECONDS_PER_MOVE);
    }, 500);
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== PHASES.PLAYING || showingCorrect) return;
    if (!isMyTurn(moveIndex, game)) return;
    if (moveIndex >= theoryMoves.length) return;

    setTimeLeft(SECONDS_PER_MOVE);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout(game, moveIndex, theoryMoves);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveIndex, phase, showingCorrect]);

  // Opponent auto-move
  useEffect(() => {
    if (phase !== PHASES.PLAYING || showingCorrect) return;
    if (moveIndex >= theoryMoves.length) { setPhase(PHASES.DONE); return; }
    if (!isMyTurn(moveIndex, game)) playOpponentMove(game, moveIndex, theoryMoves);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveIndex, phase, showingCorrect]);

  const startRandom = async () => {
    try {
      const r = await aperturasAPI.getAprendizajeRandom();
      const info = r.data;
      const moves = buildTheoryMoves(info.movimientos);
      setAperturaInfo(info);
      setTheoryMoves(moves);
      setGame(new Chess());
      setMoveIndex(0);
      setFeedback(null);
      setStats({ correct: 0, errors: 0, timeouts: 0 });
      setShowingCorrect(false);
      setTimeLeft(SECONDS_PER_MOVE);
      setPhase(PHASES.PLAYING);
    } catch { setFeedback({ type: 'error', msg: 'Error cargando apertura.' }); }
  };

  const onPieceDrop = (from, to) => {
    if (phase !== PHASES.PLAYING || showingCorrect) return false;
    if (!isMyTurn(moveIndex, game)) return false;
    if (moveIndex >= theoryMoves.length) return false;

    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const expected = theoryMoves[moveIndex];
    stopTimer();

    if (move.san === expected) {
      setGame(g);
      setMoveIndex(moveIndex + 1);
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      setFeedback({ type: 'ok', msg: `✅ ¡Correcto! ${move.san}` });
    } else {
      setStats(s => ({ ...s, errors: s.errors + 1 }));
      setShowingCorrect(true);
      setFeedback({ type: 'error', msg: `❌ Incorrecto. Era: ${expected}` });
      setTimeout(() => {
        const gc = new Chess(game.fen());
        gc.move(expected);
        setGame(gc);
        setTimeout(() => {
          setGame(new Chess(game.fen()));
          setShowingCorrect(false);
          setTimeLeft(SECONDS_PER_MOVE);
          setFeedback({ type: 'hint', msg: `💡 Inténtalo: ${expected}` });
        }, 1500);
      }, 300);
    }
    return true;
  };

  const reset = () => {
    stopTimer();
    setPhase(PHASES.SELECT);
    setGame(new Chess());
    setTheoryMoves([]);
    setMoveIndex(0);
    setFeedback(null);
    setStats({ correct: 0, errors: 0, timeouts: 0 });
    setTimeLeft(SECONDS_PER_MOVE);
    setShowingCorrect(false);
  };

  const myTurn = phase === PHASES.PLAYING && isMyTurn(moveIndex, game) && !showingCorrect && moveIndex < theoryMoves.length;
  const timerPct = (timeLeft / SECONDS_PER_MOVE) * 100;
  const timerColor = timeLeft <= 3 ? '#f44336' : timeLeft <= 6 ? '#ff9800' : '#4caf50';

  if (phase === PHASES.SELECT) return (
    <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ color: '#d4af37', margin: 0 }}>⏱️ Modo Contrarreloj</h2>
      <p style={{ color: '#c0c0c0', margin: 0 }}>{SECONDS_PER_MOVE} segundos por movimiento. ¡No te quedes sin tiempo!</p>
      <div className="form-group">
        <label>Jugar con</label>
        <div className="color-selector">
          <button className={color === 'white' ? 'active' : ''} onClick={() => setColor('white')}>♔ Blancas</button>
          <button className={color === 'black' ? 'active' : ''} onClick={() => setColor('black')}>♚ Negras</button>
        </div>
      </div>
      {feedback && <div className="feedback-box error">{feedback.msg}</div>}
      <button className="random-btn" onClick={startRandom}>🎲 Apertura Aleatoria y ¡Empezar!</button>
    </div>
  );

  if (phase === PHASES.DONE) {
    const total = stats.correct + stats.errors;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 100;
    return (
      <div className="done-screen">
        <div className="done-icon">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <h2>¡Completado!</h2>
        <h3>{aperturaInfo?.apertura}{aperturaInfo?.variante ? ` — ${aperturaInfo.variante}` : ''}</h3>
        <div className="done-stats">
          <div className="done-stat"><span>{stats.correct}</span><label>Correctos</label></div>
          <div className="done-stat"><span>{stats.errors}</span><label>Errores</label></div>
          <div className="done-stat"><span>{stats.timeouts}</span><label>Tiempos</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <div className="done-actions">
          <button onClick={startRandom}>🔄 Otra aleatoria</button>
          <button onClick={reset}>← Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="training-header">
        <h2>{aperturaInfo?.apertura}{aperturaInfo?.variante ? ` — ${aperturaInfo.variante}` : ''}</h2>
        <span className="color-badge">{color === 'white' ? '♔ Blancas' : '♚ Negras'}</span>
      </div>

      {myTurn && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: timerColor, fontWeight: 'bold', fontSize: 18 }}>⏱ {timeLeft}s</span>
            <span style={{ color: '#888', fontSize: 13 }}>{moveIndex}/{theoryMoves.length}</span>
          </div>
          <div style={{ background: '#16213e', borderRadius: 6, height: 10, overflow: 'hidden' }}>
            <div style={{ width: `${timerPct}%`, height: '100%', background: timerColor, transition: 'width 1s linear, background 0.3s' }} />
          </div>
        </div>
      )}

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard position={game.fen()} onPieceDrop={onPieceDrop} boardOrientation={color} boardWidth={480} arePiecesDraggable={myTurn} />
        </div>
        <div className="training-sidebar">
          <div className={`feedback-box ${feedback?.type || ''}`}>
            {feedback ? feedback.msg : myTurn ? '🎯 Tu turno' : '⏳ Oponente...'}
          </div>
          <div className="training-stats">
            <span className="stat-ok">✅ {stats.correct}</span>
            <span className="stat-err">❌ {stats.errors}</span>
            <span style={{ color: '#ff9800', fontWeight: 'bold', fontSize: 18 }}>⏰ {stats.timeouts}</span>
          </div>
          <button className="abandon-btn" onClick={reset}>Abandonar</button>
        </div>
      </div>
    </div>
  );
}
