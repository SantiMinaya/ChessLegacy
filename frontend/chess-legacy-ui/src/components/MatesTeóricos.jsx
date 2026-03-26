import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const MATES = [
  {
    id: 'pastor',
    titulo: 'Mate del Pastor',
    emoji: '⚡',
    concepto: 'El mate más rápido posible: 4 movimientos. Las blancas atacan f7 con dama y alfil. Las negras deben conocerlo para evitarlo.',
    movimientos: ['e4','e5','Bc4','Nc6','Qh5','Nf6??','Qxf7#'],
    descripcion: 'Tras 1.e4 e5 2.Bc4 Nc6 3.Qh5, las negras deben jugar 3...g6 para bloquear. Si juegan 3...Nf6?? la dama da mate en f7.',
    fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
    orientacion: 'white',
    defensa: '3...g6 bloquea la dama. Luego 4...Nf6 ataca la dama y desarrolla.',
    dificultad: '⭐',
  },
  {
    id: 'legal',
    titulo: 'Mate Legal',
    emoji: '♞',
    concepto: 'Sacrificio de dama seguido de mate con piezas menores. Sire de Légal lo jugó en 1750. Ocurre cuando las negras clavaron el caballo de f3 con Bg4.',
    movimientos: ['e4','e5','Bc4','d6','Nf3','Bg4','Nc3','g6','Nxe5','Bxd1','Bxf7+','Ke7','Nd5#'],
    descripcion: 'Tras la clavada con Bg4, las blancas sacrifican la dama con Nxe5! Si las negras capturan la dama, Bxf7+ Ke7 Nd5# es mate.',
    fen: 'rn1qkbnr/ppp2Bpp/3p4/4N3/2B1P3/8/PPPP1PPP/R1BbK2R b KQkq - 0 7',
    orientacion: 'white',
    defensa: 'Las negras deben jugar Bxf3 en vez de Bxd1, o no clavarse con Bg4.',
    dificultad: '⭐⭐',
  },
  {
    id: 'smothered',
    titulo: 'Mate Ahogado (Smothered)',
    emoji: '🐴',
    concepto: 'El caballo da jaque mate a un rey rodeado por sus propias piezas. Es uno de los mates más elegantes del ajedrez.',
    movimientos: ['e4','e5','Nf3','Nc6','Bc4','Nd4','Nxe5','Qg5','Nxf7','Qxg2','Rf1','Qxe4+','Be2','Nf3#'],
    descripcion: 'El rey queda atrapado por sus propias piezas y el caballo da el golpe final. El rey no puede moverse porque sus piezas bloquean todas las casillas.',
    fen: '4kb1r/pppp1Npp/8/6q1/4n3/8/PPPPBP1P/RNBQKR2 b Qk - 0 8',
    orientacion: 'black',
    defensa: 'Evitar que el rey quede rodeado por sus propias piezas. Mantener casillas de escape.',
    dificultad: '⭐⭐⭐',
  },
  {
    id: 'anastasia',
    titulo: 'Mate de Anastasia',
    emoji: '♜',
    concepto: 'Torre y caballo coordinados para dar mate. El caballo bloquea la huida del rey y la torre da el golpe final.',
    movimientos: ['e4','e5','Nf3','Nc6','Bc4','Bc5','O-O','Nf6','Ng5','O-O','Nxf7','Rxf7','Bxf7+','Kxf7','Qh5+','Ke7','Qe8#'],
    descripcion: 'El caballo en e6 bloquea la huida del rey y la torre en e1 da mate. El rey queda atrapado entre el caballo y el borde del tablero.',
    fen: '4Q3/4k1pp/4N3/8/8/8/PPPP1PPP/RNB2RK1 b - - 0 9',
    orientacion: 'white',
    defensa: 'No enrocar si el flanco de rey está debilitado. Mantener el caballo de f6 para defender.',
    dificultad: '⭐⭐',
  },
  {
    id: 'arabian',
    titulo: 'Mate Árabe',
    emoji: '🏰',
    concepto: 'Torre y caballo en esquina. El caballo controla las casillas de escape y la torre da mate. Uno de los patrones más antiguos del ajedrez.',
    movimientos: [],
    descripcion: 'El rey negro está en la esquina. El caballo blanco controla g8 y f7, y la torre da mate en h8.',
    fen: '6Rk/8/5N2/8/8/8/8/6K1 w - - 0 1',
    orientacion: 'white',
    defensa: 'Nunca dejar el rey en la esquina sin piezas defensoras cerca.',
    dificultad: '⭐',
    esPractica: true,
    objetivo: 'Da mate al rey negro en la esquina usando torre y caballo.',
    esCorrecta: (fen) => { const g = new Chess(fen); return g.isCheckmate() && g.turn() === 'b'; },
  },
  {
    id: 'back_rank',
    titulo: 'Mate de Pasillo (Back Rank)',
    emoji: '♟️',
    concepto: 'El rey queda atrapado en la primera fila por sus propios peones. Una torre o dama da mate en la primera fila. Muy común en partidas de aficionados.',
    movimientos: [],
    descripcion: 'Los peones del enroque bloquean al rey. La torre negra penetra por la columna abierta y da mate.',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    orientacion: 'white',
    defensa: 'Crear una "ventana" para el rey moviendo un peón (h3 o g3). Nunca dejar la primera fila sin escape.',
    dificultad: '⭐',
    esPractica: true,
    objetivo: 'Da mate al rey negro usando la torre en la primera fila.',
    esCorrecta: (fen) => { const g = new Chess(fen); return g.isCheckmate() && g.turn() === 'b'; },
  },
  {
    id: 'epaulette',
    titulo: 'Mate de Charreteras',
    emoji: '👑',
    concepto: 'El rey queda atrapado entre dos de sus propias piezas (como charreteras en los hombros). La dama da mate en el centro.',
    movimientos: [],
    descripcion: 'Las dos torres negras bloquean al rey por los lados y la dama blanca da mate en el centro.',
    fen: '3r2r1/8/3k4/8/8/3Q4/8/3K4 w - - 0 1',
    orientacion: 'white',
    defensa: 'No colocar piezas propias que bloqueen las casillas de escape del rey.',
    dificultad: '⭐⭐',
    esPractica: true,
    objetivo: 'Da mate al rey negro atrapado entre sus propias torres.',
    esCorrecta: (fen) => { const g = new Chess(fen); return g.isCheckmate() && g.turn() === 'b'; },
  },
];

