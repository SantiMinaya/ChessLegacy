import { useState, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { masterStyles } from '../data/masterStyles';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';
import { useAuth } from '../context/AuthContext';
import { progresoAPI } from '../services/api';
import './PlayMaster.css';

const API = 'http://localhost:5000/api';

function clasificarMovimiento(diff) {
  if (diff <= 10)  return { label: 'Excelente',   color: '#4caf50', emoji: '✨' };
  if (diff <= 30)  return { label: 'Bueno',        color: '#8bc34a', emoji: '✅' };
  if (diff <= 80)  return { label: 'Imprecisión',  color: '#ff9800', emoji: '⚠️' };
  if (diff <= 200) return { label: 'Error',         color: '#f44336', emoji: '❌' };
  return             { label: 'Blunder',            color: '#9c27b0', emoji: '???' };
}

// Genera comentario narrativo basado en la posición
function generarComentario(evalCp, moveCount, isCheck, isCapture, san, playerColor) {
  const e = evalCp / 100;
  const ventaja = playerColor === 'white' ? e : -e;

  if (isCheck) return `⚠️ ¡Jaque! El rey está en peligro. Busca una casilla segura.`;

  if (moveCount <= 4) {
    if (san?.includes('O-O')) return '🏰 Enroque — el rey queda seguro y la torre entra en juego.';
    if (san?.match(/^[NBRQ]/)) return '🐴 Buen desarrollo de pieza. Controla el centro.';
    return '📖 Apertura — desarrolla piezas, controla el centro, prepara el enroque.';
  }

  if (moveCount <= 15) {
    if (ventaja > 2)   return `✅ Tienes ventaja clara (+${ventaja.toFixed(1)}). Busca un plan concreto.`;
    if (ventaja < -2)  return `⚠️ El maestro tiene ventaja (${ventaja.toFixed(1)}). Defiende con precisión.`;
    if (ventaja > 0.5) return `🔼 Ligera ventaja tuya (+${ventaja.toFixed(1)}). Mantén la presión.`;
    if (ventaja < -0.5)return `🔽 El maestro presiona (${ventaja.toFixed(1)}). Busca contrajuego.`;
    if (isCapture)     return '⚔️ Intercambio de material. Evalúa si la estructura mejora.';
    return '⚖️ Posición equilibrada. Cada movimiento cuenta.';
  }

  // Final
  if (Math.abs(e) > 4) return e > 0 ? '🏆 Ventaja decisiva para blancas. Técnica de conversión.' : '🏆 Ventaja decisiva para negras.';
  if (isCapture)       return '⚔️ Simplificación. Evalúa el final resultante.';
  if (Math.abs(e) < 0.3) return '🤝 Posición muy equilibrada. Precisión técnica necesaria.';
  return ventaja > 0 ? '📈 Mantienes la iniciativa. Sigue presionando.' : '📉 Bajo presión. Busca recursos defensivos.';
}

// Genera posición Chess960 aleatoria válida
function generarFenChess960() {
  const piezas = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  let fila = Array(8).fill(null);

  // Alfiles en casillas de distinto color
  const casillasClaras = [0, 2, 4, 6];
  const casillasOscuras = [1, 3, 5, 7];
  fila[casillasClaras[Math.floor(Math.random() * 4)]] = 'B';
  fila[casillasOscuras[Math.floor(Math.random() * 4)]] = 'B';

  // Dama en casilla libre
  const libres = () => fila.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  const libres1 = libres();
  fila[libres1[Math.floor(Math.random() * libres1.length)]] = 'Q';

  // Caballos en casillas libres
  const libres2 = libres();
  const i1 = Math.floor(Math.random() * libres2.length);
  fila[libres2[i1]] = 'N';
  const libres3 = libres();
  const i2 = Math.floor(Math.random() * libres3.length);
  fila[libres3[i2]] = 'N';

  // Torre, Rey, Torre en las 3 casillas restantes (en ese orden)
  const libres4 = libres();
  fila[libres4[0]] = 'R';
  fila[libres4[1]] = 'K';
  fila[libres4[2]] = 'R';

  const filaBlancas = fila.join('').toLowerCase().replace(/b/g, 'b').replace(/q/g, 'q').replace(/n/g, 'n').replace(/r/g, 'r').replace(/k/g, 'k');
  const filaBlancasMay = fila.join('');
  const filaNegras = fila.join('').toLowerCase();

  return `${filaNegras}/pppppppp/8/8/8/8/PPPPPPPP/${filaBlancasMay} w KQkq - 0 1`;
}

export default function PlayMaster({ master, onBack }) {
  const { boardProps } = useBoardTheme();
  const { user } = useAuth();
  const styleInfo = masterStyles[master.id];

  const [phase, setPhase] = useState('config');
  const [playerColor, setPlayerColor] = useState('white');
  const [difficulty, setDifficulty] = useState('normal');
  const [chess960, setChess960] = useState(false);

  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('');
  const [evaluation, setEvaluation] = useState(0);
  const [evalHistory, setEvalHistory] = useState([]);
  const [comentario, setComentario] = useState('');
  const [thinking, setThinking] = useState(false);
  const gameOverRef = useRef(false);

  const [analysisData, setAnalysisData] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const depth = difficulty === 'easy' ? 3 : difficulty === 'normal' ? 8 : 15;

  const isPlayerTurn = useCallback((g) =>
    playerColor === 'white' ? g.turn() === 'w' : g.turn() === 'b'
  , [playerColor]);

  const updateStatus = useCallback((g) => {
    if (g.isCheckmate())
      setStatus(isPlayerTurn(g) ? `🎉 ¡${master.name} gana por jaque mate!` : '🎉 ¡Ganaste!');
    else if (g.isDraw())
      setStatus('🤝 Empate');
    else if (g.isCheck())
      setStatus(isPlayerTurn(g) ? '⚠️ ¡Jaque! - Tu turno' : `⚠️ ¡Jaque a ${master.name}!`);
    else
      setStatus(isPlayerTurn(g) ? '♟️ Tu turno' : `⏳ ${master.name} pensando...`);
  }, [isPlayerTurn, master.name]);

  const makeMasterMove = useCallback(async (currentGame, currentHistory, currentEvalHistory) => {
    try {
      const res = await fetch(`${API}/analisis/evaluar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: currentGame.fen(), profundidad: depth }),
      });
      const data = await res.json();
      const best = data.mejorMovimiento;
      if (!best || best === '(none)') { setThinking(false); return; }

      const g = new Chess(currentGame.fen());
      const move = g.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best[4] || 'q' });
      if (!move) { setThinking(false); return; }

      const newHistory = [...currentHistory, move];
      const newEvalHistory = [...currentEvalHistory, { move: move.san, eval: data.evaluacion, ply: newHistory.length }];
      setGame(g);
      setMoveHistory(newHistory);
      setEvaluation(data.evaluacion);
      setEvalHistory(newEvalHistory);
      setComentario(generarComentario(data.evaluacion, newHistory.length, g.isCheck(), move.flags.includes('c'), move.san, playerColor));
      setThinking(false);
      updateStatus(g);
      if (g.isGameOver()) gameOverRef.current = true;
    } catch {
      setThinking(false);
      setStatus('❌ Error de conexión');
    }
  }, [depth, updateStatus, playerColor]);

  const makeMove = useCallback(async (from, to) => {
    if (thinking || gameOverRef.current) return false;
    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const newHistory = [...moveHistory, move];
    setGame(g);
    setMoveHistory(newHistory);

    let newEvalHistory = evalHistory;
    try {
      const res = await fetch(`${API}/analisis/evaluar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: g.fen(), profundidad: depth }),
      });
      const data = await res.json();
      setEvaluation(data.evaluacion);
      newEvalHistory = [...evalHistory, { move: move.san, eval: data.evaluacion, ply: newHistory.length }];
      setEvalHistory(newEvalHistory);
      setComentario(generarComentario(data.evaluacion, newHistory.length, g.isCheck(), move.flags.includes('c'), move.san, playerColor));
    } catch {}

    if (g.isGameOver()) {
      gameOverRef.current = true;
      updateStatus(g);
      return true;
    }

    setThinking(true);
    updateStatus(g);
    setTimeout(() => makeMasterMove(g, newHistory, newEvalHistory), 400);
    return true;
  }, [thinking, game, moveHistory, evalHistory, depth, updateStatus, makeMasterMove, playerColor]);

  const { onSquareClick, onPieceDrop, customSquareStyles, tryExecutePremove } = useChessInput(
    game, playerColor, !thinking && !game.isGameOver() && phase === 'playing', makeMove
  );

  const startGame = () => {
    let g;
    if (chess960) {
      const fen = generarFenChess960();
      g = new Chess(fen);
    } else {
      g = new Chess();
    }
    gameOverRef.current = false;
    setGame(g);
    setMoveHistory([]);
    setEvaluation(0);
    setEvalHistory([]);
    setAnalysisData([]);
    setComentario(chess960 ? '🎲 Chess960 — posición aleatoria. ¡Desarrolla tus piezas!' : '📖 Apertura — desarrolla piezas, controla el centro, prepara el enroque.');
    setPhase('playing');
    setStatus(playerColor === 'white' ? '♟️ Tu turno' : `⏳ ${master.name} pensando...`);

    if (playerColor === 'black') {
      setThinking(true);
      setTimeout(() => makeMasterMove(g, [], []), 400);
    }
  };

  const runAnalysis = async () => {
    if (moveHistory.length === 0) return;
    setAnalysisLoading(true);
    setPhase('analysis');
    const results = [];
    const tempGame = new Chess(chess960 ? game.fen() : undefined);

    // Reconstruir desde el inicio
    const startFen = chess960 ? evalHistory[0]?.fen : undefined;
    const replayGame = startFen ? new Chess(startFen) : new Chess();

    for (let i = 0; i < moveHistory.length; i++) {
      const move = moveHistory[i];
      const isPlayerMove = playerColor === 'white' ? i % 2 === 0 : i % 2 === 1;
      try {
        const r = await fetch(`${API}/analisis/evaluar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen: replayGame.fen(), profundidad: 10 }),
        });
        const d = await r.json();
        const evalBefore = d.evaluacion;
        const bestMove = d.mejorMovimiento;
        replayGame.move(move);

        if (isPlayerMove) {
          const evalAfterRes = await fetch(`${API}/analisis/evaluar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fen: replayGame.fen(), profundidad: 10 }),
          });
          const dAfter = await evalAfterRes.json();
          const evalAfter = dAfter.evaluacion;
          const diff = Math.abs(evalBefore - (-evalAfter)); // negado porque cambió el turno
          results.push({ ply: i+1, san: move.san, eval: evalBefore, best: bestMove, diff: Math.max(0, diff), clase: clasificarMovimiento(Math.max(0, diff)), isPlayer: true });
        } else {
          results.push({ ply: i+1, san: move.san, isPlayer: false });
        }
      } catch {
        replayGame.move(move);
        results.push({ ply: i+1, san: move.san, isPlayer: isPlayerMove });
      }
    }
    setAnalysisData(results);
    setAnalysisLoading(false);
  };

  // ── CONFIG ──
  if (phase === 'config') return (
    <div className="play-master">
      <button className="back-btn" onClick={onBack}>← Volver</button>
      <div className="play-header">
        <img src={master.photo} alt={master.name} />
        <div><h1>Jugar contra {master.name}</h1><p>{styleInfo?.description || master.style}</p></div>
      </div>
      <div className="pm-config">
        <div className="pm-config-section">
          <h3>Color</h3>
          <div className="pm-color-selector">
            <button className={playerColor === 'white' ? 'active' : ''} onClick={() => setPlayerColor('white')}>♔ Blancas</button>
            <button className={playerColor === 'black' ? 'active' : ''} onClick={() => setPlayerColor('black')}>♚ Negras</button>
          </div>
        </div>
        <div className="pm-config-section">
          <h3>Dificultad</h3>
          <div className="pm-diff-selector">
            {[['easy','🐣 Fácil'],['normal','⚔️ Normal'],['hard','👿 Difícil']].map(([v,l]) => (
              <button key={v} className={difficulty === v ? 'active' : ''} onClick={() => setDifficulty(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="pm-config-section">
          <h3>Variante</h3>
          <div className="pm-diff-selector">
            <button className={!chess960 ? 'active' : ''} onClick={() => setChess960(false)}>♟️ Estándar</button>
            <button className={chess960 ? 'active' : ''} onClick={() => setChess960(true)}>🎲 Chess960</button>
          </div>
          {chess960 && <p style={{ color: '#888', fontSize: 12, margin: '8px 0 0' }}>Las piezas se colocan aleatoriamente. El enroque sigue las reglas Chess960.</p>}
        </div>
        <button className="pm-start-btn" onClick={startGame}>🚀 Comenzar partida</button>
      </div>
    </div>
  );

  // ── ANALYSIS ──
  if (phase === 'analysis') {
    const playerMoves = analysisData.filter(m => m.isPlayer);
    const counts = { Excelente: 0, Bueno: 0, Imprecisión: 0, Error: 0, Blunder: 0 };
    playerMoves.forEach(m => { if (m.clase) counts[m.clase.label]++; });
    return (
      <div className="play-master">
        <button className="back-btn" onClick={() => setPhase('config')}>← Nueva partida</button>
        <div className="play-header">
          <img src={master.photo} alt={master.name} />
          <div><h1>Análisis de la partida</h1><p>vs {master.name}</p></div>
        </div>
        {analysisLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#d4af37', fontSize: 18 }}>⏳ Analizando con Stockfish...</div>
        ) : (
          <div className="pm-analysis">
            <div className="pm-analysis-summary">
              {Object.entries(counts).map(([label, count]) => {
                const info = clasificarMovimiento(label === 'Excelente' ? 0 : label === 'Bueno' ? 20 : label === 'Imprecisión' ? 50 : label === 'Error' ? 100 : 300);
                return (
                  <div key={label} className="pm-analysis-stat">
                    <span style={{ color: info.color, fontSize: 20 }}>{info.emoji}</span>
                    <span style={{ fontWeight: 'bold', fontSize: 22, color: info.color }}>{count}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="pm-analysis-moves">
              {analysisData.map((m, i) => (
                <div key={i} className={`pm-analysis-move ${m.isPlayer ? 'player' : 'master'}`}>
                  <span className="pm-move-num">{Math.ceil((i+1)/2)}{i%2===0?'.':'...'}</span>
                  <span className="pm-move-san" style={{ color: m.clase?.color || '#888' }}>{m.clase?.emoji} {m.san}</span>
                  {m.isPlayer && m.clase && <span className="pm-move-label" style={{ color: m.clase.color }}>{m.clase.label}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── PLAYING ──
  const gameOver = game.isGameOver();
  const maxEval = 500;
  const graphW = 280, graphH = 80;
  const points = evalHistory.map((e, i) => {
    const x = evalHistory.length > 1 ? (i / (evalHistory.length - 1)) * graphW : graphW / 2;
    const y = graphH / 2 - (Math.max(-maxEval, Math.min(maxEval, e.eval)) / maxEval) * (graphH / 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="play-master">
      <button className="back-btn" onClick={() => setPhase('config')}>← Volver</button>
      <div className="play-header">
        <img src={master.photo} alt={master.name} />
        <div>
          <h1>Jugando contra {master.name}</h1>
          <p>{chess960 ? '🎲 Chess960' : styleInfo?.description || master.style}</p>
        </div>
      </div>

      <div className="play-container">
        <div className="eval-bar-vertical">
          <div className="eval-fill-vertical" style={{ height: `${Math.min(100, Math.max(0, 50 - evaluation / 20))}%`, background: '#000' }} />
          <div className="eval-text">{(evaluation / 100).toFixed(1)}</div>
        </div>

        <div className="board-section">
          <div className="opponent-name">{playerColor === 'white' ? master.name : 'Tú'}</div>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardWidth={500}
            boardOrientation={playerColor}
            arePiecesDraggable={!thinking && !gameOver}
            {...boardProps}
          />
          <div className="player-name">{playerColor === 'white' ? 'Tú' : master.name}</div>
          <div className="controls" style={{ display: 'flex', gap: 8 }}>
            <button onClick={startGame} style={{ flex: 1 }}>🔄 Nueva</button>
            {gameOver && (
              <button onClick={runAnalysis} style={{ flex: 1, background: 'rgba(76,175,80,0.2)', borderColor: '#4caf50', color: '#4caf50' }}>
                🔍 Analizar
              </button>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="status-box">{status}</div>

          {/* Comentario en tiempo real */}
          {comentario && (
            <div className="comentario-box">
              <span className="comentario-label">💬 Comentario</span>
              <p>{comentario}</p>
            </div>
          )}

          {/* Gráfico evaluación */}
          {evalHistory.length > 1 && (
            <div className="eval-graph-box">
              <h3>📈 Evaluación</h3>
              <svg width={graphW} height={graphH} style={{ display: 'block', margin: '0 auto' }}>
                <rect x={0} y={0} width={graphW} height={graphH/2} fill="rgba(255,255,255,0.06)" />
                <rect x={0} y={graphH/2} width={graphW} height={graphH/2} fill="rgba(0,0,0,0.15)" />
                <line x1={0} y1={graphH/2} x2={graphW} y2={graphH/2} stroke="#444" strokeWidth={1} />
                <polyline points={points} fill="none" stroke="#d4af37" strokeWidth={2} />
                {(() => {
                  const last = evalHistory[evalHistory.length - 1];
                  const x = graphW;
                  const y = graphH/2 - (Math.max(-maxEval, Math.min(maxEval, last.eval)) / maxEval) * (graphH/2);
                  return <circle cx={x} cy={y} r={4} fill="#d4af37" />;
                })()}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', marginTop: 4 }}>
                <span>♔</span><span>{(evaluation/100).toFixed(2)}</span><span>♚</span>
              </div>
            </div>
          )}

          <div className="style-info-box">
            <h3>Estilo de {master.name}</h3>
            <div className="style-bars">
              {[['Ataque', styleInfo?.preferences.attackWeight],['Táctica', styleInfo?.preferences.tacticalComplexity],['Posicional', styleInfo?.preferences.positionalWeight],['Sacrificios', styleInfo?.preferences.sacrificeBonus]].map(([label, val]) => (
                <div key={label} className="style-bar">
                  <span>{label}</span>
                  <div className="bar"><div className="fill" style={{ width: `${(val??0)*100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="history-box">
            <h3>Movimientos ({moveHistory.length})</h3>
            <div className="moves">
              {moveHistory.map((move, i) => (
                <span key={i} className={i%2===0?'white-move':'black-move'}>
                  {i%2===0?`${Math.ceil((i+1)/2)}. `:''}{move.san}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
