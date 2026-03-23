import { useState, useEffect, useRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { chessMasters } from '../data/masters';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useChessInput } from '../hooks/useChessInput';
import './TournamentMode.css';

const TIME_CONTROLS = [
  { label: 'Bala (1 min)', minutes: 1, increment: 0 },
  { label: 'Bala (2+1)', minutes: 2, increment: 1 },
  { label: 'Blitz (3 min)', minutes: 3, increment: 0 },
  { label: 'Blitz (3+2)', minutes: 3, increment: 2 },
  { label: 'Blitz (5 min)', minutes: 5, increment: 0 },
  { label: 'Rápido (10 min)', minutes: 10, increment: 0 },
  { label: 'Rápido (15+10)', minutes: 15, increment: 10 },
  { label: 'Clásico (30 min)', minutes: 30, increment: 0 },
];

const ROUND_OPTIONS = [1, 3, 5, 7, 10];

const PHASES = { CONFIG: 'config', PLAYING: 'playing', ROUND_END: 'round_end', TOURNAMENT_END: 'tournament_end' };

export default function TournamentMode({ onBack }) {
  const { user } = useAuth();
  const { boardProps } = useBoardTheme();
  const [nuevosLogros, setNuevosLogros] = useState([]);
  // Config
  const [selectedMaster, setSelectedMaster] = useState(chessMasters[0]);
  const [timeControl, setTimeControl] = useState(TIME_CONTROLS[4]); // 5 min default
  const [totalRounds, setTotalRounds] = useState(3);
  const [phase, setPhase] = useState(PHASES.CONFIG);

  // Tournament state
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState({ player: 0, master: 0 });
  const [roundResults, setRoundResults] = useState([]); // [{round, result, reason}]

  // Game state
  const [game, setGame] = useState(new Chess());
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [playerColor] = useState('white'); // player always white for simplicity

  // Clocks (in seconds)
  const [playerTime, setPlayerTime] = useState(0);
  const [masterTime, setMasterTime] = useState(0);
  const [activeTimer, setActiveTimer] = useState(null); // 'player' | 'master' | null
  const timerRef = useRef(null);

  const startTournament = () => {
    const secs = timeControl.minutes * 60;
    setPlayerTime(secs);
    setMasterTime(secs);
    setCurrentRound(1);
    setScores({ player: 0, master: 0 });
    setRoundResults([]);
    setGame(new Chess());
    setMoveHistory([]);
    setStatus('Tu turno');
    setActiveTimer('player');
    setPhase(PHASES.PLAYING);
  };

  // Clock tick
  useEffect(() => {
    if (phase !== PHASES.PLAYING || !activeTimer) return;
    timerRef.current = setInterval(() => {
      if (activeTimer === 'player') {
        setPlayerTime(t => {
          if (t <= 1) { endRound('master', 'Tiempo agotado'); return 0; }
          return t - 1;
        });
      } else {
        setMasterTime(t => {
          if (t <= 1) { endRound('player', 'Tiempo agotado'); return 0; }
          return t - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimer, phase]);

  const endRound = useCallback((winner, reason) => {
    clearInterval(timerRef.current);
    setActiveTimer(null);
    setThinking(false);

    const points = winner === 'player' ? { player: 1, master: 0 }
                 : winner === 'master' ? { player: 0, master: 1 }
                 : { player: 0.5, master: 0.5 };

    setScores(prev => ({ player: prev.player + points.player, master: prev.master + points.master }));
    setRoundResults(prev => [...prev, { round: currentRound, winner, reason }]);
    setPhase(PHASES.ROUND_END);
  }, [currentRound]);

  const nextRound = () => {
    if (currentRound >= totalRounds) {
      setPhase(PHASES.TOURNAMENT_END);
      return;
    }
    const secs = timeControl.minutes * 60;
    setPlayerTime(secs);
    setMasterTime(secs);
    setCurrentRound(r => r + 1);
    setGame(new Chess());
    setMoveHistory([]);
    setStatus('Tu turno');
    setActiveTimer('player');
    setPhase(PHASES.PLAYING);
  };

  const makeMove = async (from, to) => {
    if (thinking || phase !== PHASES.PLAYING) return false;
    if (game.turn() !== 'w') return false;

    const g = new Chess(game.fen());
    const move = g.move({ from, to, promotion: 'q' });
    if (!move) return false;

    // Increment after move
    setPlayerTime(t => t + timeControl.increment);
    setGame(g);
    setMoveHistory(prev => [...prev, move]);

    if (g.isCheckmate()) { endRound('player', 'Jaque mate'); return true; }
    if (g.isDraw()) { endRound('draw', 'Tablas'); return true; }

    setActiveTimer('master');
    setThinking(true);
    setStatus(`🤔 ${selectedMaster.name} pensando...`);

    try {
      const res = await fetch('http://localhost:5000/api/analisis/evaluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: g.fen() })
      });
      const data = await res.json();
      const best = data.mejorMovimiento;
      if (!best || best === '(none)') { endRound('player', 'El maestro no tiene movimientos'); return true; }

      const g2 = new Chess(g.fen());
      const masterMove = g2.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best[4] || 'q' });
      if (!masterMove) { endRound('player', 'Error del motor'); return true; }

      setMasterTime(t => t + timeControl.increment);
      setGame(g2);
      setMoveHistory(prev => [...prev, masterMove]);

      if (g2.isCheckmate()) { endRound('master', 'Jaque mate'); return true; }
      if (g2.isDraw()) { endRound('draw', 'Tablas'); return true; }

      setActiveTimer('player');
      setStatus(g2.isCheck() ? '⚠️ ¡Jaque! Tu turno' : '♟️ Tu turno');
      await tryExecutePremove(g2);
    } catch {
      setStatus('❌ Error de conexión');
    } finally {
      setThinking(false);
    }
    return true;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timeClass = (secs) => secs <= 10 ? 'clock danger' : secs <= 30 ? 'clock warning' : 'clock';

  // Guardar torneo al llegar a TOURNAMENT_END
  useEffect(() => {
    if (phase !== PHASES.TOURNAMENT_END || !user?.token) return;
    const ganado = scores.player > scores.master;
    const rondasPerdidas = roundResults.filter(r => r.winner === 'master').length;
    progresoAPI.guardarTorneo(user.token, {
      maestro: selectedMaster.name,
      ganado,
      rondasPerdidas,
      minutosPorRonda: timeControl.minutes,
    }).then(r => {
      if (r.data.nuevosLogros?.length > 0) setNuevosLogros(r.data.nuevosLogros);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isPlayerTurn = game.turn() === 'w' && !thinking;

  const { onSquareClick, onPieceDrop, customSquareStyles, tryExecutePremove } = useChessInput(
    game, playerColor, isPlayerTurn, makeMove
  );
  if (phase === PHASES.CONFIG) return (
    <div className="tournament">
      <button className="t-back" onClick={onBack}>← Volver</button>
      <h1>🏆 Modo Torneo</h1>
      <p className="t-subtitle">Configura tu torneo y desafía a un gran maestro</p>

      <div className="t-config">
        <div className="t-section">
          <h3>Elige tu rival</h3>
          <div className="master-grid">
            {chessMasters.map(m => (
              <div key={m.id} className={`master-option ${selectedMaster.id === m.id ? 'selected' : ''}`}
                onClick={() => setSelectedMaster(m)}>
                <img src={m.photo} alt={m.name} />
                <span>{m.name}</span>
                <small>⭐ {m.rating}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="t-section">
          <h3>Control de tiempo</h3>
          <div className="option-grid">
            {TIME_CONTROLS.map(tc => (
              <button key={tc.label}
                className={`option-btn ${timeControl.label === tc.label ? 'selected' : ''}`}
                onClick={() => setTimeControl(tc)}>
                {tc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="t-section">
          <h3>Número de rondas</h3>
          <div className="option-grid">
            {ROUND_OPTIONS.map(r => (
              <button key={r}
                className={`option-btn ${totalRounds === r ? 'selected' : ''}`}
                onClick={() => setTotalRounds(r)}>
                {r} {r === 1 ? 'ronda' : 'rondas'}
              </button>
            ))}
          </div>
        </div>

        <button className="t-start-btn" onClick={startTournament}>
          🚀 Comenzar Torneo
        </button>
      </div>
    </div>
  );

  // ── ROUND END ──
  if (phase === PHASES.ROUND_END) {
    const last = roundResults[roundResults.length - 1];
    const resultText = last.winner === 'player' ? '🎉 ¡Ganaste la ronda!'
                     : last.winner === 'master' ? `😔 ${selectedMaster.name} ganó la ronda`
                     : '🤝 Tablas';
    return (
      <div className="tournament">
        <div className="round-end">
          <h2>Ronda {last.round} finalizada</h2>
          <div className="round-result-text">{resultText}</div>
          <div className="round-reason">{last.reason}</div>
          <div className="score-board">
            <div className="score-item"><span>Tú</span><big>{scores.player}</big></div>
            <div className="score-sep">—</div>
            <div className="score-item"><span>{selectedMaster.name}</span><big>{scores.master}</big></div>
          </div>
          <div className="round-history">
            {roundResults.map(r => (
              <div key={r.round} className={`round-row ${r.winner}`}>
                Ronda {r.round}: {r.winner === 'player' ? '✅ Victoria' : r.winner === 'master' ? '❌ Derrota' : '🤝 Tablas'} — {r.reason}
              </div>
            ))}
          </div>
          {currentRound < totalRounds
            ? <button className="t-start-btn" onClick={nextRound}>▶ Siguiente ronda ({currentRound + 1}/{totalRounds})</button>
            : <button className="t-start-btn" onClick={() => setPhase(PHASES.TOURNAMENT_END)}>🏁 Ver resultado final</button>
          }
        </div>
      </div>
    );
  }

  // ── TOURNAMENT END ──
  if (phase === PHASES.TOURNAMENT_END) {
    const winner = scores.player > scores.master ? 'player'
                 : scores.master > scores.player ? 'master' : 'draw';
    return (
      <div className="tournament">
        <div className="tournament-end">
          <div className="trophy">{winner === 'player' ? '🏆' : winner === 'master' ? '😔' : '🤝'}</div>
          <h2>{winner === 'player' ? '¡Ganaste el torneo!' : winner === 'master' ? `${selectedMaster.name} ganó el torneo` : 'Torneo empatado'}</h2>
          <div className="final-score">
            <div className="score-item"><span>Tú</span><big>{scores.player}</big></div>
            <div className="score-sep">—</div>
            <div className="score-item"><span>{selectedMaster.name}</span><big>{scores.master}</big></div>
          </div>
          <div className="round-history">
            {roundResults.map(r => (
              <div key={r.round} className={`round-row ${r.winner}`}>
                Ronda {r.round}: {r.winner === 'player' ? '✅ Victoria' : r.winner === 'master' ? '❌ Derrota' : '🤝 Tablas'} — {r.reason}
              </div>
            ))}
          </div>
          {nuevosLogros.length > 0 && (
            <div className="nuevos-logros-torneo">
              <h4>🏆 ¡Logros desbloqueados!</h4>
              {nuevosLogros.map(l => (
                <div key={l.codigo} className="logro-nuevo-t">{l.emoji} {l.nombre} — {l.descripcion}</div>
              ))}
            </div>
          )}
          <div className="end-actions">
            <button onClick={() => { setNuevosLogros([]); startTournament(); }}>🔄 Revancha</button>
            <button onClick={() => { setNuevosLogros([]); setPhase(PHASES.CONFIG); }}>⚙️ Nueva configuración</button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  return (
    <div className="tournament">
      <div className="t-top-bar">
        <div className="t-round-info">Ronda {currentRound}/{totalRounds}</div>
        <div className="t-score">{scores.player} — {scores.master}</div>
        <div className="t-rival">{selectedMaster.name}</div>
      </div>

      <div className="t-game-layout">
        <div className="t-board-col">
          <div className={`${timeClass(masterTime)} master-clock`}>
            <span>{selectedMaster.name}</span>
            <big>{formatTime(masterTime)}</big>
          </div>

          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardOrientation={playerColor}
            boardWidth={480}
            arePiecesDraggable={isPlayerTurn}
            {...boardProps}
          />

          <div className={`${timeClass(playerTime)} player-clock ${activeTimer === 'player' ? 'active' : ''}`}>
            <span>Tú</span>
            <big>{formatTime(playerTime)}</big>
          </div>
        </div>

        <div className="t-sidebar">
          <div className="t-status">{status}</div>

          <div className="t-moves">
            <h4>Movimientos</h4>
            <div className="moves-list">
              {moveHistory.map((m, i) => (
                <span key={i} className={i % 2 === 0 ? 'wm' : 'bm'}>
                  {i % 2 === 0 && <span className="mn">{Math.ceil((i + 1) / 2)}.</span>}
                  {m.san}{' '}
                </span>
              ))}
            </div>
          </div>

          <button className="resign-btn" onClick={() => endRound('master', 'Abandono')}>
            🏳 Abandonar ronda
          </button>
        </div>
      </div>
    </div>
  );
}
