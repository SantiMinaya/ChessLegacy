import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';

const TOTAL_ROUNDS = 5;

export default function AdivinarApertura() {
  const { boardProps } = useBoardTheme();
  const [allVariantes, setAllVariantes] = useState([]); // [{apertura, variante, movimientos}]
  const [round, setRound] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [currentEntry, setCurrentEntry] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading | playing | answered | done
  const [moveIndex, setMoveIndex] = useState(0);
  const [revealing, setRevealing] = useState(false);

  // Cargar todas las variantes disponibles
  useEffect(() => {
    const loadAll = async () => {
      try {
        const r = await aperturasAPI.getAll();
        const aperturas = r.data;
        const entries = [];
        for (const ap of aperturas) {
          const rv = await aperturasAPI.getVariantes(ap);
          for (const v of rv.data) {
            const rd = await aperturasAPI.getAprendizaje(ap, v);
            entries.push({ apertura: ap, variante: v, movimientos: rd.data.movimientos });
          }
        }
        setAllVariantes(entries);
        setPhase('playing');
      } catch { setPhase('error'); }
    };
    loadAll();
  }, []);

  const buildGame = useCallback((moves) => {
    const g = new Chess();
    // Reproducir solo los primeros 6-10 movimientos para la pregunta
    const count = Math.min(moves.length, 6 + Math.floor(Math.random() * 5));
    for (let i = 0; i < count; i++) {
      const r = g.move(moves[i]);
      if (!r) break;
    }
    return g;
  }, []);

  const pickOptions = useCallback((correct, all) => {
    const pool = all.filter(e => `${e.apertura} — ${e.variante}` !== `${correct.apertura} — ${correct.variante}`);
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...shuffled, correct].sort(() => Math.random() - 0.5);
    return opts.map(e => `${e.apertura} — ${e.variante}`);
  }, []);

  const nextRound = useCallback((entries) => {
    if (round >= TOTAL_ROUNDS) { setPhase('done'); return; }
    const entry = entries[Math.floor(Math.random() * entries.length)];
    const g = buildGame(entry.movimientos);
    setCurrentEntry(entry);
    setGame(g);
    setOptions(pickOptions(entry, entries));
    setSelected(null);
    setMoveIndex(g.history().length);
    setRevealing(false);
  }, [round, buildGame, pickOptions]);

  useEffect(() => {
    if (phase === 'playing' && allVariantes.length > 0) nextRound(allVariantes);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, allVariantes.length]);

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = `${currentEntry.apertura} — ${currentEntry.variante}`;
    if (opt === correct) setScore(s => s + 1);
    setPhase('answered');
  };

  const handleNext = () => {
    setRound(r => r + 1);
    if (round + 1 >= TOTAL_ROUNDS) { setPhase('done'); return; }
    setPhase('playing');
    nextRound(allVariantes);
  };

  if (phase === 'loading') return <p style={{ color: '#c0c0c0', textAlign: 'center', padding: 40 }}>⏳ Cargando aperturas...</p>;
  if (phase === 'error') return <p style={{ color: '#f44336', textAlign: 'center', padding: 40 }}>❌ Error cargando datos.</p>;

  if (phase === 'done') return (
    <div className="done-screen">
      <div className="done-icon">{score >= 4 ? '🏆' : score >= 2 ? '👍' : '📚'}</div>
      <h2>¡Quiz completado!</h2>
      <div className="done-stats">
        <div className="done-stat"><span>{score}</span><label>Correctas</label></div>
        <div className="done-stat"><span>{TOTAL_ROUNDS - score}</span><label>Falladas</label></div>
        <div className="done-stat"><span>{Math.round((score / TOTAL_ROUNDS) * 100)}%</span><label>Precisión</label></div>
      </div>
      <div className="done-actions">
        <button onClick={() => { setRound(0); setScore(0); setPhase('playing'); }}>🔄 Repetir</button>
      </div>
    </div>
  );

  const correctAnswer = currentEntry ? `${currentEntry.apertura} — ${currentEntry.variante}` : '';

  return (
    <div>
      <div className="training-header">
        <h2>🤔 ¿Qué apertura es esta?</h2>
        <span className="color-badge">Ronda {round + 1}/{TOTAL_ROUNDS}</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard position={game.fen()} boardWidth={480} arePiecesDraggable={false} {...boardProps} />
        </div>

        <div className="training-sidebar">
          <p style={{ color: '#c0c0c0', margin: '0 0 12px', fontSize: 14 }}>
            Se han jugado {moveIndex} movimientos. ¿Reconoces la apertura?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map(opt => {
              let bg = '#16213e';
              let border = '1px solid #333';
              let color = '#e0e0e0';
              if (selected) {
                if (opt === correctAnswer) { bg = 'rgba(76,175,80,0.2)'; border = '1px solid #4caf50'; color = '#4caf50'; }
                else if (opt === selected) { bg = 'rgba(244,67,54,0.2)'; border = '1px solid #f44336'; color = '#f44336'; }
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  style={{ background: bg, border, color, padding: '12px 16px', borderRadius: 8, cursor: selected ? 'default' : 'pointer', textAlign: 'left', fontSize: 14, transition: 'all 0.2s' }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selected && (
            <div style={{ marginTop: 12 }}>
              <div className={`feedback-box ${selected === correctAnswer ? 'ok' : 'error'}`}>
                {selected === correctAnswer ? `✅ ¡Correcto! Es la ${correctAnswer}` : `❌ Era: ${correctAnswer}`}
              </div>
              <button className="start-btn" style={{ marginTop: 12 }} onClick={handleNext}>
                {round + 1 >= TOTAL_ROUNDS ? '🏁 Ver resultado' : 'Siguiente →'}
              </button>
            </div>
          )}

          <div className="training-stats" style={{ marginTop: 8 }}>
            <span className="stat-ok">✅ {score}</span>
            <span className="stat-err">❌ {round - score + (selected ? 0 : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
