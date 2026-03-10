import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { useBoardTheme } from '../context/BoardThemeContext';

/**
 * Gestiona click-to-move y pre-moves.
 * @param {Chess} game
 * @param {string} playerColor - 'white' | 'black'
 * @param {boolean} canMove - jugador puede mover ahora
 * @param {function} onMove - (from, to) => Promise<boolean>
 */
export function useChessInput(game, playerColor, canMove, onMove) {
  const { showLegalMoves } = useBoardTheme();
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});
  const [premove, setPremove] = useState(null);
  const [premoveSquares, setPremoveSquares] = useState({});

  const isMyTurn = playerColor === 'white' ? game.turn() === 'w' : game.turn() === 'b';

  const getLegalMoves = useCallback((square) => {
    if (!showLegalMoves) return {};
    const moves = game.moves({ square, verbose: true });
    const squares = {};
    for (const m of moves) {
      squares[m.to] = {
        background: game.get(m.to)
          ? 'radial-gradient(circle, rgba(255,0,0,0.4) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(212,175,55,0.5) 30%, transparent 30%)',
        borderRadius: '50%',
      };
    }
    return squares;
  }, [game]);

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setOptionSquares({});
  }, []);

  const clearPremove = useCallback(() => {
    setPremove(null);
    setPremoveSquares({});
  }, []);

  // Llamar tras ejecutar el movimiento del oponente para disparar el pre-move
  const tryExecutePremove = useCallback(async (newGame) => {
    if (!premove) return;
    const { from, to } = premove;
    clearPremove();
    const test = new Chess(newGame.fen());
    if (test.move({ from, to, promotion: 'q' })) {
      await onMove(from, to);
    }
  }, [premove, onMove, clearPremove]);

  const onSquareClick = useCallback(async (square) => {
    const piece = game.get(square);
    const isMyPiece = piece && (playerColor === 'white' ? piece.color === 'w' : piece.color === 'b');

    if (!isMyTurn) {
      // Gestionar pre-move
      if (!selectedSquare) {
        if (isMyPiece) {
          setSelectedSquare(square);
          setPremoveSquares({ [square]: { background: 'rgba(255,165,0,0.5)' } });
        }
        return;
      }
      if (square === selectedSquare) { clearSelection(); clearPremove(); return; }
      if (isMyPiece) {
        setSelectedSquare(square);
        setPremoveSquares({ [square]: { background: 'rgba(255,165,0,0.5)' } });
        return;
      }
      setPremove({ from: selectedSquare, to: square });
      setPremoveSquares({
        [selectedSquare]: { background: 'rgba(255,165,0,0.4)' },
        [square]:         { background: 'rgba(255,165,0,0.4)' },
      });
      clearSelection();
      return;
    }

    if (!canMove) return;

    if (!selectedSquare) {
      if (!isMyPiece) return;
      setSelectedSquare(square);
      setOptionSquares(getLegalMoves(square));
      return;
    }
    if (square === selectedSquare) { clearSelection(); return; }
    if (isMyPiece) {
      setSelectedSquare(square);
      setOptionSquares(getLegalMoves(square));
      return;
    }
    clearSelection();
    await onMove(selectedSquare, square);
  }, [game, playerColor, isMyTurn, canMove, selectedSquare, getLegalMoves, onMove, clearSelection, clearPremove]);

  const onPieceDrop = useCallback(async (from, to) => {
    if (!isMyTurn || !canMove) return false;
    clearSelection();
    return onMove(from, to);
  }, [isMyTurn, canMove, clearSelection, onMove]);

  const customSquareStyles = {
    ...(selectedSquare && isMyTurn ? { [selectedSquare]: { background: 'rgba(212,175,55,0.6)' } } : {}),
    ...optionSquares,
    ...premoveSquares,
  };

  return { onSquareClick, onPieceDrop, customSquareStyles, premove, tryExecutePremove, clearPremove };
}
