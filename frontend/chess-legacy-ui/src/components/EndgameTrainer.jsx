import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { analisisAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const FINALES = [
  {
    id: 'kpk', nombre: 'Rey y Peón vs Rey', emoji: '♟️',
    desc: 'Corona el peón o da mate',
    generar: () => {
      const fens = [
        '8/8/8/8/8/3K4/3P4/3k4 w - - 0 1',
        '8/8/8/8/8/8/1P6/K1k5 w - - 0 1',
        '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1',
        '8/8/8/8/3k4/8/3P4/3K4 w - - 0 1',
      ];
      return fens[Math.floor(Math.random() * fens.length)];
    }
  },
  {
    id: 'krk', nombre: 'Rey y Torre vs Rey', emoji: '♜',
    desc: 'Da mate con rey y torre',
    generar: () => {
      const fens = [
        '8/8/8/8/8/8/8/R3K1k1 w Q - 0 1',
        '8/8/8/8/3k4/8/8/R3K3 w Q - 0 1',
        '8/8/8/8/8/2k5/8/R3K3 w Q - 0 1',
      ];
      return fens[Math.floor(Math.random() * fens.length)];
    }
  },
  {
    id: 'kqk', nombre: 'Rey y Dama vs Rey', emoji: '♛',
    desc: 'Da mate con rey y dama',
    generar: () => {
      const fens = [
        '8/8/8/8/8/8/8/Q3K1k1 w Q - 0 1',
        '8/8/8/3k4/8/8/8/Q3K3 w Q - 0 1',
        '6k1/8/8/8/8/8/8/Q3K3 w Q - 0 1',
      ];
      return fens[Math.floor(Math.random() * fens.length)];
    }
  },
  {
    id: 'kbbk', nombre: 'Rey y 2 Alfiles vs Rey', emoji: '♝',
    desc: 'Da mate con dos alfiles',
    generar: () => {
      const fens = [
        '8/8/8/8/8/8/8/BBK3k1 w - - 0 1',
        '6k1/8/8/8/8/8/8/BBK5 w - - 0 1',
      ];
      return fens[Math.floor(Math.random() * fens.length)];
    }
  },
];

export default function EndgameTrainer() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [phase, setPhase] = useState('select');
  const [finalSeleccionado, setFinalSeleccionado] = useState(null);
  const [game, setGame] = useState(null);
  const [evalData, setEvalData] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [resultado, setResultado] = useState(null);

  const iniciar = (final) => {
    const fen = final.generar();
    setFinalSeleccionado(final);
    setGame(new Chess(fen));
    setEvalData(null);
    setMoveCount(0);
    setHint(null);
    setResultado(null);
    setPhase('playing');
  };

  const pedirPista = useCallback(async () => {
    if (!game) return;
    setLoadingHint(true);
    try {
      const r = await analisisAPI.evaluar(game.fen());
      setHint(r.data.mejorMovimiento);
      setEvalData(r.data);
    } catch {}
    setLoadingHint(false);
  }, [game]);

  const onPieceDrop = (from, to) => {
    if (!game || resultado) return false;
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;
    setGame(g);
    setMoveCount(c => c + 1);
    setHint(null);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
    if (g.isCheckmate()) { setResultado('mate'); playSound('correct'); }
    else if (g.isDraw()) { setResultado('tablas'); }
    return true;
  };

  if (phase === 'select') return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#d4af37', margin: '0 0 8px' }}>♟️ Entrenador de Finales</h2>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>Practica los finales más importantes del ajedrez</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {FINALES.map(f => (
          <button key={f.id} onClick={() => iniciar(f)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 12, padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
            transition: 'border-color 0.2s',
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
          <h2 style={{ margin: 0 }}>{finalSeleccionado.emoji} {finalSeleccionado.nombre}</h2>
          <span style={{ fontSize: 13, color: '#888' }}>{finalSeleccionado.desc}</span>
        </div>
        <span className="color-badge">{moveCount} movimientos</span>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardWidth={480}
            arePiecesDraggable={!resultado}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          {resultado ? (
            <div className={`feedback-box ${resultado === 'mate' ? 'ok' : 'error'}`}>
              {resultado === 'mate' ? `✅ ¡Mate en ${moveCount} movimientos!` : '🤝 Tablas'}
            </div>
          ) : (
            <div className="feedback-box">
              {game.isCheck() ? '⚠️ ¡Jaque!' : `♟️ Turno de ${game.turn() === 'w' ? 'blancas' : 'negras'}`}
            </div>
          )}

          {hint && (
            <div className="feedback-box hint" style={{ marginTop: 8 }}>
              💡 Mejor movimiento: <strong style={{ color: '#d4af37' }}>{hint}</strong>
              {evalData && <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>({(evalData.evaluacion / 100).toFixed(1)})</span>}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="abandon-btn" style={{ flex: 1 }} onClick={pedirPista} disabled={loadingHint}>
              {loadingHint ? '⏳...' : '💡 Pista'}
            </button>
            <button className="abandon-btn" style={{ flex: 1 }} onClick={() => iniciar(finalSeleccionado)}>
              🔄 Nueva posición
            </button>
          </div>
          <button className="abandon-btn" style={{ marginTop: 8 }} onClick={() => setPhase('select')}>← Volver</button>
        </div>
      </div>
    </div>
  );
}
