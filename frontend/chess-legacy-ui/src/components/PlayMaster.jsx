import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { masterStyles } from '../data/masterStyles';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';
import './PlayMaster.css';

export default function PlayMaster({ master, onBack }) {
  const { boardProps } = useBoardTheme();
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('Tu turno - Mueves las blancas');
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);

  const makeMove = useCallback(async (sourceSquare, targetSquare) => {
    if (thinking) return false;
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (!move) return false;
    setGame(gameCopy);
    setMoveHistory(prev => [...prev, move]);
    if (gameCopy.isGameOver()) { updateStatus(gameCopy); return true; }
    setThinking(true);
    setTimeout(() => makeMasterMove(gameCopy), 500);
    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thinking, game]);

  const { onSquareClick, onPieceDrop, customSquareStyles, tryExecutePremove } = useChessInput(
    game, 'white', !thinking && !game.isGameOver(), makeMove
  );

  const makeMasterMove = async (currentGame) => {
    setStatus(`🤔 ${master.name} pensando...`);
    try {
      const res = await fetch('http://localhost:5000/api/analisis/evaluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentGame.fen() }),
      });
      const data = await res.json();
      const move = currentGame.move({
        from: data.mejorMovimiento.slice(0, 2),
        to: data.mejorMovimiento.slice(2, 4),
        promotion: data.mejorMovimiento[4] || 'q',
      });
      if (move) {
        const newGame = new Chess(currentGame.fen());
        setGame(newGame);
        setMoveHistory(prev => [...prev, move]);
        setEvaluation(data.evaluacion);
        setThinking(false);
        updateStatus(newGame);
        await tryExecutePremove(newGame);
      } else {
        setThinking(false);
      }
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      setThinking(false);
    }
  };

  const updateStatus = (g) => {
    if (g.isCheckmate())
      setStatus(g.turn() === 'w' ? `🎉 ¡${master.name} gana por jaque mate!` : '🎉 ¡Ganaste!');
    else if (g.isDraw())
      setStatus('🤝 Empate');
    else if (g.isCheck())
      setStatus(g.turn() === 'w' ? '⚠️ ¡Jaque! - Tu turno' : `⚠️ ¡Jaque a ${master.name}!`);
    else
      setStatus(g.turn() === 'w' ? '♟️ Tu turno' : `⏳ Turno de ${master.name}...`);
  };

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setEvaluation(0);
    setStatus('Tu turno - Mueves las blancas');
    setThinking(false);
  };

  const styleInfo = masterStyles[master.id];

  return (
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
              height: `${Math.min(100, Math.max(0, 50 - evaluation / 20))}%`,
              background: '#000',
            }}
          />
          <div className="eval-text">{(evaluation / 100).toFixed(1)}</div>
        </div>

        <div className="board-section">
          <div className="opponent-name">{master.name}</div>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardWidth={500}
            arePiecesDraggable={!thinking && !game.isGameOver()}
            {...boardProps}
          />
          <div className="player-name">Tú</div>
          <div className="controls">
            <button onClick={resetGame}>🔄 Nueva Partida</button>
          </div>
        </div>

        <div className="info-section">
          <div className="status-box">{status}</div>

          <div className="style-info-box">
            <h3>Estilo de {master.name}</h3>
            <div className="style-bars">
              {[
                ['Ataque',      styleInfo?.preferences.attackWeight],
                ['Táctica',     styleInfo?.preferences.tacticalComplexity],
                ['Posicional',  styleInfo?.preferences.positionalWeight],
                ['Sacrificios', styleInfo?.preferences.sacrificeBonus],
              ].map(([label, val]) => (
                <div key={label} className="style-bar">
                  <span>{label}</span>
                  <div className="bar"><div className="fill" style={{ width: `${(val ?? 0) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="eval-box">
            <h3>Evaluación</h3>
            <div className="eval-value">{(evaluation / 100).toFixed(2)}</div>
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
  );
}
