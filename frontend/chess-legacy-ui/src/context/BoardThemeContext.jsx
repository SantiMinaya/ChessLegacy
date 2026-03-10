import { createContext, useContext, useState } from 'react';
import { CUSTOM_PIECE_SETS } from '../data/pieceSets';

export const BOARD_THEMES = {
  classic:  { name: 'Clásico',  light: '#f0d9b5', dark: '#b58863' },
  green:    { name: 'Verde',    light: '#ffffdd', dark: '#86a666' },
  blue:     { name: 'Azul',     light: '#dee3e6', dark: '#8ca2ad' },
  purple:   { name: 'Púrpura',  light: '#f0e4ff', dark: '#9b72cf' },
  midnight: { name: 'Noche',    light: '#2b2b4b', dark: '#1a1a2e' },
  walnut:   { name: 'Nogal',    light: '#e8c99a', dark: '#7a4a2a' },
};

export const PIECE_SETS = {
  default: { name: 'Estándar' },
  neo:     { name: 'Neo' },
  flat:    { name: 'Flat' },
};

const BoardThemeContext = createContext(null);

export function BoardThemeProvider({ children }) {
  const [boardTheme, setBoardThemeState] = useState(
    () => localStorage.getItem('boardTheme') || 'classic'
  );
  const [pieceSet, setPieceSetState] = useState(
    () => localStorage.getItem('pieceSet') || 'default'
  );

  const setBoardTheme = (t) => { localStorage.setItem('boardTheme', t); setBoardThemeState(t); };
  const setPieceSet  = (s) => { localStorage.setItem('pieceSet', s);  setPieceSetState(s); };

  const boardProps = {
    customDarkSquareStyle:  { backgroundColor: BOARD_THEMES[boardTheme]?.dark  ?? '#b58863' },
    customLightSquareStyle: { backgroundColor: BOARD_THEMES[boardTheme]?.light ?? '#f0d9b5' },
    customPieces: CUSTOM_PIECE_SETS[pieceSet] ?? undefined,
  };

  return (
    <BoardThemeContext.Provider value={{ boardTheme, setBoardTheme, pieceSet, setPieceSet, boardProps }}>
      {children}
    </BoardThemeContext.Provider>
  );
}

export const useBoardTheme = () => useContext(BoardThemeContext);
