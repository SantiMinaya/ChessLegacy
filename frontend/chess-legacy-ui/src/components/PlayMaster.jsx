import { useState, useCallback, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { masterStyles } from '../data/masterStyles';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AnalisisPartida from './AnalisisPartida';
import './PlayMaster.css';

function getComentario(evalCentipawns, isCheck, isCapture, moveCount) {
  if (isCheck) return '⚠️ ¡Jaque! El rey está en peligro.';
  const e = evalCentipawns / 100;
  if (moveCount <= 6) return '📖 Fase de apertura — desarrolla tus piezas y controla el centro.';
  if (moveCount <= 20) {
    if (Math.abs(e) < 0.3) return '⚖️ Posición equilibrada. Ambos bandos tienen chances.';
    if (e > 1.5) return '✅ Blancas tienen ventaja clara. Busca un plan concreto.';
    if (e < -1.5) return '⚠️ Negras tienen ventaja. Defiende con precisión.';
    if (e > 0.5) return '🔼 Blancas tienen ligera ventaja posicional.';
    if (e < -0.5) return '🔽 Negras tienen ligera ventaja posicional.';
    return '⚖️ Posición equilibrada con juego dinámico.';
  }
  if (Math.abs(e) > 3) return e > 0 ? '🏆 Ventaja decisiva para blancas.' : '🏆 Ventaja decisiva para negras.';
  if (isCapture) return '⚔️ Intercambio de material. Evalúa si la estructura mejora.';
  if (Math.abs(e) < 0.2) return '🤝 Posición muy equilibrada. Cada movimiento cuenta.';
  return e > 0 ? '📈 Blancas mantienen la iniciativa.' : '📉 Negras presionan.';
}

export default function PlayMaster({ master, onBack }) {
  const { boardProps } = useBoardTheme();
  const { user } = useAuth();
  const { playSound } = useToast();
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('Tu turno - Mueves las blancas');
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [score, setScore] = useState({ precision: 0, style: 0, total: 0 });
  const savedRef = useRef(false);
  const [showAnalisis, setShowAnalisis] = useState(false);
  const [blindfold, setBlindfold] = useState(false);
  const [finishedMoves, setFinishedMoves] = useState([]);
  const [comentario, setComentario] = useState('📖 Fase de apertura — desarrolla tus piezas y controla el centro.');
  const [dificultad, setDificultad] = useState('normal'); // facil | normal | dificil

  const executeMove = useCallback(async (from, to) => {
    if (thinking) return false;
    return makeMove(from, to);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thinking, game]);

  const { onSquareClick, onPieceDrop, customSquareStyles, tryExecutePremove } = useChessInput(
    game, 'white', !thinking && !game.isGameOver(), executeMove
  );

  const makeMove = async (sourceSquare, targetSquare) => {
    if (thinking) return false;
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move === null) return false;
    const newHistory = [...moveHistory, move];
    setGame(gameCopy);
    setMoveHistory(newHistory);
    if (gameCopy.isGameOver()) { updateStatus(gameCopy, newHistory); return true; }
    setThinking(true);
    setTimeout(() => makeMasterMove(gameCopy, newHistory), 500);
    return true;
  };

  const makeMasterMove = async (currentGame, currentHistory) => {
    setStatus(`🤔 ${master.name} pensando...`);

    try {
      const response = await fetch('http://localhost:5000/api/analisis/evaluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentGame.fen(), maestro: master.name.split(' ').pop(), profundidad: dificultad === 'facil' ? 3 : dificultad === 'normal' ? 8 : 15 })
      });

      const data = await response.json();
      const move = currentGame.move({
        from: data.mejorMovimiento.slice(0, 2),
        to: data.mejorMovimiento.slice(2, 4),
        promotion: data.mejorMovimiento[4] || 'q'
      });

      if (move) {
        const newHistory = [...currentHistory, move];
        const newGame = new Chess(currentGame.fen());
        setGame(newGame);
        setMoveHistory(newHistory);
        setEvaluation(data.evaluacion);
        setThinking(false);
        playSound(move.flags.includes('c') ? 'capture' : newGame.isCheck() ? 'check' : 'move');
        setComentario(getComentario(data.evaluacion, newGame.isCheck(), move.flags.includes('c'), newHistory.length));
        updateStatus(newGame, newHistory);
        await tryExecutePremove(newGame);
      } else {
        setThinking(false);
      }
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      setThinking(false);
    }
  };

  const selectMoveByStyle = (moves, masterId, baseEval) => {
    const style = masterStyles[masterId];
    if (!style || moves.length === 0) return moves[0];

    // Evaluar cada movimiento según el estilo
    const scoredMoves = moves.map(move => {
      let score = 0;

      // Bonificaciones según estilo
      if (move.flags.includes('c')) score += style.preferences.attackWeight * 50; // Captura
      if (move.flags.includes('e')) score += style.preferences.attackWeight * 40; // En passant
      if (move.san.includes('+')) score += style.preferences.attackWeight * 80; // Jaque
      if (move.san.includes('#')) score += 1000; // Jaque mate
      
      // Desarrollo de piezas
      if (move.piece !== 'p' && move.from[1] === '1') {
        score += style.preferences.developmentWeight * 30;
      }

      // Control del centro
      if (['e4', 'e5', 'd4', 'd5'].includes(move.to)) {
        score += style.preferences.centerControlWeight * 40;
      }

      // Sacrificios (capturas donde perdemos material)
      const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
      if (move.flags.includes('c') && move.captured) {
        const captureValue = pieceValues[move.captured];
        const pieceValue = pieceValues[move.piece];
        if (captureValue < pieceValue) {
          score += style.preferences.sacrificeBonus * 60;
        }
      }

      // Añadir aleatoriedad según precisión del maestro
      const randomness = (1 - (style.preferences.accuracy || 0.8)) * 100;
      score += Math.random() * randomness;

      return { move, score };
    });

    // Ordenar y seleccionar
    scoredMoves.sort((a, b) => b.score - a.score);
    
    // Los maestros más tácticos consideran más opciones
    const topN = Math.ceil(moves.length * (1 - style.preferences.positionalWeight) * 0.3) || 1;
    const topMoves = scoredMoves.slice(0, Math.max(1, topN));
    
    return topMoves[Math.floor(Math.random() * topMoves.length)].move;
  };

  const buildPgn = (moves, masterName) => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const header = `[Event "Chess Legacy"]
[Date "${date}"]
[White "Tú"]
[Black "${masterName}"]

`;
    const pairs = [];
    for (let i = 0; i < moves.length; i += 2) {
      const num = Math.floor(i / 2) + 1;
      pairs.push(`${num}. ${moves[i].san}${moves[i + 1] ? ' ' + moves[i + 1].san : ''}`);
    }
    return header + pairs.join(' ');
  };

  const exportPgn = (moves) => {
    const pgn = buildPgn(moves, master.name);
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vs_${master.name.replace(' ', '_')}_${new Date().toISOString().slice(0,10)}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = (currentGame, moves) => {
    if (currentGame.isCheckmate()) {
      const userWon = currentGame.turn() === 'b';
      setStatus(userWon ? '🎉 ¡Ganaste!' : `🎉 ¡${master.name} gana por jaque mate!`);
      if (user?.token && !savedRef.current) {
        savedRef.current = true;
        const finalMoves = moves;
        setFinishedMoves(finalMoves);
        progresoAPI.guardarPartida(user.token, {
          maestro: master.name,
          resultado: userWon ? 'win' : 'loss',
          pgn: buildPgn(moves, master.name),
          totalMovimientos: moves.length,
        }).catch(() => {});
      }
    } else if (currentGame.isDraw()) {
      setStatus('🤝 Empate');
      if (user?.token && !savedRef.current) {
        savedRef.current = true;
        setFinishedMoves(moves);
        progresoAPI.guardarPartida(user.token, {
          maestro: master.name,
          resultado: 'draw',
          pgn: buildPgn(moves, master.name),
          totalMovimientos: moves.length,
        }).catch(() => {});
      }
    } else if (currentGame.isCheck()) {
      setStatus(currentGame.turn() === 'w' ? '⚠️ ¡Jaque! - Tu turno' : `⚠️ ¡Jaque a ${master.name}!`);
    } else {
      setStatus(currentGame.turn() === 'w' ? '♟️ Tu turno' : `⏳ Turno de ${master.name}...`);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setEvaluation(0);
    setStatus('Tu turno - Mueves las blancas');
    setScore({ precision: 0, style: 0, total: 0 });
    setThinking(false);
    savedRef.current = false;
    setFinishedMoves([]);
    setShowAnalisis(false);
  };

  const styleInfo = masterStyles[master.id];

  return (
    <>
    <div className="play-master">
      <button className="back-btn" onClick={onBack}>← Volver</button>
      
      <div className="play-header">
        <img src={master.photo} alt={master.name} />
        <div>
          <h1>Jugando contra {master.name}</h1>
          <p>{styleInfo?.description || master.style}</p>
        </div>
      </div>

      <div className="play-container">
        <div className="eval-bar-vertical">
          <div 
            className="eval-fill-vertical" 
            style={{ 
              height: `${Math.min(100, Math.max(0, 50 + evaluation / 20))}%`,
              background: '#000'
            }} 
          />
          <div className="eval-text">{(evaluation / 100).toFixed(1)}</div>
        </div>

        <div className="board-section">
          <div className="opponent-name">{master.name}</div>
          <div style={{ position: 'relative' }}>
            <Chessboard
              position={game.fen()}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={customSquareStyles}
              boardWidth={500}
              arePiecesDraggable={!thinking && !game.isGameOver()}
              {...boardProps}
            />
            {blindfold && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(20,20,40,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 4, cursor: 'pointer', fontSize: 14, color: '#d4af37',
                flexDirection: 'column', gap: 8,
              }} onClick={() => {}}>
                <span style={{ fontSize: 40 }}>🙈</span>
                <span>Modo Blindfold</span>
                <span style={{ fontSize: 12, color: '#888' }}>Escribe el movimiento abajo</span>
              </div>
            )}
          </div>
          <div className="player-name">Tú</div>
          {blindfold && (
            <BlindfoldInput game={game} onMove={(from, to) => makeMove(from, to)} disabled={thinking || game.isGameOver()} />
          )}
          <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
              {[['facil','🐣 Fácil'],['normal','⚔️ Normal'],['dificil','👿 Difícil']].map(([v,l]) => (
                <button key={v} onClick={() => setDificultad(v)} style={{
                  flex: 1, padding: '6px', borderRadius: 6, fontSize: 12, fontWeight: dificultad === v ? 'bold' : 'normal',
                  background: dificultad === v ? 'var(--accent)' : 'transparent',
                  border: '1px solid var(--accent)', color: dificultad === v ? 'var(--accent-text)' : 'var(--accent)',
                  cursor: 'pointer',
                }}>{l}</button>
              ))}
            </div>
              <button onClick={resetGame} style={{ flex: 1 }}>🔄 Nueva</button>
              <button
                onClick={() => setBlindfold(b => !b)}
                style={{ flex: 1, background: blindfold ? 'rgba(212,175,55,0.3)' : undefined }}
              >
                {blindfold ? '👁 Ver tablero' : '🙈 Blindfold'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {moveHistory.length > 0 && (
                <button onClick={() => exportPgn(moveHistory)} style={{ flex: 1 }}>📥 PGN</button>
              )}
              {(finishedMoves.length > 0 || game.isGameOver()) && moveHistory.length > 0 && (
                <button onClick={() => setShowAnalisis(true)} style={{ flex: 1, background: 'rgba(76,175,80,0.2)', borderColor: '#4caf50', color: '#4caf50' }}>🔍 Analizar</button>
              )}
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="status-box">{status}</div>
          
          <div className="style-info-box">
            <h3>Estilo de {master.name}</h3>
            <div className="style-bars">
              <div className="style-bar">
                <span>Ataque</span>
                <div className="bar">
                  <div className="fill" style={{ width: `${styleInfo?.preferences.attackWeight * 100}%` }} />
                </div>
              </div>
              <div className="style-bar">
                <span>Táctica</span>
                <div className="bar">
                  <div className="fill" style={{ width: `${styleInfo?.preferences.tacticalComplexity * 100}%` }} />
                </div>
              </div>
              <div className="style-bar">
                <span>Posicional</span>
                <div className="bar">
                  <div className="fill" style={{ width: `${styleInfo?.preferences.positionalWeight * 100}%` }} />
                </div>
              </div>
              <div className="style-bar">
                <span>Sacrificios</span>
                <div className="bar">
                  <div className="fill" style={{ width: `${styleInfo?.preferences.sacrificeBonus * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="eval-box">
            <h3>Evaluación Detallada</h3>
            <div className="eval-value">{(evaluation / 100).toFixed(2)}</div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#c0c0c0', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
              {comentario}
            </div>
          </div>

          <div className="history-box">
            <h3>Movimientos ({moveHistory.length})</h3>
            <div className="moves">
              {moveHistory.map((move, i) => (
                <span key={i} className={i % 2 === 0 ? 'white-move' : 'black-move'}>
                  {i % 2 === 0 ? `${Math.ceil((i + 1) / 2)}. ` : ''}
                  {move.san}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {showAnalisis && (
      <AnalisisPartida
        moves={finishedMoves.length > 0 ? finishedMoves : moveHistory}
        masterName={master.name}
        onClose={() => setShowAnalisis(false)}
      />
    )}
    </>
  );
}

function BlindfoldInput({ game, onMove, disabled }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    const g = new Chess(game.fen());
    const move = g.move(input.trim());
    if (!move) { setError(true); setTimeout(() => setError(false), 800); return; }
    onMove(move.from, move.to);
    setInput('');
    setError(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 8, width: 500 }}>
      <input
        value={input}
        onChange={e => { setInput(e.target.value); setError(false); }}
        placeholder="Ej: e4, Nf3, O-O..."
        disabled={disabled}
        autoFocus
        style={{
          flex: 1, padding: '10px 14px', borderRadius: 8, fontSize: 16,
          background: error ? 'rgba(244,67,54,0.15)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${error ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
          color: '#e0e0e0', outline: 'none',
        }}
      />
      <button type="submit" disabled={disabled} style={{
        padding: '10px 18px', borderRadius: 8, background: '#d4af37',
        border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: 15,
      }}>▶</button>
    </form>
  );
}
