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
  const [score, setScore] = useState({ precision: 0, style: 0, total: 0 });

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
    setGame(gameCopy);
    setMoveHistory(prev => [...prev, move]);
    if (gameCopy.isGameOver()) { updateStatus(gameCopy); return true; }
    setThinking(true);
    setTimeout(() => makeMasterMove(gameCopy), 500);
    return true;
  };

  const makeMasterMove = async (currentGame) => {
    setStatus(`🤔 ${master.name} pensando...`);

    try {
      const response = await fetch('http://localhost:5000/api/analisis/evaluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentGame.fen(), maestro: master.name.split(' ').pop() })
      });

      const data = await response.json();
      
      // Usar directamente el mejor movimiento de Stockfish
      const move = currentGame.move({
        from: data.mejorMovimiento.slice(0, 2),
        to: data.mejorMovimiento.slice(2, 4),
        promotion: data.mejorMovimiento[4] || 'q'
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

  const updateStatus = (currentGame) => {
    if (currentGame.isCheckmate()) {
      setStatus(currentGame.turn() === 'w' ? `🎉 ¡${master.name} gana por jaque mate!` : '🎉 ¡Ganaste!');
    } else if (currentGame.isDraw()) {
      setStatus('🤝 Empate');
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
              background: '#000'
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
