import { useState, useEffect } from 'react';
import './PlayMaster.css';

export default function PlayMaster({ master, onBack }) {
  const [board, setBoard] = useState(null);
  const [game, setGame] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('Tu turno - Mueves las blancas');
  const [evaluation, setEvaluation] = useState(0);

  useEffect(() => {
    const Chess = window.Chess;
    const newGame = new Chess();
    setGame(newGame);

    const config = {
      draggable: true,
      position: 'start',
      onDragStart: (source, piece) => {
        if (newGame.game_over()) return false;
        if (piece.search(/^b/) !== -1) return false;
      },
      onDrop: async (source, target) => {
        const move = newGame.move({ from: source, to: target, promotion: 'q' });
        if (move === null) return 'snapback';

        setMoveHistory(prev => [...prev, move]);
        setGame(new Chess(newGame.fen()));
        
        if (newGame.game_over()) {
          updateStatus(newGame);
          return;
        }

        setTimeout(() => makeMasterMove(newGame), 250);
      },
      onSnapEnd: () => {
        if (board) board.position(newGame.fen());
      },
      pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    const newBoard = window.Chessboard('playBoard', config);
    setBoard(newBoard);

    return () => {
      if (newBoard) newBoard.destroy();
    };
  }, []);

  const makeMasterMove = async (currentGame) => {
    setStatus(`🤔 ${master.name} pensando...`);
    
    try {
      const response = await fetch('http://localhost:5000/api/juego/mejor-movimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentGame.fen() })
      });

      const data = await response.json();
      const move = currentGame.move(data.movimiento, { sloppy: true });
      
      if (move) {
        board.position(currentGame.fen());
        setMoveHistory(prev => [...prev, move]);
        setEvaluation(data.evaluacion);
        setGame(new Chess(currentGame.fen()));
      }
      
      updateStatus(currentGame);
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
    }
  };

  const updateStatus = (currentGame) => {
    if (currentGame.in_checkmate()) {
      setStatus(currentGame.turn() === 'w' ? `🎉 ¡${master.name} gana por jaque mate!` : '🎉 ¡Ganaste!');
    } else if (currentGame.in_draw()) {
      setStatus('🤝 Empate');
    } else if (currentGame.in_check()) {
      setStatus(currentGame.turn() === 'w' ? '⚠️ ¡Jaque! - Tu turno' : `⚠️ ¡Jaque a ${master.name}!`);
    } else {
      setStatus(currentGame.turn() === 'w' ? '♟️ Tu turno' : `⏳ Turno de ${master.name}...`);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    board.start();
    setMoveHistory([]);
    setEvaluation(0);
    setStatus('Tu turno - Mueves las blancas');
  };

  return (
    <div className="play-master">
      <button className="back-btn" onClick={onBack}>← Volver</button>
      
      <div className="play-header" style={{ borderTopColor: master.color }}>
        <img src={master.photo} alt={master.name} />
        <div>
          <h1>Jugando contra {master.name}</h1>
          <p>{master.style}</p>
        </div>
      </div>

      <div className="play-container">
        <div className="board-section">
          <div id="playBoard"></div>
          <div className="controls">
            <button onClick={resetGame}>🔄 Nueva Partida</button>
          </div>
        </div>

        <div className="info-section">
          <div className="status-box">{status}</div>
          <div className="eval-box">
            <h3>Evaluación</h3>
            <div className="eval-value">{(evaluation / 100).toFixed(2)}</div>
          </div>
          <div className="history-box">
            <h3>Movimientos</h3>
            <div className="moves">
              {moveHistory.map((move, i) => (
                <span key={i}>
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
