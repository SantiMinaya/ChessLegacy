import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI, progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContrarrelojMode from './ContrarrelojMode';
import AdivinarApertura from './AdivinarApertura';
import ArbolAperturas from './ArbolAperturas';
import { useBoardTheme } from '../context/BoardThemeContext';
import './AperturaTraining.css';

const PHASES = { SELECT: 'select', PLAYING: 'playing', DONE: 'done' };

export default function AperturaTraining({ onBack, hideBack }) {
  const { user } = useAuth();
  const { boardProps } = useBoardTheme();
  const [subTab, setSubTab] = useState('aprender');
  const [progresoKey, setProgresoKey] = useState(0);
  const [phase, setPhase] = useState(PHASES.SELECT);
  const [aperturas, setAperturas] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [selectedApertura, setSelectedApertura] = useState('');
  const [selectedVariante, setSelectedVariante] = useState('');
  const [color, setColor] = useState('white');

  // Estado de juego
  const [game, setGame] = useState(new Chess());
  const [theoryMoves, setTheoryMoves] = useState([]); // movimientos en notación SAN
  const [moveIndex, setMoveIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'error'|'ok'|'hint', msg, correctMove }
  const [stats, setStats] = useState({ correct: 0, errors: 0 });
  const [showingCorrect, setShowingCorrect] = useState(false);
  const [aperturaInfo, setAperturaInfo] = useState(null);
  const [showTheory, setShowTheory] = useState(false);

  useEffect(() => {
    aperturasAPI.getAll().then(r => setAperturas(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedApertura) { setVariantes([]); setSelectedVariante(''); return; }
    aperturasAPI.getVariantes(selectedApertura)
      .then(r => { setVariantes(r.data); setSelectedVariante(''); })
      .catch(() => setVariantes([]));
  }, [selectedApertura]);

  // Convierte movimientos UCI/SAN de la teoría a SAN usando chess.js
  const buildTheoryMoves = useCallback((rawMoves) => {
    const tmp = new Chess();
    const sanMoves = [];
    for (const mv of rawMoves) {
      // Los movimientos del backend ya están en SAN (e4, Nf3, etc.)
      const result = tmp.move(mv);
      if (!result) break;
      sanMoves.push(result.san);
    }
    return sanMoves;
  }, []);

  const startTraining = async () => {
    if (!selectedApertura) return;
    try {
      const r = await aperturasAPI.getAprendizaje(selectedApertura, selectedVariante || undefined);
      const info = r.data;
      const sanMoves = buildTheoryMoves(info.movimientos);
      setAperturaInfo(info);
      setTheoryMoves(sanMoves);
      setGame(new Chess());
      setMoveIndex(0);
      setFeedback(null);
      setStats({ correct: 0, errors: 0 });
      setShowingCorrect(false);
      setShowTheory(false);
      setPhase(PHASES.PLAYING);
    } catch {
      setFeedback({ type: 'error', msg: 'No se encontró esa apertura/variante.' });
    }
  };

  const startRandom = async () => {
    try {
      const r = await aperturasAPI.getAprendizajeRandom();
      const info = r.data;
      const sanMoves = buildTheoryMoves(info.movimientos);
      setAperturaInfo(info);
      setTheoryMoves(sanMoves);
      setSelectedApertura(info.apertura);
      setSelectedVariante(info.variante || '');
      setGame(new Chess());
      setMoveIndex(0);
      setFeedback(null);
      setStats({ correct: 0, errors: 0 });
      setShowingCorrect(false);
      setShowTheory(false);
      setPhase(PHASES.PLAYING);
    } catch {
      setFeedback({ type: 'error', msg: 'Error al cargar apertura aleatoria.' });
    }
  };

  // Determina si el turno actual le toca al usuario
  const isMyTurn = useCallback((idx, currentGame) => {
    const turn = currentGame.turn(); // 'w' o 'b'
    return (color === 'white' && turn === 'w') || (color === 'black' && turn === 'b');
  }, [color]);

  // Ejecuta el movimiento del oponente (teoría)
  const playOpponentMove = useCallback((currentGame, idx) => {
    if (idx >= theoryMoves.length) {
      setPhase(PHASES.DONE);
      return;
    }
    const move = theoryMoves[idx];
    setTimeout(() => {
      const g = new Chess(currentGame.fen());
      g.move(move);
      setGame(g);
      setMoveIndex(idx + 1);
      setFeedback({ type: 'ok', msg: `Movimiento teórico: ${move}` });
    }, 600);
  }, [theoryMoves]);

  // Guardar sesión al completar
  useEffect(() => {
    if (phase !== PHASES.DONE || !user?.token || !aperturaInfo) return;
    const total = stats.correct + stats.errors;
    progresoAPI.guardarSesion(user.token, {
      apertura: aperturaInfo.apertura,
      variante: aperturaInfo.variante || null,
      color,
      intentos: total,
      aciertos: stats.correct,
      modo: 'aprender',
    }).then(() => setProgresoKey(k => k + 1)).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Al cambiar moveIndex, si no es mi turno, jugar automáticamente
  useEffect(() => {
    if (phase !== PHASES.PLAYING || showingCorrect) return;
    if (moveIndex >= theoryMoves.length) { setPhase(PHASES.DONE); return; }
    if (!isMyTurn(moveIndex, game)) {
      playOpponentMove(game, moveIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveIndex, phase, showingCorrect]);

  const onPieceDrop = (from, to) => {
    if (phase !== PHASES.PLAYING || showingCorrect) return false;
    if (!isMyTurn(moveIndex, game)) return false;
    if (moveIndex >= theoryMoves.length) return false;

    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const expected = theoryMoves[moveIndex];

    if (move.san === expected) {
      // Correcto
      setGame(g);
      setMoveIndex(moveIndex + 1);
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      setFeedback({ type: 'ok', msg: `✅ ¡Correcto! ${move.san}` });
    } else {
      // Incorrecto — mostrar el movimiento correcto
      setStats(s => ({ ...s, errors: s.errors + 1 }));
      setShowingCorrect(true);
      setFeedback({ type: 'error', msg: `❌ Incorrecto. El movimiento teórico es: ${expected}` });

      // Mostrar el movimiento correcto en el tablero
      setTimeout(() => {
        const gc = new Chess(game.fen());
        gc.move(expected);
        setGame(gc);
        setTimeout(() => {
          // Revertir y dejar que el usuario lo intente de nuevo
          setGame(new Chess(game.fen()));
          setShowingCorrect(false);
          setFeedback({ type: 'hint', msg: `💡 Inténtalo de nuevo. Pista: ${expected}` });
        }, 1500);
      }, 300);
    }
    return true;
  };

  const reset = () => {
    setPhase(PHASES.SELECT);
    setGame(new Chess());
    setTheoryMoves([]);
    setMoveIndex(0);
    setFeedback(null);
    setStats({ correct: 0, errors: 0 });
    setShowingCorrect(false);
    setShowTheory(false);
  };

  const progress = theoryMoves.length > 0 ? Math.round((moveIndex / theoryMoves.length) * 100) : 0;

  // ── RENDER SELECT ──
  const subTabsBar = (
    <div className="sub-tabs">
      <button className={subTab === 'aprender' ? 'active' : ''} onClick={() => setSubTab('aprender')}>📖 Aprender</button>
      <button className={subTab === 'contrarreloj' ? 'active' : ''} onClick={() => setSubTab('contrarreloj')}>⏱️ Contrarreloj</button>
      <button className={subTab === 'adivinar' ? 'active' : ''} onClick={() => setSubTab('adivinar')}>🤔 Adivina la Apertura</button>
      <button className={subTab === 'progreso' ? 'active' : ''} onClick={() => setSubTab('progreso')}>📊 Progreso</button>
    </div>
  );

  if (subTab === 'contrarreloj') return (
    <div className="apertura-training">
      {!hideBack && <button className="back-btn" onClick={onBack}>← Volver</button>}
      {subTabsBar}
      <ContrarrelojMode />
    </div>
  );

  if (subTab === 'adivinar') return (
    <div className="apertura-training">
      {!hideBack && <button className="back-btn" onClick={onBack}>← Volver</button>}
      {subTabsBar}
      <AdivinarApertura />
    </div>
  );

  if (subTab === 'progreso') return (
    <div className="apertura-training">
      {!hideBack && <button className="back-btn" onClick={onBack}>← Volver</button>}
      {subTabsBar}
      <ArbolAperturas
        refreshKey={progresoKey}
        onPracticar={(ap, va) => { setSelectedApertura(ap); setSelectedVariante(va); setSubTab('aprender'); }}
      />
    </div>
  );

  if (phase === PHASES.SELECT) {
    return (
      <div className="apertura-training">
        {!hideBack && <button className="back-btn" onClick={onBack}>← Volver</button>}
        {subTabsBar}
        <h1>📖 Aprendizaje de Aperturas</h1>
        <p className="subtitle">Selecciona una apertura y aprende la teoría movimiento a movimiento</p>

        <div className="select-form">
          <div className="form-group">
            <label>Apertura</label>
            <select value={selectedApertura} onChange={e => setSelectedApertura(e.target.value)}>
              <option value="">-- Selecciona --</option>
              {aperturas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {variantes.length > 0 && (
            <div className="form-group">
              <label>Variante</label>
              <select value={selectedVariante} onChange={e => setSelectedVariante(e.target.value)}>
                <option value="">-- Línea principal --</option>
                {variantes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Jugar con</label>
            <div className="color-selector">
              <button className={color === 'white' ? 'active' : ''} onClick={() => setColor('white')}>♔ Blancas</button>
              <button className={color === 'black' ? 'active' : ''} onClick={() => setColor('black')}>♚ Negras</button>
            </div>
          </div>

          {feedback && <div className="feedback error">{feedback.msg}</div>}

          <button className="start-btn" onClick={startTraining} disabled={!selectedApertura}>
            🚀 Comenzar
          </button>
          <button className="random-btn" onClick={startRandom}>
            🎲 Apertura Aleatoria
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER DONE ──
  if (phase === PHASES.DONE) {
    const total = stats.correct + stats.errors;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 100;
    return (
      <div className="apertura-training">
        <div className="done-screen">
          <div className="done-icon">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <h2>¡Apertura completada!</h2>
          <h3>{aperturaInfo?.apertura}{aperturaInfo?.variante ? ` — ${aperturaInfo.variante}` : ''}</h3>
          <div className="done-stats">
            <div className="done-stat"><span>{stats.correct}</span><label>Correctos</label></div>
            <div className="done-stat"><span>{stats.errors}</span><label>Errores</label></div>
            <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
          </div>
          <p className="done-msg">
            {pct === 100 ? '¡Perfecto! Dominas esta apertura.' :
             pct >= 80 ? 'Muy bien. Practica un poco más para memorizarla.' :
             'Sigue practicando, la repetición es clave en aperturas.'}
          </p>
          <div className="done-actions">
            <button onClick={startTraining}>🔄 Repetir</button>
            <button onClick={reset}>📖 Otra apertura</button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER PLAYING ──
  const myTurn = isMyTurn(moveIndex, game) && !showingCorrect && moveIndex < theoryMoves.length;

  return (
    <div className="apertura-training">
      {!hideBack && <button className="back-btn" onClick={onBack}>← Volver</button>}
      {subTabsBar}

      <div className="training-header">
        <h2>{aperturaInfo?.apertura}{aperturaInfo?.variante ? ` — ${aperturaInfo.variante}` : ''}</h2>
        <span className="color-badge">{color === 'white' ? '♔ Blancas' : '♚ Negras'}</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span>{moveIndex}/{theoryMoves.length} movimientos</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={color}
            boardWidth={480}
            arePiecesDraggable={myTurn}
            {...boardProps}
          />
        </div>

        <div className="training-sidebar">
          <div className={`feedback-box ${feedback?.type || ''}`}>
            {feedback ? feedback.msg : myTurn ? '🎯 Tu turno — ¿cuál es el movimiento teórico?' : '⏳ Movimiento del oponente...'}
          </div>

          <div className="theory-moves">
            <div className="theory-moves-header">
              <h3>Teoría</h3>
              <button className="toggle-theory-btn" onClick={() => setShowTheory(v => !v)}>
                {showTheory ? '🙈 Ocultar' : '👁 Mostrar'}
              </button>
            </div>
            <div className="moves-list">
              {theoryMoves.map((mv, i) => {
                const isWhiteMove = i % 2 === 0;
                const moveNum = Math.floor(i / 2) + 1;
                const isPlayed = i < moveIndex;
                const isCurrent = i === moveIndex;
                const visible = isPlayed || showTheory;
                return (
                  <span
                    key={i}
                    className={`theory-move ${isPlayed ? 'played' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    {isWhiteMove && <span className="move-num">{moveNum}.</span>}
                    {visible ? mv : '??'}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="training-stats">
            <span className="stat-ok">✅ {stats.correct}</span>
            <span className="stat-err">❌ {stats.errors}</span>
          </div>

          <button className="abandon-btn" onClick={reset}>Abandonar</button>
        </div>
      </div>
    </div>
  );
}
