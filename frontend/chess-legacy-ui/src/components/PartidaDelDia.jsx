import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { partidasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';
import './PartidaDelDia.css';

export default function PartidaDelDia({ onVerPartida }) {
  const { boardProps } = useBoardTheme();
  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fen, setFen] = useState('start');
  const [moveIdx, setMoveIdx] = useState(0);
  const [fens, setFens] = useState(['start']);

  useEffect(() => {
    partidasAPI.getDelDia()
      .then(r => { setPartida(r.data); buildFens(r.data.pgn); })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, []);

  const buildFens = (pgn) => {
    try {
      const g = new Chess();
      const positions = ['start'];
      // Limpiar cabeceras PGN
      const moves = pgn.replace(/\[.*?\]\s*/gs, '').trim();
      const tokens = moves.split(/\s+/).filter(t => t && !/^\d+\./.test(t) && !['1-0','0-1','1/2-1/2','*'].includes(t));
      for (const t of tokens) {
        const m = g.move(t);
        if (!m) break;
        positions.push(g.fen());
      }
      setFens(positions);
      // Mostrar posición tras 10 movimientos
      const mid = Math.min(10, positions.length - 1);
      setMoveIdx(mid);
      setFen(positions[mid]);
    } catch { setFen('start'); }
  };

  const navigate = (idx) => {
    const i = Math.max(0, Math.min(fens.length - 1, idx));
    setMoveIdx(i);
    setFen(fens[i] === 'start' ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : fens[i]);
  };

  if (loading) return <div className="pdd-loading">⏳ Cargando partida del día...</div>;
  if (!partida) return null;

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="pdd-card">
      <div className="pdd-header">
        <div>
          <span className="pdd-badge">📅 Partida del Día</span>
          <p className="pdd-fecha">{today}</p>
        </div>
        <div className="pdd-info">
          <span className="pdd-titulo">{partida.nombreApertura || 'Partida histórica'}</span>
          <span className="pdd-meta">vs {partida.oponente} · {partida.anio} · {partida.evento}</span>
        </div>
      </div>
      <div className="pdd-body">
        <div className="pdd-board">
          <Chessboard
            position={fen}
            arePiecesDraggable={false}
            boardWidth={280}
            {...boardProps}
          />
          <div className="pdd-nav">
            <button onClick={() => navigate(0)}>⏮</button>
            <button onClick={() => navigate(moveIdx - 1)}>◀</button>
            <span>{moveIdx}/{fens.length - 1}</span>
            <button onClick={() => navigate(moveIdx + 1)}>▶</button>
            <button onClick={() => navigate(fens.length - 1)}>⏭</button>
          </div>
        </div>
        <div className="pdd-actions">
          <p style={{ color: '#888', fontSize: 13, margin: '0 0 12px' }}>
            Resultado: <strong style={{ color: '#d4af37' }}>{partida.resultado}</strong>
          </p>
          <button className="pdd-btn" onClick={() => onVerPartida(partida.id)}>
            🔍 Ver partida completa
          </button>
        </div>
      </div>
    </div>
  );
}
