import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useBoardTheme } from '../context/BoardThemeContext';
import './AnalisisPartida.css';

const API = 'http://localhost:5000/api/analisis/evaluar';

function clasificar(diff) {
  if (diff <= 10)  return { label: 'Excelente', color: '#4caf50', emoji: '✨' };
  if (diff <= 30)  return { label: 'Bueno',     color: '#8bc34a', emoji: '✅' };
  if (diff <= 80)  return { label: 'Imprecisión', color: '#ff9800', emoji: '⚠️' };
  if (diff <= 200) return { label: 'Error',     color: '#f44336', emoji: '❌' };
  return             { label: 'Blunder',        color: '#9c27b0', emoji: '??' };
}

async function evaluarFen(fen) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fen }),
  });
  const d = await r.json();
  return { eval: d.evaluacion, best: d.mejorMovimiento };
}

export default function AnalisisPartida({ moves, masterName, onClose }) {
  const { boardProps } = useBoardTheme();
  const [analizando, setAnalizando] = useState(true);
  const [progreso, setProgreso] = useState(0);
  const [resultados, setResultados] = useState([]); // por movimiento
  const [cursor, setCursor] = useState(0);
  const [positions, setPositions] = useState([]); // FENs de cada posición

  // Construir lista de FENs
  useEffect(() => {
    const g = new Chess();
    const fens = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'];
    for (const m of moves) { g.move(m.san); fens.push(g.fen()); }
    setPositions(fens);
  }, [moves]);

  // Analizar todos los movimientos
  useEffect(() => {
    if (positions.length < 2) return;
    let cancelled = false;

    async function analizar() {
      const res = [];
      // Evaluamos la posición ANTES y DESPUÉS de cada movimiento del usuario (blancas = índices pares)
      for (let i = 0; i < moves.length; i++) {
        if (cancelled) return;
        setProgreso(Math.round((i / moves.length) * 100));
        try {
          const [antes, despues] = await Promise.all([
            evaluarFen(positions[i]),
            evaluarFen(positions[i + 1]),
          ]);
          // Para blancas: eval sube = bueno. Para negras: eval baja = bueno
          const isWhite = i % 2 === 0;
          const evalAntes = isWhite ? antes.eval : -antes.eval;
          const evalDespues = isWhite ? despues.eval : -despues.eval;
          const diff = Math.max(0, evalAntes - evalDespues); // pérdida de ventaja
          res.push({
            move: moves[i],
            evalAntes: antes.eval,
            evalDespues: despues.eval,
            bestMove: antes.best,
            diff,
            clasificacion: clasificar(diff),
            isWhite,
          });
        } catch {
          res.push({ move: moves[i], evalAntes: 0, evalDespues: 0, diff: 0, clasificacion: clasificar(0), isWhite: i % 2 === 0 });
        }
      }
      if (!cancelled) { setResultados(res); setAnalizando(false); setProgreso(100); }
    }

    analizar();
    return () => { cancelled = true; };
  }, [positions]); // eslint-disable-line

  const resumen = resultados.reduce((acc, r) => {
    acc[r.clasificacion.label] = (acc[r.clasificacion.label] || 0) + 1;
    return acc;
  }, {});

  const misMovimientos = resultados.filter(r => r.isWhite);
  const precision = misMovimientos.length > 0
    ? Math.round(misMovimientos.filter(r => r.diff <= 30).length / misMovimientos.length * 100)
    : 0;

  return (
    <div className="analisis-overlay">
      <div className="analisis-panel">
        <div className="analisis-header">
          <h2>🔍 Análisis de Partida vs {masterName}</h2>
          <button className="analisis-close" onClick={onClose}>✕</button>
        </div>

        {analizando ? (
          <div className="analisis-loading">
            <div className="analisis-spinner" />
            <p>Analizando con Stockfish... {progreso}%</p>
            <div className="analisis-progress-bar">
              <div style={{ width: `${progreso}%` }} />
            </div>
            <p style={{ fontSize: 12, color: '#666' }}>Evaluando {moves.length} movimientos</p>
          </div>
        ) : (
          <div className="analisis-content">
            {/* Resumen */}
            <div className="analisis-resumen">
              <div className="analisis-precision">
                <span>{precision}%</span>
                <label>Precisión</label>
              </div>
              {[['Excelente','✨','#4caf50'],['Bueno','✅','#8bc34a'],['Imprecisión','⚠️','#ff9800'],['Error','❌','#f44336'],['Blunder','??','#9c27b0']].map(([label, emoji, color]) => (
                resumen[label] ? (
                  <div key={label} className="analisis-resumen-item" style={{ borderColor: color }}>
                    <span style={{ color }}>{emoji} {resumen[label]}</span>
                    <label>{label}</label>
                  </div>
                ) : null
              ))}
            </div>

            <div className="analisis-body">
              {/* Tablero */}
              <div className="analisis-board">
                <Chessboard
                  position={positions[cursor] || 'start'}
                  arePiecesDraggable={false}
                  boardWidth={380}
                  {...boardProps}
                />
                <div className="analisis-nav">
                  <button onClick={() => setCursor(0)} disabled={cursor === 0}>⏮</button>
                  <button onClick={() => setCursor(c => Math.max(0, c - 1))} disabled={cursor === 0}>◀</button>
                  <span>{cursor}/{moves.length}</span>
                  <button onClick={() => setCursor(c => Math.min(moves.length, c + 1))} disabled={cursor === moves.length}>▶</button>
                  <button onClick={() => setCursor(moves.length)} disabled={cursor === moves.length}>⏭</button>
                </div>
                {cursor > 0 && resultados[cursor - 1] && (
                  <div className="analisis-move-detail">
                    <span style={{ color: resultados[cursor-1].clasificacion.color, fontWeight: 'bold', fontSize: 16 }}>
                      {resultados[cursor-1].clasificacion.emoji} {resultados[cursor-1].move.san} — {resultados[cursor-1].clasificacion.label}
                    </span>
                    <span style={{ color: '#888', fontSize: 13 }}>
                      Eval: {(resultados[cursor-1].evalAntes/100).toFixed(2)} → {(resultados[cursor-1].evalDespues/100).toFixed(2)}
                    </span>
                    {resultados[cursor-1].diff > 30 && (
                      <span style={{ color: '#d4af37', fontSize: 13 }}>
                        💡 Mejor: {resultados[cursor-1].bestMove}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Lista de movimientos */}
              <div className="analisis-moves-list">
                {resultados.map((r, i) => (
                  <div
                    key={i}
                    className={`analisis-move-row ${cursor === i + 1 ? 'active' : ''}`}
                    onClick={() => setCursor(i + 1)}
                  >
                    {i % 2 === 0 && <span className="analisis-move-num">{Math.floor(i/2)+1}.</span>}
                    <span className="analisis-move-san" style={{ color: r.clasificacion.color }}>
                      {r.clasificacion.emoji} {r.move.san}
                    </span>
                    <span className="analisis-move-eval">
                      {(r.evalDespues / 100).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
