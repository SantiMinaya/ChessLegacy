import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { analisisAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function AnalisisLibre() {
  const { boardProps } = useBoardTheme();
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [positions, setPositions] = useState([INITIAL_FEN]);
  const [evalData, setEvalData] = useState(null);
  const [evaluando, setEvaluando] = useState(false);
  const [fenInput, setFenInput] = useState('');
  const [fenError, setFenError] = useState('');
  const [orientation, setOrientation] = useState('white');

  const evaluar = useCallback(async (fen) => {
    setEvaluando(true);
    try {
      const r = await analisisAPI.evaluar(fen);
      setEvalData(r.data);
    } catch { setEvalData(null); }
    finally { setEvaluando(false); }
  }, []);

  const onPieceDrop = (from, to) => {
    const g = new Chess(positions[cursor]);
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;
    // Truncar historial si estamos en medio
    const newPositions = [...positions.slice(0, cursor + 1), g.fen()];
    const newHistory = [...history.slice(0, cursor), move];
    setPositions(newPositions);
    setHistory(newHistory);
    setCursor(newPositions.length - 1);
    setGame(g);
    evaluar(g.fen());
    return true;
  };

  const navigate = (idx) => {
    const i = Math.max(0, Math.min(positions.length - 1, idx));
    setCursor(i);
    setGame(new Chess(positions[i]));
    evaluar(positions[i]);
  };

  const loadFen = () => {
    try {
      const g = new Chess(fenInput.trim());
      const fen = g.fen();
      setPositions([fen]);
      setHistory([]);
      setCursor(0);
      setGame(g);
      setFenError('');
      setFenInput('');
      evaluar(fen);
    } catch { setFenError('FEN inválido'); }
  };

  const reset = () => {
    setGame(new Chess());
    setPositions([INITIAL_FEN]);
    setHistory([]);
    setCursor(0);
    setEvalData(null);
    setFenInput('');
    setFenError('');
  };

  const evalNum = evalData ? (evalData.evaluacion / 100).toFixed(2) : '—';
  const evalColor = evalData ? (evalData.evaluacion > 0 ? '#e0e0e0' : evalData.evaluacion < 0 ? '#888' : '#d4af37') : '#888';
  const barHeight = evalData ? Math.min(100, Math.max(0, 50 + evalData.evaluacion / 20)) : 50;

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* Barra eval */}
      <div style={{ width: 24, height: 480, background: '#fff', borderRadius: 12, position: 'relative', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)', flexShrink: 0, marginTop: 0 }}>
        <div style={{ position: 'absolute', top: 0, width: '100%', height: `${100 - barHeight}%`, background: '#222', transition: 'height 0.3s' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', fontSize: 9, color: '#d4af37', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
          {evalNum}
        </div>
      </div>

      {/* Tablero */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Chessboard
          position={positions[cursor]}
          onPieceDrop={onPieceDrop}
          boardOrientation={orientation}
          boardWidth={480}
          arePiecesDraggable={true}
          {...boardProps}
        />
        {/* Navegación */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[['⏮', 0], ['◀', cursor - 1], ['▶', cursor + 1], ['⏭', positions.length - 1]].map(([label, idx]) => (
            <button key={label} onClick={() => navigate(idx)} style={navBtnStyle}>{label}</button>
          ))}
          <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} style={navBtnStyle}>🔄</button>
          <button onClick={reset} style={{ ...navBtnStyle, color: '#f44336', borderColor: 'rgba(244,67,54,0.3)' }}>✕ Reset</button>
        </div>
        {/* FEN input */}
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={fenInput}
            onChange={e => { setFenInput(e.target.value); setFenError(''); }}
            placeholder="Pegar FEN..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: `1px solid ${fenError ? '#f44336' : 'rgba(212,175,55,0.3)'}`, color: '#e0e0e0', fontSize: 13, outline: 'none' }}
            onKeyDown={e => e.key === 'Enter' && loadFen()}
          />
          <button onClick={loadFen} style={{ ...navBtnStyle, padding: '8px 14px' }}>Cargar</button>
        </div>
        {fenError && <p style={{ color: '#f44336', fontSize: 12, margin: 0 }}>{fenError}</p>}
      </div>

      {/* Panel lateral */}
      <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Evaluación */}
        <div style={panelStyle}>
          <h3 style={h3Style}>📊 Evaluación</h3>
          {evaluando ? (
            <p style={{ color: '#888', fontSize: 13 }}>Analizando...</p>
          ) : evalData ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: evalColor }}>{evalNum}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                Mejor: <span style={{ color: '#d4af37', fontFamily: 'monospace' }}>{evalData.mejorMovimiento}</span>
              </div>
            </>
          ) : (
            <p style={{ color: '#555', fontSize: 13 }}>Mueve una pieza para evaluar</p>
          )}
        </div>

        {/* FEN actual */}
        <div style={panelStyle}>
          <h3 style={h3Style}>🔗 FEN actual</h3>
          <p style={{ fontSize: 11, color: '#666', wordBreak: 'break-all', fontFamily: 'monospace', margin: 0 }}>
            {positions[cursor]}
          </p>
          <button
            onClick={() => navigator.clipboard?.writeText(positions[cursor])}
            style={{ ...navBtnStyle, marginTop: 8, fontSize: 12 }}
          >
            📋 Copiar FEN
          </button>
        </div>

        {/* Historial */}
        {history.length > 0 && (
          <div style={{ ...panelStyle, maxHeight: 200, overflowY: 'auto' }}>
            <h3 style={h3Style}>📝 Movimientos</h3>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#c0c0c0', lineHeight: 1.8 }}>
              {history.map((m, i) => (
                <span
                  key={i}
                  onClick={() => navigate(i + 1)}
                  style={{ cursor: 'pointer', color: cursor === i + 1 ? '#d4af37' : i % 2 === 0 ? '#fff' : '#aaa', marginRight: 4 }}
                >
                  {i % 2 === 0 ? `${Math.floor(i/2)+1}. ` : ''}{m.san}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#e0e0e0', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
};
const panelStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, padding: '14px 16px',
};
const h3Style = { color: '#d4af37', margin: '0 0 10px', fontSize: 14 };
