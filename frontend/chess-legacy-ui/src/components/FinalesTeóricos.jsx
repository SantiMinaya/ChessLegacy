import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const LECCIONES = [
  {
    id: 'oposicion',
    titulo: 'Oposición directa',
    emoji: '👑',
    concepto: 'Dos reyes están en oposición cuando están separados por una casilla en línea recta. El rey que NO tiene el turno tiene la oposición y ventaja.',
    objetivo: 'Consigue la oposición frente al rey negro y avanza el peón a coronar.',
    fen: '8/8/8/8/8/3k4/3P4/3K4 w - - 0 1',
    orientacion: 'white',
    pistas: [
      'Para tener la oposición, tu rey debe estar frente al rey negro con él teniendo el turno.',
      'Mueve el rey a d2 para ganar la oposición cuando el negro mueva.',
      'Con la oposición ganada, avanza el peón protegido por el rey.',
    ],
    esCorrecta: (fen) => {
      const g = new Chess(fen);
      // Verificar si el peón blanco ha coronado
      return fen.includes('Q') && !fen.includes('P');
    },
    movimientosMax: 20,
  },
  {
    id: 'casilla_clave',
    titulo: 'Casilla clave del peón',
    emoji: '🎯',
    concepto: 'Cada peón tiene casillas clave: si el rey llega a ellas, el peón corona sin importar dónde esté el rey rival. Para un peón en e4, las casillas clave son d6, e6 y f6.',
    objetivo: 'Lleva el rey blanco a una casilla clave (d6, e6 o f6) para garantizar la coronación.',
    fen: '8/8/8/8/4P3/8/8/3K1k2 w - - 0 1',
    orientacion: 'white',
    pistas: [
      'Las casillas clave del peón en e4 son d6, e6 y f6.',
      'Mueve el rey hacia el centro para acercarte a las casillas clave.',
      'Una vez en la casilla clave, el peón corona sin importar la posición del rey negro.',
    ],
    esCorrecta: (fen) => {
      return fen.includes('Q') && !fen.includes('P');
    },
    movimientosMax: 25,
  },
  {
    id: 'zugzwang',
    titulo: 'Zugzwang',
    emoji: '🔄',
    concepto: 'Zugzwang es cuando cualquier movimiento empeora tu posición. En finales de rey y peón, forzar al rival al zugzwang es la técnica clave.',
    objetivo: 'Fuerza al rey negro al zugzwang para que tenga que ceder el paso al peón.',
    fen: '8/8/3k4/3P4/3K4/8/8/8 w - - 0 1',
    orientacion: 'white',
    pistas: [
      'Necesitas que el rey negro tenga el turno en una posición donde cualquier movimiento le perjudique.',
      'Usa el "triángulo" con tu rey para perder un tempo y transferir el turno al negro.',
      'Cuando el negro esté en zugzwang, avanza el peón.',
    ],
    esCorrecta: (fen) => {
      return fen.includes('Q') && !fen.includes('P');
    },
    movimientosMax: 20,
  },
  {
    id: 'torre_septima',
    titulo: 'Torre en séptima',
    emoji: '♜',
    concepto: 'Una torre en la séptima fila (o segunda para negras) es devastadora: ataca los peones del rival y restringe al rey. Es uno de los principios más importantes de los finales de torre.',
    objetivo: 'Coloca la torre en la séptima fila y usa esa ventaja para ganar material.',
    fen: '8/8/3k4/8/8/3K4/r7/8 b - - 0 1',
    orientacion: 'black',
    pistas: [
      'La torre negra ya está en la segunda fila (séptima para negras). Úsala para atacar.',
      'Mantén la torre activa en la séptima fila mientras avanzas el rey.',
      'El rey blanco no puede escapar fácilmente de la torre en la séptima.',
    ],
    esCorrecta: (fen) => {
      const g = new Chess(fen);
      return g.isCheckmate() && g.turn() === 'w';
    },
    movimientosMax: 30,
  },
  {
    id: 'mate_torre',
    titulo: 'Mate con Torre y Rey',
    emoji: '♖',
    concepto: 'El mate con rey y torre requiere arrinconar al rey rival en el borde del tablero. La técnica: usar la torre para crear una "jaula" que se va reduciendo mientras el rey propio se acerca.',
    objetivo: 'Da mate al rey negro usando rey y torre. Arríncónalo en el borde.',
    fen: '8/8/8/8/3k4/8/8/R2K4 w - - 0 1',
    orientacion: 'white',
    pistas: [
      'Primero restringe al rey negro con la torre, creando una "jaula".',
      'Acerca tu rey para ayudar a la torre.',
      'Reduce la jaula fila a fila hasta arrinconar al rey en el borde.',
    ],
    esCorrecta: (fen) => {
      const g = new Chess(fen);
      return g.isCheckmate() && g.turn() === 'b';
    },
    movimientosMax: 40,
  },
  {
    id: 'peones_pasados',
    titulo: 'Peón pasado lejano',
    emoji: '♟️',
    concepto: 'Un peón pasado lejano (en el flanco contrario al rey rival) es una poderosa arma táctica. Obliga al rey rival a perseguirlo, liberando al rey propio para actuar en otro lado.',
    objetivo: 'Usa el peón pasado lejano para distraer al rey negro y ganar los peones del flanco de rey.',
    fen: '8/5ppp/8/p7/P7/8/5PPP/8 w - - 0 1',
    orientacion: 'white',
    pistas: [
      'Avanza el peón de a4 para crear una amenaza lejana.',
      'Cuando el rey negro vaya a perseguir el peón de a, tu rey ataca los peones del flanco de rey.',
      'El peón pasado lejano actúa como señuelo.',
    ],
    esCorrecta: (fen) => {
      // Verificar si las blancas tienen ventaja material clara
      const g = new Chess(fen);
      const board = g.board().flat().filter(Boolean);
      const peonesB = board.filter(p => p.type === 'p' && p.color === 'w').length;
      const peonesN = board.filter(p => p.type === 'p' && p.color === 'b').length;
      return peonesB > peonesN + 1;
    },
    movimientosMax: 20,
  },
];

