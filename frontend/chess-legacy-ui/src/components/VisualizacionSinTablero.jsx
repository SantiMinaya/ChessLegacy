import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['1','2','3','4','5','6','7','8'];

const PIEZAS_NOMBRE = { p: 'Peón', n: 'Caballo', b: 'Alfil', r: 'Torre', q: 'Dama', k: 'Rey' };
const PIEZAS_EMOJI = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚', P: '♙', N: '♘', B: '♗', R: '♖', Q: '♕', K: '♔' };

const SECUENCIAS = [
  { movs: ['e4','e5','Nf3','Nc6','Bb5'], desc: 'Ruy Lopez — posición inicial' },
  { movs: ['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6','Nc3','a6'], desc: 'Siciliana Najdorf' },
  { movs: ['d4','Nf6','c4','g6','Nc3','Bg7','e4','d6','Nf3','O-O'], desc: 'India de Rey' },
  { movs: ['e4','e6','d4','d5','Nc3','Bb4','e5','c5'], desc: 'Francesa Winawer' },
  { movs: ['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5'], desc: 'Caro-Kann Clásica' },
  { movs: ['d4','d5','c4','e6','Nc3','Nf6','Bg5','Be7','e3'], desc: 'Gambito de Dama Rechazado' },
  { movs: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4','Bxb4','c3'], desc: 'Gambito Evans' },
  { movs: ['e4','Nf6','e5','Nd5','d4','d6','c4','Nb6','f4'], desc: 'Alekhine Cuatro Peones' },
  { movs: ['Nf3','d5','g3','Nf6','Bg2','e6','O-O','Be7','d3'], desc: 'Reti' },
  { movs: ['e4','e5','Nf3','Nf6','Nxe5','d6','Nf3','Nxe4','d4'], desc: 'Petrov Clásica' },
];

function generarPregunta(g) {
  const board = g.board();
  const tipo = Math.floor(Math.random() * 4);

  if (tipo === 0) {
    // ¿Qué pieza hay en X?
    const casilla = FILES[Math.floor(Math.random() * 8)] + RANKS[Math.floor(Math.random() * 8)];
    const file = FILES.indexOf(casilla[0]);
    const rank = 8 - parseInt(casilla[1]);
    const sq = board[rank]?.[file];
    const respuesta = sq ? `${sq.color === 'w' ? 'Blanca' : 'Negra'} — ${PIEZAS_NOMBRE[sq.type]}` : 'Vacía';
    const opciones = generarOpcionesCasilla(respuesta);
    return { pregunta: `¿Qué hay en la casilla ${casilla.toUpperCase()}?`, respuesta, opciones, tipo: 'casilla' };
  }

  if (tipo === 1) {
    // ¿Puede enrocar X?
    const color = Math.random() > 0.5 ? 'w' : 'b';
    const fen = g.fen();
    const partes = fen.split(' ');
    const castling = partes[2];
    let puede;
    if (color === 'w') puede = castling.includes('K') || castling.includes('Q');
    else puede = castling.includes('k') || castling.includes('q');
    const respuesta = puede ? 'Sí puede enrocar' : 'No puede enrocar';
    return {
      pregunta: `¿Pueden enrocar las ${color === 'w' ? 'blancas' : 'negras'}?`,
      respuesta,
      opciones: ['Sí puede enrocar', 'No puede enrocar'],
      tipo: 'enroque',
    };
  }

  if (tipo === 2) {
    // ¿De quién es el turno?
    const turno = g.turn() === 'w' ? 'Blancas' : 'Negras';
    return {
      pregunta: '¿De quién es el turno?',
      respuesta: turno,
      opciones: ['Blancas', 'Negras'],
      tipo: 'turno',
    };
  }

  // ¿Cuántos peones tiene X en el flanco de rey?
  const color = Math.random() > 0.5 ? 'w' : 'b';
  let count = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 4; f < 8; f++) { // columnas e-h = flanco de rey
      const sq = board[r][f];
      if (sq && sq.type === 'p' && sq.color === color) count++;
    }
  }
  const respuesta = count.toString();
  const opciones = [...new Set([count, Math.max(0,count-1), count+1, Math.max(0,count-2)].map(String))].slice(0,4);
  return {
    pregunta: `¿Cuántos peones tienen las ${color === 'w' ? 'blancas' : 'negras'} en el flanco de rey (columnas e-h)?`,
    respuesta,
    opciones: opciones.sort(() => Math.random() - 0.5),
    tipo: 'contar',
  };
}

function generarOpcionesCasilla(correcta) {
  const colores = ['Blanca', 'Negra'];
  const piezas = Object.values(PIEZAS_NOMBRE);
  const opciones = new Set([correcta]);
  while (opciones.size < 4) {
    if (Math.random() > 0.3) {
      const c = colores[Math.floor(Math.random() * 2)];
      const p = piezas[Math.floor(Math.random() * piezas.length)];
      opciones.add(`${c} — ${p}`);
    } else {
      opciones.add('Vacía');
    }
  }
  return [...opciones].sort(() => Math.random() - 0.5);
}

const TOTAL = 8;

