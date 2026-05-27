import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useBoardTheme } from '../context/BoardThemeContext';

const parseMoves = (pgn) => pgn
  .replace(/\[.*?\]/g, '')          // quita cabeceras
  .replace(/\d+\./g, '')            // quita numeración
  .replace(/[{}[\]]/g, '')          // quita comentarios
  .replace(/1-0|0-1|1\/2-1\/2|\*/g, '') // quita resultado
  .trim().split(/\s+/).filter(m => m.length > 0);

export default function VisorPartidaFamosa({ game: gameData, onBack }) {
  const { boardProps } = useBoardTheme();
  const [moves, setMoves] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [position, setPosition] = useState('start');

  useEffect(() => {
    if (gameData?.pgn) {
      setMoves(parseMoves(gameData.pgn));
    }
    setCurrentMove(0);
    setPosition('start');
  }, [gameData]);

  const goToMove = useCallback((idx) => {
    const chess = new Chess();
    const movesToPlay = moves.slice(0, idx);
    for (const m of movesToPlay) {
      try { chess.move(m); } catch {}
    }
    setPosition(chess.fen());
    setCurrentMove(idx);
  }, [moves]);

  const anterior = () => goToMove(Math.max(0, currentMove - 1));
  const siguiente = () => goToMove(Math.min(moves.length, currentMove + 1));
  const inicio = () => goToMove(0);
  const final = () => goToMove(moves.length);

  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) {
        return;
      }
      if (e.key === 'ArrowLeft') { e.preventDefault(); anterior(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); siguiente(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentMove, moves]);

  if (!gameData) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
      padding: '40px 20px',
      fontFamily: 'var(--font-family)',
      color: 'var(--text-primary)',
    }}>
      <button
        className="back-btn"
        onClick={onBack}
        style={{
          background: 'var(--bg-card)', border: '2px solid var(--accent)',
          color: 'var(--accent)', padding: '12px 24px',
          borderRadius: 'var(--border-radius)', cursor: 'pointer',
          fontSize: 16, marginBottom: 24, transition: 'all var(--transition)',
        }}
      >← Volver</button>

      {/* Cabecera */}
      <div style={{
        maxWidth: 1100, margin: '0 auto 32px',
        background: 'var(--bg-card)', border: '2px solid var(--border)',
        borderRadius: 16, padding: 28,
        borderTop: `6px solid var(--accent)`,
      }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent)', margin: '0 0 10px', fontSize: 28 }}>
          ♟ {gameData.title}
        </h1>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-secondary)' }}>
          <span>👤 vs {gameData.opponent}</span>
          <span>📅 {gameData.year}</span>
          <span>🏆 {gameData.event}</span>
        </div>
        {gameData.why && (
          <p style={{ marginTop: 14, color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: 14 }}>
            {gameData.why}
          </p>
        )}
      </div>

      {/* Tablero + Lista movimientos */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '500px 1fr', gap: 24, alignItems: 'start',
      }}>
        {/* Tablero */}
        <div>
          <Chessboard
            position={position}
            boardWidth={500}
            animationDuration={150}
            arePiecesDraggable={false}
            {...boardProps}
          />

          {/* Controles */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[
              { label: '⏮', title: 'Inicio', action: inicio },
              { label: '◀', title: 'Anterior', action: anterior, disabled: currentMove === 0 },
              { label: '▶', title: 'Siguiente', action: siguiente, disabled: currentMove >= moves.length },
              { label: '⏭', title: 'Final', action: final },
            ].map(({ label, title, action, disabled }) => (
              <button
                key={label}
                onClick={action}
                disabled={disabled}
                title={title}
                style={{
                  flex: 1, padding: '10px 0',
                  background: disabled ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                  color: disabled ? 'var(--text-muted)' : 'var(--accent-text)',
                  border: 'none', borderRadius: 8,
                  cursor: disabled ? 'default' : 'pointer',
                  fontSize: 18, fontWeight: 'bold',
                  transition: 'opacity 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            Movimiento {currentMove} / {moves.length} · ←→ para navegar
          </div>
        </div>

        {/* Lista de movimientos */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 20, maxHeight: 560, overflowY: 'auto',
        }}>
          <h3 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', margin: '0 0 16px' }}>
            📋 Movimientos
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '2px 8px' }}>
            {moves.reduce((rows, move, idx) => {
              if (idx % 2 === 0) {
                rows.push({ num: Math.floor(idx / 2) + 1, white: { san: move, idx: idx + 1 } });
              } else {
                rows[rows.length - 1].black = { san: move, idx: idx + 1 };
              }
              return rows;
            }, []).map((row) => (
              <div key={row.num} style={{ display: 'contents' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13, alignSelf: 'center', padding: '3px 0' }}>
                  {row.num}.
                </span>
                {[row.white, row.black].map((m, i) => m ? (
                  <span
                    key={i}
                    onClick={() => goToMove(m.idx)}
                    style={{
                      padding: '4px 8px', borderRadius: 5, cursor: 'pointer',
                      fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold',
                      background: currentMove === m.idx ? 'rgba(212,175,55,0.25)' : 'transparent',
                      color: currentMove === m.idx ? 'var(--accent)' : 'var(--text-secondary)',
                      border: currentMove === m.idx ? '1px solid rgba(212,175,55,0.4)' : '1px solid transparent',
                      transition: 'all 0.1s',
                    }}
                  >
                    {m.san}
                  </span>
                ) : <span key={i} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