export default function MatesTeóricos() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('menu');
  const [mateSel, setMateSel] = useState(null);
  const [game, setGame] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [orientacionJugador, setOrientacionJugador] = useState('white');
  const [completados, setCompletados] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('mates_completados') || '[]')); }
    catch { return new Set(); }
  });
  const [reproduciendo, setReproduciendo] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [gameRepro, setGameRepro] = useState(null);

  const verLeccion = (mate) => {
    setMateSel(mate);
    if (mate.movimientos.length > 0) {
      setGameRepro(new Chess());
      setStepIdx(0);
      setReproduciendo(false);
    }
    setPhase('leccion');
  };

  const reproducirPaso = () => {
    if (!mateSel || stepIdx >= mateSel.movimientos.length) return;
    const g = new Chess(gameRepro.fen());
    try {
      g.move(mateSel.movimientos[stepIdx]);
      setGameRepro(g);
      setStepIdx(s => s + 1);
    } catch {}
  };

  const resetRepro = () => {
    setGameRepro(new Chess());
    setStepIdx(0);
  };

  const practicar = () => {
    if (!mateSel.esPractica && !mateSel.fen) return;
    setGame(new Chess(mateSel.fen));
    setMoveCount(0);
    setResultado(null);
    setPhase('jugando');
  };

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
    }, 500);
    return () => clearTimeout(timer);
  }, [game, phase, resultado]); // eslint-disable-line

  const onPieceDrop = useCallback((from, to) => {
    if (!game || resultado) return false;
    if (game.turn() !== playerColor) return false;
    const g = new Chess(game.fen());
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;
    setGame(g);
    setMoveCount(c => c + 1);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
    if (mateSel.esCorrecta && mateSel.esCorrecta(g.fen())) {
      setResultado('ganado');
      playSound('correct');
      const nuevos = new Set(completados);
      nuevos.add(mateSel.id);
      setCompletados(nuevos);
      localStorage.setItem('mates_completados', JSON.stringify([...nuevos]));
    }
    return true;
  }, [game, resultado, mateSel, completados, playSound, playerColor]);

  if (phase === 'menu') return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 8px' }}>♟️ Mates Teóricos</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        Aprende los patrones de mate más importantes del ajedrez. Cada lección explica el concepto, muestra la secuencia y te deja practicarlo.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MATES.map(m => {
          const done = completados.has(m.id);
          return (
            <div key={m.id} onClick={() => verLeccion(m)} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: done ? 'rgba(76,175,80,0.08)' : 'var(--bg-card)',
              border: `1px solid ${done ? 'rgba(76,175,80,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--border-radius)', padding: '14px 18px', cursor: 'pointer',
              transition: 'border-color var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = done ? 'rgba(76,175,80,0.3)' : 'var(--border-subtle)'}
            >
              <span style={{ fontSize: 28 }}>{m.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 15 }}>{m.titulo}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{m.concepto.split('.')[0]}.</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--accent)' }}>{m.dificultad}</div>
                {done && <div style={{ fontSize: 11, color: 'var(--success)' }}>✅ Completado</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (phase === 'leccion') return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 36 }}>{mateSel.emoji}</span>
        <div>
          <h2 style={{ color: 'var(--accent)', margin: 0 }}>{mateSel.titulo}</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{mateSel.dificultad}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mateSel.movimientos.length > 0 ? '1fr 1fr' : '1fr', gap: 20, marginBottom: 16 }}>
        {mateSel.movimientos.length > 0 && (
          <div>
            <Chessboard
              position={gameRepro?.fen() || 'start'}
              arePiecesDraggable={false}
              boardWidth={340}
              {...boardProps}
            />
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button className="abandon-btn" onClick={resetRepro}>⏮ Reset</button>
              <button className="start-btn" style={{ flex: 1 }} onClick={reproducirPaso} disabled={stepIdx >= mateSel.movimientos.length}>
                {stepIdx < mateSel.movimientos.length ? `▶ ${mateSel.movimientos[stepIdx]}` : '✅ Fin'}
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 0' }}>
              Paso {stepIdx}/{mateSel.movimientos.length}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '14px 16px' }}>
            <h4 style={{ color: 'var(--accent)', margin: '0 0 6px', fontSize: 13 }}>📖 El patrón</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{mateSel.descripcion}</p>
          </div>
          <div style={{ background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: 'var(--border-radius)', padding: '12px 14px' }}>
            <h4 style={{ color: 'var(--error)', margin: '0 0 6px', fontSize: 13 }}>🛡️ Cómo evitarlo</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{mateSel.defensa}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
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
        {mateSel.esPractica && (
          <button className="start-btn" style={{ flex: 1 }} onClick={practicar}>🎯 Practicar</button>
        )}
        <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setPhase('menu')}>← Volver</button>
      </div>
    </div>
  );

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>{mateSel.emoji} {mateSel.titulo}</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{mateSel.objetivo}</span>
        </div>
        <button className="abandon-btn" onClick={() => setPhase('leccion')}>← Lección</button>
      </div>
      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={orientacionJugador || 'white'}
            boardWidth={480}
            arePiecesDraggable={!resultado}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          {!resultado ? (
            <div className="feedback-box">
              {game.isCheck() ? '⚠️ ¡Jaque!' : game.turn() === playerColor ? `♟️ Tu turno — ${moveCount} movimientos` : '⏳ El oponente piensa...'}
            </div>
          ) : (
            <>
              <div className="feedback-box ok">✅ ¡Mate conseguido en {moveCount} movimientos!</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="start-btn" style={{ flex: 1 }} onClick={practicar}>🔄 Repetir</button>
                <button className="abandon-btn" style={{ flex: 1 }} onClick={() => setPhase('menu')}>← Menú</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
