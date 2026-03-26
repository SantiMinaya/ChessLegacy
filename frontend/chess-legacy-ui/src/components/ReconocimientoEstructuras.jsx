import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const ESTRUCTURAS = [
  {
    nombre: 'Carlsbad',
    desc: 'Peones en c6/d5 vs c4/d4. Las negras atacan con el avance de minoría ...b5-b4.',
    plan: 'Blancas: ataque en el flanco de rey con f3-e4. Negras: ataque de minoría en el flanco de dama.',
    fen: 'r1bqk2r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 7',
    opciones: ['Carlsbad', 'Isolani', 'Hedgehog', 'Maróczy'],
  },
  {
    nombre: 'Isolani',
    desc: 'Peón aislado de dama en d4 (blancas) o d5 (negras). Ventaja dinámica vs debilidad estructural.',
    plan: 'Con el isolani: buscar actividad de piezas y ataque. Contra el isolani: bloquear en d5/d4 y simplificar.',
    fen: 'r1bqkb1r/pp3ppp/2n1pn2/3p4/3P4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 7',
    opciones: ['Isolani', 'Carlsbad', 'Stonewall', 'Dragón'],
  },
  {
    nombre: 'Hedgehog',
    desc: 'Negras con peones en a6/b6/d6/e6. Posición muy flexible que espera el momento para contraatacar.',
    plan: 'Negras: esperar y contraatacar con ...b5 o ...d5. Blancas: avanzar en el centro o flanco de rey.',
    fen: 'rn1qkb1r/1b2pppp/p2p1n2/1pp5/4P3/2NP1N2/PPP1BPPP/R1BQK2R w KQkq - 0 8',
    opciones: ['Hedgehog', 'Carlsbad', 'Dragón', 'Maróczy'],
  },
  {
    nombre: 'Maróczy',
    desc: 'Blancas con peones en c4/e4. Controlan d5 firmemente. Negras tienen poco espacio.',
    plan: 'Blancas: mantener el control de d5 y expandirse. Negras: buscar la ruptura ...b5 o ...d5.',
    fen: 'r1bqk2r/pp2ppbp/2np1np1/8/2P1P3/2N2N2/PP2BPPP/R1BQK2R w KQkq - 0 8',
    opciones: ['Maróczy', 'Hedgehog', 'Isolani', 'Carlsbad'],
  },
  {
    nombre: 'Dragón',
    desc: 'Negras con peones en g6/d6. El alfil en g7 apunta a la diagonal larga. Muy agresivo.',
    plan: 'Negras: ataque en el flanco de dama con ...a5-a4. Blancas: ataque en el flanco de rey con h4-h5.',
    fen: 'r1bqk2r/pp2ppbp/2np1np1/8/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 7',
    opciones: ['Dragón', 'Maróczy', 'Hedgehog', 'Scheveningen'],
  },
  {
    nombre: 'Scheveningen',
    desc: 'Negras con peones en d6/e6. El "pequeño centro siciliano". Muy sólido y flexible.',
    plan: 'Negras: preparar ...d5 o ...b5. Blancas: ataque con f4-f5 o g4-g5.',
    fen: 'r1bqk2r/pp3pbp/2nppnp1/8/3NP3/2N1BP2/PPP2PPP/R2QKB1R w KQkq - 0 8',
    opciones: ['Scheveningen', 'Dragón', 'Hedgehog', 'Isolani'],
  },
  {
    nombre: 'Stonewall',
    desc: 'Negras con peones en c6/d5/e6/f5. Estructura muy sólida pero con casilla e5 débil.',
    plan: 'Negras: ataque en el flanco de rey con ...Nf6-e4. Blancas: explotar la casilla e5.',
    fen: 'rnbqk2r/pp4pp/2p1pb2/3p1p2/3P1B2/2N1PN2/PPP2PPP/R2QKB1R w KQkq - 0 8',
    opciones: ['Stonewall', 'Carlsbad', 'Scheveningen', 'Isolani'],
  },
  {
    nombre: 'Peones colgantes',
    desc: 'Dos peones centrales sin apoyo de otros peones (ej: c5/d5). Fuerza dinámica vs debilidad.',
    plan: 'Con los colgantes: avanzar uno de ellos para ganar espacio. Contra ellos: bloquear y atacar.',
    fen: 'r1bqkb1r/pp3ppp/2n1pn2/2pp4/3PP3/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 7',
    opciones: ['Peones colgantes', 'Isolani', 'Carlsbad', 'Maróczy'],
  },
];

const TOTAL = 6;