export default function FinalesTeóricos() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('menu'); // menu | leccion | jugando | done
  const [leccionSel, setLeccionSel] = useState(null);
  const [game, setGame] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [pista, setPista] = useState(0);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [orientacionJugador, setOrientacionJugador] = useState('white'); // null | 'ganado' | 'timeout'
  const [completadas, setCompletadas] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('finales_completados') || '[]')); }
    catch { return new Set(); }
  });

  const iniciarLeccion = (leccion) => {
    setLeccionSel(leccion);
    setPhase('leccion');
  };

  const empezarJugar = () => {
    setGame(new Chess(leccionSel.fen));
    setMoveCount(0);
    setPista(0);
    setMostrarPista(false);
    setResultado(null);
    setPhase('jugando');
  };

  // Turno del jugador según orientación
  const playerColor = orientacionJugador === 'white' ? 'w' : 'b';

  // Respuesta automática del oponente
  useEffect(() => {
    if (phase !== 'jugando' || !game || resultado) return;
    if (game.turn() === playerColor) return;
    if (game.isGameOver()) return;
    const timer = setTimeout(() => {
      const moves = game.moves({ verbose: true });
      if (!moves.length) return;
      const m = moves[Math.floor(Math.random() * moves.length)];
      const g = new Chess(game.fen());
      g.move(m);
      setGame(g);
      setMoveCount(c => c + 1);
      playSound(m.flags?.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      if (leccionSel.esCorrecta(g.fen())) {
        setResultado('ganado');
        playSound('correct');
        const nuevas = new Set(completadas);
        nuevas.add(leccionSel.id);
        setCompletadas(nuevas);
        localStorage.setItem('finales_completados', JSON.stringify([...nuevas]));
      } else if (g.isGameOver()) {
        setResultado('timeout');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [game, phase, resultado]); // eslint-disable-line

  const onPieceDrop = useCallback((from, to) => {
    if (!game || resultado) return false;
    if (game.turn() !== playerColor) return false; // no es tu turno
    const g = new Chess(game.fen());
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;
    setGame(g);
    const newCount = moveCount + 1;
    setMoveCount(newCount);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
    if (leccionSel.esCorrecta(g.fen())) {
      setResultado('ganado');
      playSound('correct');
      const nuevas = new Set(completadas);
      nuevas.add(leccionSel.id);
      setCompletadas(nuevas);
      localStorage.setItem('finales_completados', JSON.stringify([...nuevas]));
      return true;
    }
    if (newCount >= leccionSel.movimientosMax) {
      setResultado('timeout');
      playSound('error');
    }
    return true;
  }, [game, resultado, moveCount, leccionSel, completadas, playSound, playerColor]);

  if (phase === 'menu') return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 8px' }}>♟️ Finales Teóricos</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        Aprende las técnicas exactas de los finales más importantes. Cada lección explica el concepto y luego lo practicas contra el tablero.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LECCIONES.map(l => {
          const done = completadas.has(l.id);
          return (
            <div key={l.id} onClick={() => iniciarLeccion(l)} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: done ? 'rgba(76,175,80,0.08)' : 'var(--bg-card)',
              border: `1px solid ${done ? 'rgba(76,175,80,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--border-radius)', padding: '14px 18px', cursor: 'pointer',
              transition: 'border-color var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = done ? 'rgba(76,175,80,0.3)' : 'var(--border-subtle)'}
            >
              <span style={{ fontSize: 28 }}>{l.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 15 }}>{l.titulo}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l.concepto.split('.')[0]}.</div>
              </div>
              <span style={{ fontSize: 13, color: done ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}>
                {done ? '✅ Completado' : `Máx. ${l.movimientosMax} movs.`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (phase === 'leccion') return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 36 }}>{leccionSel.emoji}</span>
        <h2 style={{ color: 'var(--accent)', margin: 0 }}>{leccionSel.titulo}</h2>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '16px 20px' }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 8px', fontSize: 14 }}>📖 El concepto</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{leccionSel.concepto}</p>
      </div>
      <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '14px 18px' }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 6px', fontSize: 14 }}>🎯 Tu objetivo</h4>
        <p style={{ color: 'var(--text-primary)', fontSize: 14, margin: 0 }}>{leccionSel.objetivo}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['white','black'].map(c => (
          <button key={c} onClick={() => setOrientacionJugador(c)} style={{
            padding: '8px 20px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: orientacionJugador === c ? 'var(--accent)' : 'var(--bg-card)',
            color: orientacionJugador === c ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${orientacionJugador === c ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            {c === 'white' ? '♔ Blancas' : '♚ Negras'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="start-btn" style={{ flex: 1 }} onClick={empezarJugar}>🚀 Practicar</button>
        <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setPhase('menu')}>← Volver</button>
      </div>
    </div>
  );

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>{leccionSel.emoji} {leccionSel.titulo}</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{leccionSel.objetivo}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: moveCount > leccionSel.movimientosMax * 0.7 ? 'var(--warning)' : 'var(--text-muted)' }}>
            {moveCount}/{leccionSel.movimientosMax} movs.
          </span>
          <button className="abandon-btn" onClick={() => setPhase('leccion')}>← Lección</button>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={orientacionJugador}
            boardWidth={480}
            arePiecesDraggable={!resultado}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          {!resultado ? (
            <>
              <div className="feedback-box">
                {game.isCheck() ? '⚠️ ¡Jaque!' : game.turn() === playerColor ? `♟️ Tu turno (${playerColor === 'w' ? 'blancas' : 'negras'})` : '⏳ El oponente piensa...'}
              </div>
              {mostrarPista && pista < leccionSel.pistas.length && (
                <div className="feedback-box hint">
                  💡 {leccionSel.pistas[pista]}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="abandon-btn" style={{ flex: 1 }} onClick={() => { setMostrarPista(true); setPista(p => Math.min(p + 1, leccionSel.pistas.length - 1)); }}>
                  💡 Pista {pista + 1}/{leccionSel.pistas.length}
                </button>
                <button className="abandon-btn" style={{ flex: 1 }} onClick={empezarJugar}>🔄 Reiniciar</button>
              </div>
            </>
          ) : (
            <>
              <div className={`feedback-box ${resultado === 'ganado' ? 'ok' : 'error'}`}>
                {resultado === 'ganado' ? '✅ ¡Objetivo conseguido! Técnica dominada.' : `❌ Demasiados movimientos (máx. ${leccionSel.movimientosMax}). ¡Inténtalo de nuevo!`}
              </div>
              {resultado === 'ganado' && (
                <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
                  Has demostrado que dominas la técnica de <strong style={{ color: 'var(--text-primary)' }}>{leccionSel.titulo}</strong>.
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="start-btn" style={{ flex: 1 }} onClick={empezarJugar}>🔄 Repetir</button>
                <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setPhase('menu')}>← Menú</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
