import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { partidasAPI, jugadoresAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useToast } from '../context/ToastContext';
import { chessMasters } from '../data/masters';

export default function PartidaReconstruida() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('select'); // select | playing | done
  const [masterSel, setMasterSel] = useState(null);
  const [partida, setPartida] = useState(null);
  const [moves, setMoves] = useState([]); // SANs de la partida
  const [fens, setFens] = useState([]);   // FEN tras cada movimiento
  const [pos, setPos] = useState(0);      // posición actual (índice en moves)
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'ok' | 'wrong'
  const [highlight, setHighlight] = useState({});
  const [showExpl, setShowExpl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    jugadoresAPI.getAll().then(r => setJugadores(r.data)).catch(() => {});
  }, []);

  const parsePgn = (pgn) => {
    const lines = pgn.split('\n').filter(l => !l.trim().startsWith('['));
    const text = lines.join(' ').trim();
    const tokens = text.split(/\s+/).filter(t => t && !/^\d+\./.test(t) && !['1-0','0-1','1/2-1/2','*'].includes(t));
    const g = new Chess();
    const sanList = [];
    const fenList = [g.fen()];
    for (const t of tokens) {
      try {
        const m = g.move(t);
        if (!m) break;
        sanList.push(m.san);
        fenList.push(g.fen());
      } catch { break; }
    }
    return { sanList, fenList };
  };

  const cargarPartida = async (master) => {
    setLoading(true);
    try {
      // Buscar jugador en BD por nombre
      const jugador = jugadores.find(j => j.nombre?.toLowerCase().includes(master.name.split(' ').pop().toLowerCase()));
      if (!jugador) { setLoading(false); return; }
      const r = await partidasAPI.getAll({ jugadorId: jugador.id, pageSize: 50 });
      const lista = r.data.partidas || [];
      if (!lista.length) { setLoading(false); return; }
      // Elegir partida aleatoria con PGN válido
      const candidatas = lista.filter(p => p.pgn && p.pgn.length > 50);
      if (!candidatas.length) { setLoading(false); return; }
      const p = candidatas[Math.floor(Math.random() * candidatas.length)];
      const { sanList, fenList } = parsePgn(p.pgn);
      if (sanList.length < 10) { setLoading(false); return; }
      setPartida(p);
      setMoves(sanList);
      setFens(fenList);
      setPos(0);
      setScore(0);
      setErrors(0);
      setFeedback(null);
      setHighlight({});
      setShowExpl(false);
      setMasterSel(master);
      setPhase('playing');
    } catch {}
    setLoading(false);
  };

  // Determinar si el turno actual es del maestro
  // El maestro juega blancas si colorJugador === 'Blancas', negras si 'Negras'
  const masterColor = partida?.colorJugador === 'Negras' ? 'b' : 'w';
  const esTurnoMaestro = useCallback(() => {
    if (!fens[pos]) return false;
    const g = new Chess(fens[pos]);
    return g.turn() === masterColor;
  }, [fens, pos, masterColor]);

  // Avanzar automáticamente si no es turno del maestro
  useEffect(() => {
    if (phase !== 'playing' || feedback) return;
    if (pos >= moves.length) { setPhase('done'); return; }
    if (!esTurnoMaestro()) {
      // Movimiento del oponente — avanzar automáticamente
      const t = setTimeout(() => {
        setHighlight({});
        setPos(p => p + 1);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [pos, phase, feedback, esTurnoMaestro, moves.length]);

  const onPieceDrop = (from, to) => {
    if (phase !== 'playing' || feedback || !esTurnoMaestro()) return false;
    const g = new Chess(fens[pos]);
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;

    const expected = moves[pos];
    if (m.san === expected) {
      setHighlight({ [from]: { background: 'rgba(76,175,80,0.4)' }, [to]: { background: 'rgba(76,175,80,0.4)' } });
      setFeedback('ok');
      setScore(s => s + 1);
      playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      setTimeout(() => { setFeedback(null); setHighlight({}); setPos(p => p + 1); }, 1000);
    } else {
      setHighlight({ [from]: { background: 'rgba(244,67,54,0.4)' }, [to]: { background: 'rgba(244,67,54,0.4)' } });
      setFeedback('wrong');
      setErrors(e => e + 1);
      playSound('error');
      setShowExpl(true);
    }
    return true;
  };

  const continuar = () => {
    setFeedback(null);
    setHighlight({});
    setShowExpl(false);
    setPos(p => p + 1);
  };

  const pct = (score + errors) > 0 ? Math.round((score / (score + errors)) * 100) : 0;

  // ── SELECT ──
  if (phase === 'select') return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 8px' }}>🎭 Partida Reconstruida</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        Elige un maestro y adivina sus movimientos en una partida real. ¿Piensas como él?
      </p>
      {loading && <p style={{ color: 'var(--text-muted)' }}>⏳ Cargando partida...</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {chessMasters.map(m => (
          <button key={m.id} onClick={() => cargarPartida(m)} disabled={loading} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 12px', cursor: 'pointer',
            transition: 'border-color var(--transition)', color: 'inherit',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <img src={m.photo} alt={m.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 13, textAlign: 'center' }}>{m.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.rating} ELO</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── DONE ──
  if (phase === 'done') return (
    <div className="done-screen">
      <div className="done-icon">{pct >= 70 ? '🎭' : pct >= 40 ? '👍' : '📚'}</div>
      <h2>¡Partida completada!</h2>
      <h3 style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>
        {masterSel?.name} vs {partida?.oponente} ({partida?.anio})
      </h3>
      <div className="done-stats">
        <div className="done-stat"><span>{score}</span><label>Aciertos</label></div>
        <div className="done-stat"><span>{errors}</span><label>Errores</label></div>
        <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        {pct >= 70 ? '¡Piensas como el maestro!' : pct >= 40 ? 'Buen intento. Sigue practicando.' : 'Cada maestro tiene su estilo único. ¡Inténtalo de nuevo!'}
      </p>
      <div className="done-actions">
        <button onClick={() => cargarPartida(masterSel)}>🔄 Otra partida</button>
        <button onClick={() => setPhase('select')}>← Volver</button>
      </div>
    </div>
  );

  // ── PLAYING ──
  const currentFen = fens[pos] || fens[fens.length - 1];
  const turnoMaestro = esTurnoMaestro();

  return (
    <div>
      <div className="training-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={masterSel?.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{masterSel?.name}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs {partida?.oponente} · {partida?.anio}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✅ {score}</span>
          <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>❌ {errors}</span>
          <span className="color-badge">{pos}/{moves.length}</span>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={currentFen}
            onPieceDrop={onPieceDrop}
            boardOrientation={masterColor === 'w' ? 'white' : 'black'}
            customSquareStyles={highlight}
            arePiecesDraggable={turnoMaestro && !feedback}
            boardWidth={480}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <div className={`feedback-box ${feedback === 'ok' ? 'ok' : feedback === 'wrong' ? 'error' : ''}`}>
            {feedback === 'ok'    ? `✅ ¡Correcto! Así jugó ${masterSel?.name}.` :
             feedback === 'wrong' ? `❌ No es lo que jugó ${masterSel?.name}.` :
             turnoMaestro         ? `🎭 ¿Qué movimiento haría ${masterSel?.name}?` :
                                    `⏳ Movimiento del oponente...`}
          </div>

          {showExpl && feedback === 'wrong' && (
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 'bold', marginBottom: 4 }}>💡 El maestro jugó</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{moves[pos]}</div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0' }}>
                {masterSel?.name} es conocido por su estilo {masterSel?.style?.split('.')[0]?.toLowerCase()}.
              </p>
            </div>
          )}

          {feedback === 'wrong' && (
            <button className="start-btn" onClick={continuar}>Continuar →</button>
          )}

          {/* Historial de movimientos */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', padding: '10px 12px', maxHeight: 200, overflowY: 'auto' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 6px', textTransform: 'uppercase' }}>Movimientos jugados</p>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {moves.slice(0, pos).map((m, i) => (
                <span key={i} style={{ marginRight: 4, color: i % 2 === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {i % 2 === 0 && <span style={{ color: 'var(--text-muted)', marginRight: 2 }}>{Math.floor(i/2)+1}.</span>}
                  {m}
                </span>
              ))}
            </div>
          </div>

          <button className="abandon-btn" onClick={() => setPhase('select')}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
