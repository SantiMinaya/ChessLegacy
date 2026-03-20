import { useState, useEffect, useRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const STORAGE_KEY = 'chess_speedrun_records';

function getRecords() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveRecord(key, ms) {
  const records = getRecords();
  if (!records[key] || ms < records[key]) {
    records[key] = ms;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true; // nuevo récord
  }
  return false;
}
function formatTime(ms) {
  if (!ms) return '—';
  const s = Math.floor(ms / 1000);
  const dec = Math.floor((ms % 1000) / 10);
  return `${s}.${dec.toString().padStart(2, '0')}s`;
}

export default function SpeedRun() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const [phase, setPhase] = useState('select'); // select | playing | done
  const [aperturas, setAperturas] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [selAp, setSelAp] = useState('');
  const [selVar, setSelVar] = useState('');
  const [color, setColor] = useState('white');
  const [game, setGame] = useState(new Chess());
  const [theoryMoves, setTheoryMoves] = useState([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [showingCorrect, setShowingCorrect] = useState(false);
  const [errors, setErrors] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const [isRecord, setIsRecord] = useState(false);
  const [aperturaInfo, setAperturaInfo] = useState(null);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    aperturasAPI.getAll().then(r => setAperturas(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selAp) { setVariantes([]); setSelVar(''); return; }
    aperturasAPI.getVariantes(selAp).then(r => { setVariantes(r.data); setSelVar(''); }).catch(() => {});
  }, [selAp]);

  const buildMoves = (raw) => {
    const g = new Chess();
    return raw.map(mv => { const r = g.move(mv); return r?.san; }).filter(Boolean);
  };

  const startGame = async () => {
    if (!selAp) return;
    try {
      const r = await aperturasAPI.getAprendizaje(selAp, selVar || undefined);
      const moves = buildMoves(r.data.movimientos);
      setAperturaInfo(r.data);
      setTheoryMoves(moves);
      setGame(new Chess());
      setMoveIndex(0);
      setErrors(0);
      setShowingCorrect(false);
      setFinalTime(null);
      setIsRecord(false);
      setPhase('playing');
      startRef.current = Date.now();
      timerRef.current = setInterval(() => setElapsed(Date.now() - startRef.current), 50);
    } catch {}
  };

  const isMyTurn = useCallback((idx, g) => {
    const t = g.turn();
    return (color === 'white' && t === 'w') || (color === 'black' && t === 'b');
  }, [color]);

  useEffect(() => {
    if (phase !== 'playing' || showingCorrect) return;
    if (moveIndex >= theoryMoves.length) {
      clearInterval(timerRef.current);
      const ms = Date.now() - startRef.current;
      setFinalTime(ms);
      const key = `${selAp}__${selVar}__${color}`;
      setIsRecord(saveRecord(key, ms));
      setPhase('done');
      playSound('correct');
      return;
    }
    if (!isMyTurn(moveIndex, game)) {
      setTimeout(() => {
        const g = new Chess(game.fen());
        g.move(theoryMoves[moveIndex]);
        setGame(g);
        setMoveIndex(i => i + 1);
      }, 200);
    }
  }, [moveIndex, phase, showingCorrect]); // eslint-disable-line

  const onPieceDrop = (from, to) => {
    if (phase !== 'playing' || showingCorrect) return false;
    if (!isMyTurn(moveIndex, game)) return false;
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;
    if (m.san === theoryMoves[moveIndex]) {
      setGame(g);
      setMoveIndex(i => i + 1);
      playSound(m.flags.includes('c') ? 'capture' : 'move');
    } else {
      setErrors(e => e + 1);
      setShowingCorrect(true);
      playSound('error');
      const expected = theoryMoves[moveIndex];
      setTimeout(() => {
        const gc = new Chess(game.fen());
        gc.move(expected);
        setGame(gc);
        setTimeout(() => {
          setGame(new Chess(game.fen()));
          setShowingCorrect(false);
        }, 800);
      }, 200);
    }
    return true;
  };

  const recordKey = `${selAp}__${selVar}__${color}`;
  const personalRecord = getRecords()[recordKey];

  if (phase === 'select') return (
    <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ color: '#d4af37', margin: 0 }}>⚡ Speed Run</h2>
      <p style={{ color: '#c0c0c0', margin: 0, fontSize: 14 }}>Completa la apertura lo más rápido posible. Compite contra tu propio récord.</p>
      <select value={selAp} onChange={e => setSelAp(e.target.value)} style={selectStyle}>
        <option value="">-- Selecciona apertura --</option>
        {aperturas.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      {variantes.length > 0 && (
        <select value={selVar} onChange={e => setSelVar(e.target.value)} style={selectStyle}>
          <option value="">-- Línea principal --</option>
          {variantes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        {['white', 'black'].map(c => (
          <button key={c} onClick={() => setColor(c)} style={{ ...selectStyle, flex: 1, background: color === c ? '#d4af37' : 'rgba(255,255,255,0.07)', color: color === c ? '#1a1a2e' : '#e0e0e0', fontWeight: color === c ? 'bold' : 'normal' }}>
            {c === 'white' ? '♔ Blancas' : '♚ Negras'}
          </button>
        ))}
      </div>
      {personalRecord && (
        <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#d4af37' }}>
          🏆 Tu récord: {formatTime(personalRecord)}
        </div>
      )}
      <button onClick={startGame} disabled={!selAp} style={{ padding: '12px', background: '#d4af37', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', color: '#1a1a2e', fontSize: 15 }}>
        ⚡ ¡Empezar!
      </button>
    </div>
  );

  if (phase === 'done') return (
    <div className="done-screen">
      <div className="done-icon">{isRecord ? '🏆' : '⚡'}</div>
      <h2>{isRecord ? '¡Nuevo récord!' : '¡Completado!'}</h2>
      <h3>{aperturaInfo?.apertura}{aperturaInfo?.variante ? ` — ${aperturaInfo.variante}` : ''}</h3>
      <div className="done-stats">
        <div className="done-stat"><span>{formatTime(finalTime)}</span><label>Tiempo</label></div>
        <div className="done-stat"><span>{errors}</span><label>Errores</label></div>
        {personalRecord && !isRecord && <div className="done-stat"><span>{formatTime(personalRecord)}</span><label>Récord</label></div>}
      </div>
      {isRecord && <p style={{ color: '#d4af37', fontSize: 14 }}>¡Superaste tu récord anterior!</p>}
      <div className="done-actions">
        <button onClick={startGame}>🔄 Repetir</button>
        <button onClick={() => setPhase('select')}>← Volver</button>
      </div>
    </div>
  );

  const progress = theoryMoves.length > 0 ? Math.round((moveIndex / theoryMoves.length) * 100) : 0;

  return (
    <div>
      <div className="training-header">
        <h2 style={{ margin: 0 }}>{aperturaInfo?.apertura}{aperturaInfo?.variante ? ` — ${aperturaInfo.variante}` : ''}</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 'bold', color: '#d4af37', fontFamily: 'monospace' }}>
            ⏱ {formatTime(elapsed)}
          </span>
          {personalRecord && <span style={{ fontSize: 12, color: '#888' }}>Récord: {formatTime(personalRecord)}</span>}
        </div>
      </div>
      <div className="progress-bar" style={{ marginBottom: 12 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span>{moveIndex}/{theoryMoves.length}</span>
      </div>
      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={color}
            boardWidth={480}
            arePiecesDraggable={!showingCorrect && isMyTurn(moveIndex, game)}
            {...boardProps}
          />
        </div>
        <div className="training-sidebar">
          <div className="feedback-box">
            {showingCorrect ? '💡 Movimiento correcto...' : isMyTurn(moveIndex, game) ? '⚡ ¡Rápido!' : '⏳ Oponente...'}
          </div>
          <div className="training-stats" style={{ marginTop: 12 }}>
            <span className="stat-err">❌ {errors}</span>
            <span style={{ color: '#d4af37' }}>⏱ {formatTime(elapsed)}</span>
          </div>
          <button className="abandon-btn" onClick={() => { clearInterval(timerRef.current); setPhase('select'); }}>Abandonar</button>
        </div>
      </div>
    </div>
  );
}

const selectStyle = { padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#e0e0e0', fontSize: 14, cursor: 'pointer' };
