import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const PATRONES = {
  clavada: {
    nombre: 'Clavada', emoji: '📌', desc: 'Una pieza no puede moverse sin exponer a otra más valiosa',
    puzzles: [
      { fen: '2kr3r/ppp2ppp/2n5/3Rp1B1/8/2P5/PP3PPP/R5K1 w - - 0 1', solucion: ['Rd8+', 'Rxd8', 'Rxd8#'], titulo: 'Clavada al rey' },
      { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', solucion: ['Bxf2+', 'Rxf2', 'Nxe4'], titulo: 'Clavada del alfil' },
    ]
  },
  horquilla: {
    nombre: 'Horquilla', emoji: '🍴', desc: 'Una pieza ataca dos piezas enemigas simultáneamente',
    puzzles: [
      { fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', solucion: ['Nxe5', 'Nxe5', 'Qh5'], titulo: 'Horquilla de caballo' },
      { fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solucion: ['Bxf7+', 'Kxf7', 'Nxe5+'], titulo: 'Horquilla con jaque' },
    ]
  },
  descubierta: {
    nombre: 'Ataque Descubierto', emoji: '👁️', desc: 'Al mover una pieza se descubre el ataque de otra',
    puzzles: [
      { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5', solucion: ['Nxe5', 'Nxe5', 'Bxf7+'], titulo: 'Descubierta clásica' },
      { fen: '4r1k1/pp3ppp/2p5/8/3B4/8/PP3PPP/R5K1 w - - 0 1', solucion: ['Bh7+', 'Kh8', 'Ra8#'], titulo: 'Descubierta con mate' },
    ]
  },
  mate: {
    nombre: 'Patrones de Mate', emoji: '♟️', desc: 'Combinaciones que terminan en jaque mate',
    puzzles: [
      { fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1', solucion: ['Ra8#'], titulo: 'Mate del pasillo' },
      { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', solucion: ['Bxf7+', 'Ke7', 'Nd5#'], titulo: 'Mate Legal' },
      { fen: '5rk1/pp3ppp/8/8/8/8/PP3PPP/4RNK1 w - - 0 1', solucion: ['Ng3', 'Kh8', 'Nf5', 'Kg8', 'Re8#'], titulo: 'Mate Anastasia' },
    ]
  },
  sacrificio: {
    nombre: 'Sacrificio', emoji: '💎', desc: 'Ceder material para obtener una ventaja decisiva',
    puzzles: [
      { fen: '6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1', solucion: ['Qd8+', 'Kh7', 'Qg8+', 'Kxg8', 'f8=Q#'], titulo: 'Sacrificio de dama' },
      { fen: 'r2qkb1r/ppp2ppp/2n1pn2/3p4/3P1B2/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 6', solucion: ['Bxb8', 'Rxb8', 'Nxd5'], titulo: 'Sacrificio posicional' },
    ]
  },
};

export default function PatronesTacticos() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [patronActual, setPatronActual] = useState(null);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [game, setGame] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highlight, setHighlight] = useState({});
  const [solved, setSolved] = useState(false);
  const [completados, setCompletados] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('patrones_completados') || '[]')); }
    catch { return new Set(); }
  });

  const patron = patronActual ? PATRONES[patronActual] : null;
  const puzzle = patron?.puzzles[puzzleIdx];

  useEffect(() => {
    if (!puzzle) return;
    setGame(new Chess(puzzle.fen));
    setStepIdx(0); setFeedback(null); setHighlight({}); setSolved(false);
  }, [puzzleIdx, patronActual]);

  useEffect(() => {
    if (!game || !puzzle || solved) return;
    const isOpponent = stepIdx % 2 === 1 && stepIdx < puzzle.solucion.length;
    if (!isOpponent) return;
    const t = setTimeout(() => {
      const g = new Chess(game.fen());
      const m = g.move(puzzle.solucion[stepIdx]);
      if (m) {
        setGame(g);
        setHighlight({ [m.from]: { background: 'rgba(255,165,0,0.4)' }, [m.to]: { background: 'rgba(255,165,0,0.4)' } });
        playSound('move');
        const next = stepIdx + 1;
        setStepIdx(next);
        if (next >= puzzle.solucion.length) { setSolved(true); playSound('correct'); setFeedback('solved'); }
      }
    }, 500);
    return () => clearTimeout(t);
  }, [stepIdx, game]); // eslint-disable-line

  const onPieceDrop = (from, to) => {
    if (!game || solved || feedback === 'wrong') return false;
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;
    if (m.san === puzzle.solucion[stepIdx]) {
      setGame(g);
      setHighlight({ [from]: { background: 'rgba(76,175,80,0.4)' }, [to]: { background: 'rgba(76,175,80,0.4)' } });
      playSound(m.flags.includes('c') ? 'capture' : 'move');
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= puzzle.solucion.length) { setSolved(true); playSound('correct'); setFeedback('solved'); }
    } else {
      setHighlight({ [from]: { background: 'rgba(244,67,54,0.4)' }, [to]: { background: 'rgba(244,67,54,0.4)' } });
      setFeedback('wrong'); playSound('error');
      setTimeout(() => { setGame(new Chess(puzzle.fen)); setStepIdx(0); setHighlight({}); setFeedback('retry'); }, 900);
    }
    return true;
  };

  const siguientePuzzle = () => {
    const puzzles = patron.puzzles;
    if (puzzleIdx + 1 < puzzles.length) {
      setPuzzleIdx(i => i + 1);
    } else {
      // Patrón completado
      const nuevos = new Set(completados);
      nuevos.add(patronActual);
      setCompletados(nuevos);
      localStorage.setItem('patrones_completados', JSON.stringify([...nuevos]));
      setPatronActual(null);
    }
  };

  if (!patronActual) return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 8px' }}>🧩 Patrones Tácticos</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
        Aprende los patrones tácticos más importantes del ajedrez
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {Object.entries(PATRONES).map(([key, p]) => {
          const done = completados.has(key);
          return (
            <button key={key} onClick={() => { setPatronActual(key); setPuzzleIdx(0); }} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              background: done ? 'rgba(76,175,80,0.1)' : 'var(--bg-card)',
              border: `1px solid ${done ? 'rgba(76,175,80,0.4)' : 'var(--border)'}`,
              borderRadius: 12, padding: '20px 16px', cursor: 'pointer',
              transition: 'all var(--transition)',
            }}>
              <span style={{ fontSize: 32 }}>{p.emoji}</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 14 }}>{p.nombre}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{p.desc}</span>
              <span style={{ fontSize: 11, color: done ? 'var(--success)' : 'var(--text-muted)' }}>
                {done ? '✅ Completado' : `${p.puzzles.length} puzzles`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>{patron.emoji} {patron.nombre}</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{puzzle.titulo}</span>
        </div>
        <span className="color-badge">{puzzleIdx + 1}/{patron.puzzles.length}</span>
      </div>
      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard position={game.fen()} onPieceDrop={onPieceDrop} customSquareStyles={highlight}
            arePiecesDraggable={!solved && feedback !== 'wrong'} boardWidth={480} {...boardProps} />
        </div>
        <div className="training-sidebar">
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 12px' }}>{patron.desc}</p>
          <div className={`feedback-box ${feedback === 'solved' ? 'ok' : feedback === 'wrong' || feedback === 'retry' ? 'error' : ''}`}>
            {feedback === 'solved' ? '✅ ¡Correcto!' : feedback === 'wrong' ? '❌ Incorrecto' : feedback === 'retry' ? '🔄 Inténtalo de nuevo' : '🎯 Encuentra la jugada táctica'}
          </div>
          {solved && <button className="start-btn" style={{ marginTop: 12 }} onClick={siguientePuzzle}>
            {puzzleIdx + 1 < patron.puzzles.length ? 'Siguiente →' : '✅ Completar patrón'}
          </button>}
          <button className="abandon-btn" style={{ marginTop: 8 }} onClick={() => setPatronActual(null)}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
