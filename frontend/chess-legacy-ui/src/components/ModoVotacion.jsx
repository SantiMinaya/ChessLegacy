import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useBoardTheme } from '../context/BoardThemeContext';
import { analisisAPI } from '../services/api';

const TOTAL_RONDAS = 8;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ModoVotacion() {
  const { boardProps } = useBoardTheme();
  const [game, setGame] = useState(new Chess());
  const [candidatos, setCandidatos] = useState([]); // [{san, from, to, eval}]
  const [mejor, setMejor] = useState(null);         // san del mejor movimiento
  const [votado, setVotado] = useState(null);        // san votado por el usuario
  const [loading, setLoading] = useState(false);
  const [ronda, setRonda] = useState(1);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [highlight, setHighlight] = useState({});

  const cargarCandidatos = useCallback(async (g) => {
    setLoading(true);
    setVotado(null);
    setMejor(null);
    setHighlight({});
    try {
      // Obtener el mejor movimiento de Stockfish
      const r = await analisisAPI.evaluar(g.fen());
      const bestUci = r.data.mejorMovimiento;
      const bestEval = r.data.evaluacion;

      // Generar todos los movimientos legales y elegir 2 candidatos adicionales
      const legales = g.moves({ verbose: true });
      if (legales.length === 0) { setLoading(false); return; }

      // El mejor movimiento
      const bestMove = legales.find(m => m.from + m.to === bestUci.slice(0, 4));
      if (!bestMove) { setLoading(false); return; }

      // 2 movimientos alternativos aleatorios (distintos del mejor)
      const otros = shuffle(legales.filter(m => m.san !== bestMove.san)).slice(0, 2);

      const lista = shuffle([
        { san: bestMove.san, from: bestMove.from, to: bestMove.to, esMejor: true },
        ...otros.map(m => ({ san: m.san, from: m.from, to: m.to, esMejor: false })),
      ]);

      setCandidatos(lista);
      setMejor(bestMove.san);
    } catch {
      // fallback: 3 movimientos aleatorios
      const legales = g.moves({ verbose: true });
      const sel = shuffle(legales).slice(0, 3);
      setCandidatos(sel.map(m => ({ san: m.san, from: m.from, to: m.to, esMejor: false })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    cargarCandidatos(game);
  }, []); // eslint-disable-line

  const votar = async (candidato) => {
    if (votado) return;
    setVotado(candidato.san);

    const correcto = candidato.san === mejor;
    if (correcto) setScore(s => s + 1);

    // Resaltar el mejor movimiento
    const bestCand = candidatos.find(c => c.san === mejor);
    if (bestCand) {
      setHighlight({
        [bestCand.from]: { background: 'rgba(76,175,80,0.5)' },
        [bestCand.to]:   { background: 'rgba(76,175,80,0.5)' },
        ...(candidato.san !== mejor ? {
          [candidato.from]: { background: 'rgba(244,67,54,0.4)' },
          [candidato.to]:   { background: 'rgba(244,67,54,0.4)' },
        } : {}),
      });
    }
  };

  const siguiente = () => {
    if (ronda >= TOTAL_RONDAS) { setDone(true); return; }

    // Ejecutar el mejor movimiento en el tablero
    const g = new Chess(game.fen());
    const bestCand = candidatos.find(c => c.san === mejor);
    if (bestCand) g.move({ from: bestCand.from, to: bestCand.to, promotion: 'q' });

    // Si hay movimiento del oponente, ejecutarlo también
    if (!g.isGameOver()) {
      const legales = g.moves({ verbose: true });
      if (legales.length > 0) {
        const oponente = legales[Math.floor(Math.random() * legales.length)];
        g.move(oponente);
      }
    }

    setGame(g);
    setRonda(r => r + 1);
    cargarCandidatos(g);
  };

  if (done) {
    const pct = Math.round((score / TOTAL_RONDAS) * 100);
    return (
      <div className="done-screen">
        <div className="done-icon">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
        <h2>¡Votación completada!</h2>
        <div className="done-stats">
          <div className="done-stat"><span>{score}</span><label>Correctas</label></div>
          <div className="done-stat"><span>{TOTAL_RONDAS - score}</span><label>Falladas</label></div>
          <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
        </div>
        <div className="done-actions">
          <button onClick={() => { setGame(new Chess()); setRonda(1); setScore(0); setDone(false); cargarCandidatos(new Chess()); }}>
            🔄 Repetir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>🗳️ Modo Votación</h2>
          <span style={{ fontSize: 13, color: '#888' }}>¿Cuál es el mejor movimiento?</span>
        </div>
        <span className="color-badge">Ronda {ronda}/{TOTAL_RONDAS}</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            customSquareStyles={highlight}
            arePiecesDraggable={false}
            boardWidth={480}
            {...boardProps}
          />
        </div>

        <div className="training-sidebar">
          <p style={{ color: '#c0c0c0', fontSize: 14, margin: '0 0 16px' }}>
            Turno de {game.turn() === 'w' ? '♔ blancas' : '♚ negras'}. Elige el mejor movimiento:
          </p>

          {loading ? (
            <div style={{ color: '#888', textAlign: 'center', padding: 20 }}>⏳ Analizando...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {candidatos.map((c, i) => {
                let bg = 'rgba(255,255,255,0.05)';
                let border = '1px solid #333';
                let color = '#e0e0e0';
                if (votado) {
                  if (c.san === mejor) { bg = 'rgba(76,175,80,0.2)'; border = '1px solid #4caf50'; color = '#4caf50'; }
                  else if (c.san === votado) { bg = 'rgba(244,67,54,0.2)'; border = '1px solid #f44336'; color = '#f44336'; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => votar(c)}
                    disabled={!!votado}
                    style={{ background: bg, border, color, padding: '14px 18px', borderRadius: 8, cursor: votado ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold', transition: 'all 0.2s' }}
                  >
                    {String.fromCharCode(65 + i)}. {c.san}
                    {votado && c.san === mejor && <span style={{ float: 'right', fontSize: 12 }}>✓ Mejor</span>}
                  </button>
                );
              })}
            </div>
          )}

          {votado && (
            <div style={{ marginTop: 12 }}>
              <div className={`feedback-box ${votado === mejor ? 'ok' : 'error'}`}>
                {votado === mejor
                  ? `✅ ¡Correcto! ${mejor} es el mejor movimiento según Stockfish.`
                  : `❌ El mejor movimiento era ${mejor}.`}
              </div>
              <button className="start-btn" style={{ marginTop: 12 }} onClick={siguiente}>
                {ronda >= TOTAL_RONDAS ? '🏁 Ver resultado' : 'Siguiente →'}
              </button>
            </div>
          )}

          <div className="training-stats" style={{ marginTop: 12 }}>
            <span className="stat-ok">✅ {score}</span>
            <span className="stat-err">❌ {ronda - 1 - score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