export default function ReconocimientoEstructuras() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('menu');
  const [orientacion, setOrientacion] = useState('white');
  const [ronda, setRonda] = useState(0);
  const [score, setScore] = useState(0);
  const [estructuraActual, setEstructuraActual] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarPlan, setMostrarPlan] = useState(false);
  const [historial, setHistorial] = useState([]);

  const nuevaRonda = (r) => {
    const idx = r % ESTRUCTURAS.length;
    // Mezclar para no siempre el mismo orden
    const shuffled = [...ESTRUCTURAS].sort(() => Math.random() - 0.5);
    setEstructuraActual(shuffled[idx % shuffled.length]);
    setSeleccionado(null);
    setMostrarPlan(false);
  };

  const iniciar = () => {
    setRonda(0);
    setScore(0);
    setHistorial([]);
    nuevaRonda(0);
    setPhase('playing');
  };

  const responder = (opcion) => {
    if (seleccionado) return;
    setSeleccionado(opcion);
    const correcto = opcion === estructuraActual.nombre;
    if (correcto) { setScore(s => s + 1); playSound('correct'); }
    else playSound('error');
    setHistorial(h => [...h, { estructura: estructuraActual.nombre, seleccionado: opcion, correcto }]);
    setMostrarPlan(true);
  };

  const siguiente = () => {
    const next = ronda + 1;
    if (next >= TOTAL) { setPhase('done'); return; }
    setRonda(next);
    nuevaRonda(next);
  };

  const pct = Math.round((score / TOTAL) * 100);

  if (phase === 'menu') return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🏗️</div>
      <h2 style={{ color: 'var(--accent)', margin: 0 }}>Reconocimiento de Estructuras</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        Se te muestra una posición y tienes que identificar la estructura de peones. Reconocer la estructura determina el plan. Es la base del pensamiento estratégico.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, textAlign: 'left' }}>
        {ESTRUCTURAS.slice(0, 6).map(e => (
          <div key={e.nombre} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: 13 }}>{e.nombre}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{e.desc.split('.')[0]}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['white','black'].map(c => (
          <button key={c} onClick={() => setOrientacion(c)} style={{
            padding: '8px 20px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: orientacion === c ? 'var(--accent)' : 'var(--bg-card)',
            color: orientacion === c ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${orientacion === c ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            {c === 'white' ? '♔ Blancas' : '♚ Negras'}
          </button>
        ))}
      </div>
      <button onClick={iniciar} style={{ padding: '14px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        🏗️ Empezar
      </button>
    </div>
  );

  if (phase === 'done') return (
    <div className="done-screen">
      <div className="done-icon">🏗️</div>
      <h2>¡Completado!</h2>
      <div className="done-stats">
        <div className="done-stat"><span>{score}</span><label>Correctas</label></div>
        <div className="done-stat"><span>{TOTAL - score}</span><label>Falladas</label></div>
        <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16, width: '100%', maxWidth: 360 }}>
        {historial.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', borderRadius: 6, padding: '6px 10px', borderLeft: `3px solid ${h.correcto ? 'var(--success)' : 'var(--error)'}` }}>
            <span>{h.correcto ? '✅' : '❌'}</span>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1 }}>{h.estructura}</span>
            {!h.correcto && <span style={{ fontSize: 11, color: 'var(--error)' }}>Dijiste: {h.seleccionado}</span>}
          </div>
        ))}
      </div>
      <div className="done-actions">
        <button onClick={iniciar}>🔄 Repetir</button>
        <button onClick={() => setPhase('menu')}>← Volver</button>
      </div>
    </div>
  );

  if (!estructuraActual) return null;

  return (
    <div>
      <div className="training-header">
        <h2 style={{ margin: 0 }}>🏗️ ¿Qué estructura es esta?</h2>
        <span className="color-badge">{ronda + 1}/{TOTAL}</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={estructuraActual.fen}
            arePiecesDraggable={false}
            boardOrientation={orientacion}
            boardWidth={480}
            {...boardProps}
          />
        </div>

        <div className="training-sidebar">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 12px' }}>
            Analiza la estructura de peones y elige el nombre correcto:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {estructuraActual.opciones.map((op, i) => {
              const esCorrecta = op === estructuraActual.nombre;
              const esSeleccionada = seleccionado === op;
              let bg = 'var(--bg-secondary)';
              let border = 'var(--border-subtle)';
              let color = 'var(--text-primary)';
              if (seleccionado) {
                if (esCorrecta) { bg = 'rgba(76,175,80,0.15)'; border = 'var(--success)'; color = 'var(--success)'; }
                else if (esSeleccionada) { bg = 'rgba(244,67,54,0.15)'; border = 'var(--error)'; color = 'var(--error)'; }
              }
              return (
                <button key={i} onClick={() => responder(op)} disabled={!!seleccionado} style={{
                  padding: '12px 16px', borderRadius: 'var(--border-radius)',
                  background: bg, border: `1px solid ${border}`, color,
                  cursor: seleccionado ? 'default' : 'pointer',
                  textAlign: 'left', fontSize: 14, fontWeight: 'bold',
                  transition: 'all var(--transition)',
                }}>
                  {op}
                  {seleccionado && esCorrecta && <span style={{ float: 'right' }}>✅</span>}
                  {seleccionado && esSeleccionada && !esCorrecta && <span style={{ float: 'right' }}>❌</span>}
                </button>
              );
            })}
          </div>

          {mostrarPlan && (
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '12px 14px', marginTop: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 'bold', marginBottom: 6 }}>
                🏗️ {estructuraActual.nombre} — {estructuraActual.desc}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                <strong>Plan:</strong> {estructuraActual.plan}
              </p>
            </div>
          )}

          {seleccionado && (
            <button className="start-btn" style={{ marginTop: 8 }} onClick={siguiente}>
              {ronda + 1 >= TOTAL ? '🏁 Ver resultado' : 'Siguiente →'}
            </button>
          )}

          <div className="training-stats">
            <span className="stat-ok">✅ {score}</span>
            <span className="stat-err">❌ {ronda - score + (seleccionado ? 0 : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