export default function VisualizacionSinTablero() {
  const { playSound } = useToast();
  const [phase, setPhase] = useState('menu');
  const [dificultad, setDificultad] = useState('normal'); // facil | normal | dificil
  const [secuencia, setSecuencia] = useState(null);
  const [movsMostrados, setMovsMostrados] = useState([]);
  const [pregunta, setPregunta] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [ronda, setRonda] = useState(0);
  const [score, setScore] = useState(0);

  const NUM_MOVS = { facil: 4, normal: 7, dificil: 12 };

  const nuevaRonda = useCallback(() => {
    const seq = SECUENCIAS[Math.floor(Math.random() * SECUENCIAS.length)];
    const n = NUM_MOVS[dificultad];
    const movs = seq.movs.slice(0, n);
    const g = new Chess();
    for (const m of movs) { try { g.move(m); } catch { break; } }
    const p = generarPregunta(g);
    setSecuencia({ ...seq, movs });
    setMovsMostrados(movs);
    setPregunta(p);
    setSeleccionado(null);
  }, [dificultad]);

  const iniciar = () => {
    setRonda(0);
    setScore(0);
    nuevaRonda();
    setPhase('playing');
  };

  const responder = (opcion) => {
    if (seleccionado) return;
    setSeleccionado(opcion);
    const correcto = opcion === pregunta.respuesta;
    if (correcto) { setScore(s => s + 1); playSound('correct'); }
    else playSound('error');
  };

  const siguiente = () => {
    const nextRonda = ronda + 1;
    if (nextRonda >= TOTAL) { setPhase('done'); return; }
    setRonda(nextRonda);
    nuevaRonda();
  };

  const pct = Math.round((score / TOTAL) * 100);

  if (phase === 'menu') return (
    <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>👁️</div>
      <h2 style={{ color: 'var(--accent)', margin: 0 }}>Visualización Sin Tablero</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        Se te muestra una secuencia de movimientos en notación. Tienes que calcular la posición mentalmente y responder preguntas sobre ella. Sin tablero.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {[['facil','🟢 Fácil','4 movs'],['normal','🟡 Normal','7 movs'],['dificil','🔴 Difícil','12 movs']].map(([k,l,d]) => (
          <button key={k} onClick={() => setDificultad(k)} style={{
            padding: '10px 16px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: dificultad === k ? 'var(--accent)' : 'var(--bg-card)',
            color: dificultad === k ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${dificultad === k ? 'var(--accent)' : 'var(--border)'}`,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <span style={{ fontWeight: 'bold' }}>{l}</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>{d}</span>
          </button>
        ))}
      </div>
      <button onClick={iniciar} style={{ padding: '14px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        👁️ Empezar
      </button>
    </div>
  );

  if (phase === 'done') return (
    <div className="done-screen">
      <div className="done-icon">👁️</div>
      <h2>¡Completado!</h2>
      <div className="done-stats">
        <div className="done-stat"><span>{score}</span><label>Correctas</label></div>
        <div className="done-stat"><span>{TOTAL - score}</span><label>Falladas</label></div>
        <div className="done-stat"><span>{pct}%</span><label>Precisión</label></div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 16px' }}>
        {pct >= 80 ? '¡Excelente visión del tablero!' : pct >= 50 ? 'Buen trabajo. Sigue practicando.' : 'La visualización mejora con la práctica. ¡Inténtalo de nuevo!'}
      </p>
      <div className="done-actions">
        <button onClick={iniciar}>🔄 Repetir</button>
        <button onClick={() => setPhase('menu')}>← Volver</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="training-header">
        <h2 style={{ margin: 0 }}>👁️ Visualización Sin Tablero</h2>
        <span className="color-badge">{ronda + 1}/{TOTAL}</span>
      </div>

      {/* Secuencia de movimientos */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          {secuencia?.desc}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--text-primary)', lineHeight: 2, letterSpacing: 1 }}>
          {movsMostrados.map((m, i) => (
            <span key={i} style={{ marginRight: 6 }}>
              {i % 2 === 0 && <span style={{ color: 'var(--text-muted)', marginRight: 3, fontSize: 14 }}>{Math.floor(i/2)+1}.</span>}
              <span style={{ color: i % 2 === 0 ? 'var(--text-primary)' : 'var(--accent)' }}>{m}</span>
            </span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '10px 0 0' }}>
          ☝️ Calcula esta posición en tu cabeza. No hay tablero.
        </p>
      </div>

      {/* Pregunta */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '16px 20px', marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
          🤔 {pregunta?.pregunta}
        </p>
      </div>

      {/* Opciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pregunta?.opciones.map((op, i) => {
          const esCorrecta = op === pregunta.respuesta;
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
              textAlign: 'left', fontSize: 14, fontWeight: 500,
              transition: 'all var(--transition)',
            }}>
              {op}
              {seleccionado && esCorrecta && <span style={{ float: 'right' }}>✅</span>}
              {seleccionado && esSeleccionada && !esCorrecta && <span style={{ float: 'right' }}>❌</span>}
            </button>
          );
        })}
      </div>

      {seleccionado && (
        <button className="start-btn" style={{ marginTop: 16, width: '100%' }} onClick={siguiente}>
          {ronda + 1 >= TOTAL ? '🏁 Ver resultado' : 'Siguiente →'}
        </button>
      )}

      <div className="training-stats" style={{ marginTop: 12 }}>
        <span className="stat-ok">✅ {score}</span>
        <span className="stat-err">❌ {ronda - score + (seleccionado ? 0 : 0)}</span>
      </div>
    </div>
  );
}
