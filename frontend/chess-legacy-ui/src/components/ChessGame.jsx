import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ChessGame({ onBack }) {
  const [game, setGame] = useState(new Chess());

  async function makeMove(sourceSquare, targetSquare) {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({ 
        from: sourceSquare, 
        to: targetSquare, 
        promotion: 'q' 
      });
      
      if (move === null) return false;
      
      setGame(gameCopy);
      
      if (!gameCopy.isGameOver()) {
        setTimeout(() => makeEngineMove(gameCopy), 300);
      }
      
      return true;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  }

  async function makeEngineMove(currentGame) {
    try {
      const response = await axios.post(`${API_URL}/juego/mejor-movimiento`, {
        fen: currentGame.fen()
      });
      
      const { movimiento } = response.data;
      if (movimiento) {
        const gameCopy = new Chess(currentGame.fen());
        gameCopy.move({ from: movimiento.slice(0, 2), to: movimiento.slice(2, 4), promotion: 'q' });
        setGame(gameCopy);
      }
    } catch (error) {
      console.error('Engine error:', error);
    }
  }

  return (
    <div style={{ width: '600px', margin: '20px auto' }}>
      <button onClick={onBack} style={{marginBottom: '10px'}}>← Volver</button>
      <h1>♟️ Chess vs Stockfish (Backend)</h1>
      <Chessboard 
        position={game.fen()} 
        onPieceDrop={makeMove}
        boardOrientation="white"
      />
      <button onClick={() => setGame(new Chess())} style={{marginTop: '10px'}}>Nueva Partida</button>
    </div>
  );
}
