import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

export default function ModoEspejo() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [orientation, setOrientation] = useState('white');
  const [status, setStatus] = useState('♔ Turno de blancas');
  const [started, setStarted] = useState(false);
  const [resultado, setResultado] = useState(null);

  const onPieceDrop = useCallback((from, to) => {
    if (resultado) return false;
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;

    setGame(g);
    setMoveHistory(h => [...h, m]);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');

    if (g.isCheckmate()) {
      const ganador = g.turn() === 'w' ? 'Negras' : 'Blancas';
      setStatus(`🏆 ¡${ganador} ganan por jaque mate!`);
      setResultado(ganador);
      return true;
    }
    if (g.isDraw()) { setStatus('🤝 Tablas'); setResultado('tablas'); return true; }

    // Girar tablero automáticamente
    const nextTurn = g.turn();
    setOrientation(nextTurn === 'w' ? 'white' : 'black');
    setStatus(nextTurn === 'w' ? '♔ Turno de blancas' : '♚ Turno de negras');
    return true;
  }, [game, resultado, playSound]);

  const reset = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setOrientation('white');
    setStatus('♔ Turno de blancas');
    setResultado(null);
    setStarted(true);
  };

  if (!started) return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 56 }}>🪞</div>
      <h2 style={{ color: '#d4af37', margin: 0 }}>Modo Espejo</h2>
      <p style={{ color: '#c0c0c0', margin: 0, fontSize: 14 }}>
        Juega blancas y negras contra ti mismo. El tablero gira automáticamente en cada turno.
        Útil para entender ambos lados de una posición y practicar sin oponente.
      </p>
      <button onClick={reset} style={{ padding: '14px', background: 'linear-gradient(135deg,#d4af37,#f0c040)', border: 'none', borderRadius: 10, fontWeight: 'bold', fontSize: 16, cursor: 'pointer', color: '#1a1a2e' }}>
        🚀 Empezar
      </button>
    </div>
  );

  return (
    <div>
      <div className="training-header">
        <h2 style={{ margin: 0 }}>🪞 Modo Espejo</h2>
        <span className="color-badge">{moveHistory.length} movimientos</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={orientation}
            boardWidth={480}
            arePiecesDraggable={!resultado}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <div className={`feedback-box ${resultado && resultado !== 'tablas' ? 'ok' : ''}`}>
            {status}
          </div>

          <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', maxHeight: 200, overflowY: 'auto' }}>
            <p style={{ color: '#888', fontSize: 12, margin: '0 0 6px' }}>Movimientos</p>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#c0c0c0', lineHeight: 1.8 }}>
              {moveHistory.map((m, i) => (
                <span key={i} style={{ color: i % 2 === 0 ? '#fff' : '#aaa', marginRight: 4 }}>
                  {i % 2 === 0 ? `${Math.floor(i/2)+1}. ` : ''}{m.san}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="abandon-btn" style={{ flex: 1 }} onClick={reset}>🔄 Nueva</button>
            <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setStarted(false)}>← Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
}
