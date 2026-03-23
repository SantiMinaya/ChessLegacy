import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { analisisAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';

// FENs verificados — el jugador siempre mueve blancas, Stockfish juega negras
const FINALES = [
  {
    id: 'krk',
    nombre: 'Rey y Torre vs Rey',
    emoji: '♜',
    desc: 'Da mate con rey y torre. El rey negro intentará escapar.',
    objetivo: 'mate',
    posiciones: [
      '8/8/8/8/3k4/8/8/R2K4 w - - 0 1',
      '8/8/8/8/8/2k5/8/R3K3 w - - 0 1',
      '8/8/8/8/8/8/3k4/R3K3 w - - 0 1',
    ],
  },
  {
    id: 'kqk',
    nombre: 'Rey y Dama vs Rey',
    emoji: '♛',
    desc: 'Da mate con rey y dama. Cuidado con el ahogado.',
    objetivo: 'mate',
    posiciones: [
      '8/8/8/8/3k4/8/8/Q2K4 w - - 0 1',
      '8/8/8/8/8/2k5/8/Q3K3 w - - 0 1',
      '6k1/8/8/8/8/8/8/Q3K3 w - - 0 1',
    ],
  },
  {
    id: 'kpk',
    nombre: 'Rey y Peón vs Rey',
    emoji: '♟️',
    desc: 'Corona el peón. El rey negro intentará bloquearlo.',
    objetivo: 'coronacion',
    posiciones: [
      '8/8/8/8/8/3K4/3P4/3k4 w - - 0 1',
      '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1',
      '8/8/8/8/3k4/8/3P4/3K4 w - - 0 1',
    ],
  },
  {
    id: 'kbbk',
    nombre: 'Rey y 2 Alfiles vs Rey',
    emoji: '♝',
    desc: 'Da mate con dos alfiles. Requiere técnica precisa.',
    objetivo: 'mate',
    posiciones: [
      '8/8/8/8/3k4/8/8/B1B1K3 w - - 0 1',
      '6k1/8/8/8/8/8/8/B1B1K3 w - - 0 1',
    ],
  },
  {
    id: 'krkr',
    nombre: 'Torre vs Torre — Defensa',
    emoji: '♖',
    desc: 'Defiende la posición de tablas con rey y torre.',
    objetivo: 'tablas',
    posiciones: [
      '8/8/8/3k4/8/3K4/8/r3R3 w - - 0 1',
    ],
  },
];

export default function EndgameTrainer() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [phase, setPhase] = useState('select');
  const [finalSel, setFinalSel] = useState(null);
  const [game, setGame] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [resultado, setResultado] = useState(null); // null | 'mate' | 'tablas' | 'ahogado'
  const [status, setStatus] = useState('');

  const iniciar = (f) => {
    const fen = f.posiciones[Math.floor(Math.random() * f.posiciones.length)];
    const g = new Chess(fen);
    setFinalSel(f);
    setGame(g);
    setThinking(false);
    setMoveCount(0);
    setHint(null);
    setResultado(null);
    setStatus('♟️ Tu turno — mueves las blancas');
    setPhase('playing');
  };

  const checkResultado = useCallback((g) => {
    if (g.isCheckmate()) {
      const msg = g.turn() === 'b' ? '✅ ¡Mate! Lo conseguiste.' : '❌ Te han dado mate.';
      setResultado(g.turn() === 'b' ? 'mate' : 'derrota');
      setStatus(msg);
      playSound(g.turn() === 'b' ? 'correct' : 'error');
      return true;
    }
    if (g.isStalemate()) {
      setResultado('ahogado');
      setStatus('⚠️ Ahogado — tablas. Cuidado con el rey en el borde.');
      playSound('error');
      return true;
    }
    if (g.isDraw()) {
      setResultado('tablas');
      setStatus('🤝 Tablas.');
      return true;
    }
    return false;
  }, [playSound]);

  const makeStockfishMove = useCallback(async (currentGame) => {
    setThinking(true);
    setStatus('🤔 El rey negro intenta escapar...');
    try {
      const r = await analisisAPI.evaluar(currentGame.fen());
      const best = r.data.mejorMovimiento;
      if (!best || best === '(none)') {
        checkResultado(currentGame);
        setThinking(false);
        return;
      }
      const g = new Chess(currentGame.fen());
      const move = g.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best[4] || 'q' });
      if (!move) { setThinking(false); return; }
      setGame(g);
      playSound(move.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
      if (!checkResultado(g)) setStatus('♟️ Tu turno');
    } catch {
      setStatus('❌ Error de conexión');
    }
    setThinking(false);
  }, [checkResultado, playSound]);

  const handleMove = useCallback(async (from, to) => {
    if (!game || thinking || resultado) return false;
    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;
    setGame(g);
    setMoveCount(c => c + 1);
    setHint(null);
    playSound(move.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
    if (!checkResultado(g)) {
      await makeStockfishMove(g);
    }
    return true;
  }, [game, thinking, resultado, playSound, checkResultado, makeStockfishMove]);

  const { onSquareClick, onPieceDrop, customSquareStyles } = useChessInput(
    game ?? new Chess(),
    'white',
    !thinking && !resultado && !!game,
    handleMove
  );

  const pedirPista = async () => {
    if (!game || loadingHint) return;
    setLoadingHint(true);
    try {
      const r = await analisisAPI.evaluar(game.fen());
      setHint(r.data.mejorMovimiento);
    } catch {}
    setLoadingHint(false);
  };

  if (phase === 'select') return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#d4af37', margin: '0 0 8px' }}>♟️ Entrenador de Finales</h2>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>
        Practica los finales más importantes. Stockfish juega el bando contrario.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {FINALES.map(f => (
          <button key={f.id} onClick={() => iniciar(f)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 12, padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
            transition: 'border-color 0.2s', color: 'inherit',
          }}>
            <span style={{ fontSize: 32 }}>{f.emoji}</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#e0e0e0', fontSize: 14 }}>{f.nombre}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{f.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>{finalSel.emoji} {finalSel.nombre}</h2>
          <span style={{ fontSize: 13, color: '#888' }}>{finalSel.desc}</span>
        </div>
        <span className="color-badge">{moveCount} movimientos</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardWidth={480}
            arePiecesDraggable={!thinking && !resultado}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <div className={`feedback-box ${resultado === 'mate' ? 'ok' : resultado === 'derrota' || resultado === 'ahogado' ? 'error' : ''}`}>
            {status}
          </div>

          {hint && (
            <div className="feedback-box" style={{ marginTop: 8, borderColor: '#d4af37' }}>
              💡 Mejor movimiento: <strong style={{ color: '#d4af37' }}>{hint}</strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {!resultado && (
              <button className="abandon-btn" style={{ flex: 1 }} onClick={pedirPista} disabled={loadingHint}>
                {loadingHint ? '⏳...' : '💡 Pista'}
              </button>
            )}
            <button className="abandon-btn" style={{ flex: 1 }} onClick={() => iniciar(finalSel)}>
              🔄 Nueva posición
            </button>
          </div>
          <button className="abandon-btn" style={{ marginTop: 8, width: '100%' }} onClick={() => setPhase('select')}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
