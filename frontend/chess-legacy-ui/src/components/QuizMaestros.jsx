import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { partidasAPI, jugadoresAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useToast } from '../context/ToastContext';
import { chessMasters } from '../data/masters';

const TOTAL_ROUNDS = 5;

export default function QuizMaestros() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('menu'); // menu | loading | playing | done
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [fen, setFen] = useState('start');
  const [correcto, setCorrecto] = useState(null); // master correcto
  const [opciones, setOpciones] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [movimientos, setMovimientos] = useState(0);
  const [historial, setHistorial] = useState([]); // {correcto, seleccionado, fen}

  useEffect(() => {
    jugadoresAPI.getAll().then(r => setJugadores(r.data)).catch(() => {});
  }, []);

  const parsePgnToFen = (pgn, numMoves) => {
    try {
      const lines = pgn.split('\n').filter(l => !l.trim().startsWith('['));
      const text = lines.join(' ').trim();
      const tokens = text.split(/\s+/).filter(t => t && !/^\d+\./.test(t) && !['1-0','0-1','1/2-1/2','*'].includes(t));
      const g = new Chess();
      const count = Math.min(numMoves, tokens.length);
      for (let i = 0; i < count; i++) {
        try { if (!g.move(tokens[i])) break; } catch { break; }
      }
      return g.fen();
    } catch { return null; }
  };

  const cargarRonda = useCallback(async () => {
    if (!jugadores.length) return;
    setPhase('loading');
    try {
      // Elegir maestro correcto aleatorio
      const masterIdx = Math.floor(Math.random() * chessMasters.length);
      const master = chessMasters[masterIdx];
      const jugador = jugadores.find(j => j.nombre?.toLowerCase().includes(master.name.split(' ').pop().toLowerCase()));
      if (!jugador) { cargarRonda(); return; }

      const r = await partidasAPI.getAll({ jugadorId: jugador.id, pageSize: 30 });
      const lista = (r.data.partidas || []).filter(p => p.pgn && p.pgn.length > 80);
      if (!lista.length) { cargarRonda(); return; }

      const partida = lista[Math.floor(Math.random() * lista.length)];
      const numMoves = 10 + Math.floor(Math.random() * 10); // 10-20 movimientos
      const fenPos = parsePgnToFen(partida.pgn, numMoves);
      if (!fenPos) { cargarRonda(); return; }

      // Generar 4 opciones (1 correcta + 3 señuelos)
      const otros = chessMasters.filter(m => m.id !== master.id);
      const shuffled = [...otros].sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [...shuffled, master].sort(() => Math.random() - 0.5);

      setFen(fenPos);
      setCorrecto(master);
      setOpciones(opts);
      setSeleccionado(null);
      setMovimientos(numMoves);
      setPhase('playing');
    } catch { setPhase('playing'); }
  }, [jugadores]); // eslint-disable-line

  const iniciar = () => {
    setRound(0);
    setScore(0);
    setHistorial([]);
    cargarRonda();
  };

  const responder = (master) => {
    if (seleccionado) return;
    setSeleccionado(master);
    const esCorrecta = master.id === correcto.id;
    if (esCorrecta) { setScore(s => s + 1); playSound('correct'); }
    else playSound('error');
    setHistorial(h => [...h, { correcto, seleccionado: master, fen, esCorrecta }]);
  };

  const siguiente = () => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) { setPhase('done'); return; }
    setRound(nextRound);
    cargarRonda();
  };

  const pct = Math.round((score / TOTAL_ROUNDS) * 100);

  if (phase === 'menu') return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 56 }}>🎭</div>
      <h2 style={{ color: 'var(--accent)', margin: 0 }}>Quiz de Maestros</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        Se te mostrará una posición de una partida real. ¿Puedes adivinar qué maestro la jugó?
        {TOTAL_ROUNDS} rondas, 4 opciones cada una.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        {chessMasters.slice(0, 4).map(m => (
          <img key={m.id} src={m.photo} alt={m.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)', opacity: 0.7 }} />
        ))}
        <span style={{ fontSize: 24, alignSelf: 'center', color: 'var(--text-muted)' }}>...</span>
      </div>
      <button onClick={iniciar} disabled={!jugadores.length} style={{ padding: '14px 28px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', alignSelf: 'center' }}>
        🎭 Empezar Quiz
      </button>
    </div>
  );

  if (phase === 'loading') return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
      <p>Cargando posición...</p>
    </div>
  );

  if (phase === 'done') return (
    <div className="done-screen">
      <div className="done-icon">{pct >= 80 ? '🏆' : pct >= 60 ? '🎭' : '📚'}</div>
      <h2>¡Quiz completado!</h2>
      <div className="done-stats">
        <div className="done-stat"><span>{score}</span><label>Correctas</label></div>
        <div className="done-stat"><span>{TOTAL_ROUNDS - score}</span><label>Falladas</label></div>
        <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 16px' }}>
        {pct >= 80 ? '¡Eres un experto en estilos de juego!' : pct >= 60 ? 'Buen ojo para los estilos.' : 'Cada maestro tiene un estilo único. ¡Sigue estudiando!'}
      </p>
      {/* Resumen de rondas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, textAlign: 'left', width: '100%', maxWidth: 400 }}>
        {historial.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', borderLeft: `3px solid ${h.esCorrecta ? 'var(--success)' : 'var(--error)'}` }}>
            <span style={{ fontSize: 16 }}>{h.esCorrecta ? '✅' : '❌'}</span>
            <img src={h.correcto.photo} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{h.correcto.name}</span>
            {!h.esCorrecta && <span style={{ fontSize: 11, color: 'var(--error)' }}>Dijiste: {h.seleccionado.name}</span>}
          </div>
        ))}
      </div>
      <div className="done-actions">
        <button onClick={iniciar}>🔄 Repetir</button>
        <button onClick={() => setPhase('menu')}>← Volver</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="training-header">
        <h2 style={{ margin: 0 }}>🎭 ¿Quién jugó esta posición?</h2>
        <span className="color-badge">{round + 1}/{TOTAL_ROUNDS}</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={fen}
            arePiecesDraggable={false}
            boardWidth={480}
            {...boardProps}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', margin: '8px 0 0' }}>
            Posición tras {movimientos} movimientos
          </p>
        </div>

        <div className="training-sidebar">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 16px' }}>
            Analiza la posición y elige el maestro que crees que la jugó:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {opciones.map(m => {
              const esCorrecta = m.id === correcto?.id;
              const esSeleccionada = seleccionado?.id === m.id;
              let bg = 'var(--bg-secondary)';
              let border = 'var(--border-subtle)';
              let color = 'var(--text-primary)';
              if (seleccionado) {
                if (esCorrecta) { bg = 'rgba(76,175,80,0.15)'; border = 'var(--success)'; color = 'var(--success)'; }
                else if (esSeleccionada) { bg = 'rgba(244,67,54,0.15)'; border = 'var(--error)'; color = 'var(--error)'; }
              }
              return (
                <button key={m.id} onClick={() => responder(m)} disabled={!!seleccionado} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: bg, border: `1px solid ${border}`, color,
                  borderRadius: 'var(--border-radius)', padding: '10px 14px',
                  cursor: seleccionado ? 'default' : 'pointer',
                  transition: 'all var(--transition)', textAlign: 'left',
                }}>
                  <img src={m.photo} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>{m.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{m.years} · {m.rating} ELO</div>
                  </div>
                  {seleccionado && esCorrecta && <span style={{ marginLeft: 'auto', fontSize: 18 }}>✅</span>}
                  {seleccionado && esSeleccionada && !esCorrecta && <span style={{ marginLeft: 'auto', fontSize: 18 }}>❌</span>}
                </button>
              );
            })}
          </div>

          {seleccionado && (
            <div style={{ marginTop: 12 }}>
              {seleccionado.id === correcto?.id ? (
                <div className="feedback-box ok">✅ ¡Correcto! Era {correcto.name}.</div>
              ) : (
                <div className="feedback-box error">
                  ❌ Era {correcto?.name}. {correcto?.style?.split('.')[0]}.
                </div>
              )}
              <button className="start-btn" style={{ marginTop: 10, width: '100%' }} onClick={siguiente}>
                {round + 1 >= TOTAL_ROUNDS ? '🏁 Ver resultado' : 'Siguiente →'}
              </button>
            </div>
          )}

          <div className="training-stats" style={{ marginTop: 12 }}>
            <span className="stat-ok">✅ {score}</span>
            <span className="stat-err">❌ {round - score + (seleccionado ? 0 : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
