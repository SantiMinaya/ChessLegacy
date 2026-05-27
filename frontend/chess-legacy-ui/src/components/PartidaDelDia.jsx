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
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [moveIdx, setMoveIdx] = useState(0);
  const [fens, setFens] = useState([]);

  useEffect(() => {
    partidasAPI.getDelDia()
      .then(r => { setPartida(r.data); buildFens(r.data.pgn); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const buildFens = (pgn) => {
    try {
      const g = new Chess();
      g.loadPgn(pgn);
      const history = g.history({ verbose: true });
      const positions = [history[0]?.before || g.fen(), ...history.map(m => m.after)];
      setFens(positions);
      const mid = Math.min(10, positions.length - 1);
      setMoveIdx(mid);
      setFen(positions[mid]);
    } catch (e) {
      console.error("Error building FENs for daily game", e);
      setFens([]);
    }
  };

  const navigate = (idx) => {
    if (!fens.length) return;
    const i = Math.max(0, Math.min(fens.length - 1, idx));
    setMoveIdx(i);
    setFen(fens[i]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(moveIdx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(moveIdx - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveIdx, fens]);

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
          <div className="pdd-players">
            <span className="pdd-player white">⚪ {partida.colorJugador === 'Blancas' ? (partida.nombreJugador || 'Gran Maestro') : partida.oponente}</span>
            <span className="pdd-vs">vs</span>
            <span className="pdd-player black">⚫ {partida.colorJugador === 'Negras' ? (partida.nombreJugador || 'Gran Maestro') : partida.oponente}</span>
          </div>
          <span className="pdd-meta">{partida.anio} · {partida.evento}</span>
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
            <button onClick={() => navigate(0)} disabled={moveIdx === 0}>⏮</button>
            <button onClick={() => navigate(moveIdx - 1)} disabled={moveIdx === 0}>◀</button>
            <span>{moveIdx}/{Math.max(0, fens.length - 1)}</span>
            <button onClick={() => navigate(moveIdx + 1)} disabled={moveIdx >= fens.length - 1}>▶</button>
            <button onClick={() => navigate(fens.length - 1)} disabled={moveIdx >= fens.length - 1}>⏭</button>
          </div>
        </div>
        <div className="pdd-actions">
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 12px' }}>
            Resultado: <strong style={{ color: 'var(--accent)' }}>{partida.resultado}</strong>
          </p>
          <button className="pdd-btn" onClick={() => onVerPartida(partida.id)}>
            🔍 Ver partida completa
          </button>
        </div>
      </div>
    </div>
  );
}
