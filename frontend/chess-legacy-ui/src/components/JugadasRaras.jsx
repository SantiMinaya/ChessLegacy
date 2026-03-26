import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useToast } from '../context/ToastContext';

export default function JugadasRaras() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [phase, setPhase] = useState('menu');
  const [todasVariantes, setTodasVariantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [color, setColor] = useState('white');

  // Estado de la ronda
  const [game, setGame] = useState(new Chess());
  const [varianteBase, setVarianteBase] = useState(null);
  const [movTeoria, setMovTeoria] = useState([]); // movimientos teóricos hasta la desviación
  const [posDesviacion, setPosDesviacion] = useState(0); // índice donde se desvía
  const [movRaro, setMovRaro] = useState(''); // el movimiento raro que jugó el oponente
  const [movCorrecto, setMovCorrecto] = useState(''); // la mejor respuesta teórica
  const [fase, setFase] = useState('jugando'); // jugando | resultado
  const [feedback, setFeedback] = useState(null);
  const [highlight, setHighlight] = useState({});
  const [score, setScore] = useState(0);
  const [rondas, setRondas] = useState(0);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const rAps = await aperturasAPI.getAll();
        const todas = [];
        for (const ap of rAps.data) {
          const rVars = await aperturasAPI.getVariantes(ap);
          for (const va of rVars.data) {
            const rMov = await aperturasAPI.getAprendizaje(ap, va);
            if (rMov.data.movimientos?.length >= 8) {
              todas.push({ apertura: ap, variante: va, moves: rMov.data.movimientos });
            }
          }
        }
        setTodasVariantes(todas);
      } catch {}
      setCargando(false);
    };
    cargar();
  }, []);

  const generarRonda = useCallback(() => {
    if (!todasVariantes.length) return;
    const v = todasVariantes[Math.floor(Math.random() * todasVariantes.length)];

    // Reproducir entre 4 y 8 movimientos de la teoría
    const hasta = 4 + Math.floor(Math.random() * 4);
    const g = new Chess();
    const jugados = [];
    for (let i = 0; i < Math.min(hasta, v.moves.length - 2); i++) {
      try {
        const m = g.move(v.moves[i]);
        if (!m) break;
        jugados.push(m.san);
      } catch { break; }
    }

    // El siguiente movimiento teórico sería v.moves[jugados.length]
    const siguienteTeoria = v.moves[jugados.length];
    if (!siguienteTeoria) { generarRonda(); return; }

    // Asegurarse de que la desviación ocurre en el turno del OPONENTE
    // Si el jugador es blancas (color='white'), el oponente mueve en turnos impares (negras)
    // Si el jugador es negras, el oponente mueve en turnos pares (blancas)
    const turnoActual = g.turn(); // 'w' o 'b'
    const colorJugador = color === 'white' ? 'w' : 'b';
    if (turnoActual === colorJugador) {
      // Es el turno del jugador, necesitamos que el oponente mueva primero
      // Avanzar un movimiento más de teoría para que sea turno del oponente
      if (jugados.length < v.moves.length - 1) {
        try {
          const m = g.move(v.moves[jugados.length]);
          if (m) jugados.push(m.san);
        } catch {}
      } else {
        generarRonda(); return;
      }
    }

    const siguienteTeoria2 = v.moves[jugados.length];
    if (!siguienteTeoria2) { generarRonda(); return; }

    // Generar un movimiento "raro" — un movimiento legal diferente al teórico
    const movLegales = g.moves();
    const raros = movLegales.filter(m => m !== siguienteTeoria2);
    if (!raros.length) { generarRonda(); return; }
    const raro = raros[Math.floor(Math.random() * raros.length)];

    // Aplicar el movimiento raro
    const gConRaro = new Chess(g.fen());
    try { gConRaro.move(raro); } catch { generarRonda(); return; }

    setVarianteBase(v);
    setMovTeoria(jugados);
    setPosDesviacion(jugados.length);
    setMovRaro(raro);
    setMovCorrecto(siguienteTeoria2);
    setGame(gConRaro);
    setFase('jugando');
    setFeedback(null);
    setHighlight({});
  }, [todasVariantes, color]);

  const iniciar = () => {
    setScore(0);
    setRondas(0);
    generarRonda();
    setPhase('playing');
  };

  const onPieceDrop = (from, to) => {
    if (fase !== 'jugando') return false;
    // Solo puede mover el jugador
    const colorJugador = color === 'white' ? 'w' : 'b';
    if (game.turn() !== colorJugador) return false;
    const g = new Chess(game.fen());
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;

    // Evaluar si es una buena respuesta
    // Consideramos correcta si es el movimiento teórico o si es igualmente bueno
    const esTeoria = m.san === movCorrecto;
    setHighlight({ [from]: { background: esTeoria ? 'rgba(76,175,80,0.4)' : 'rgba(255,165,0,0.4)' }, [to]: { background: esTeoria ? 'rgba(76,175,80,0.4)' : 'rgba(255,165,0,0.4)' } });
    setFase('resultado');
    setRondas(r => r + 1);
    if (esTeoria) {
      setScore(s => s + 1);
      setFeedback('correcto');
      playSound('correct');
    } else {
      setFeedback('alternativo');
      playSound('move');
    }
    return true;
  };

  if (cargando) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>⏳ Cargando aperturas...</div>;

  if (phase === 'menu') return (
    <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🎲</div>
      <h2 style={{ color: 'var(--accent)', margin: 0 }}>Jugadas Raras</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        El oponente se desvía de la teoría con una jugada inesperada. ¿Sabes cómo responder? Se reproducen movimientos teóricos y en un momento el oponente juega algo raro — tú tienes que encontrar la mejor respuesta.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['white','black'].map(c => (
          <button key={c} onClick={() => setColor(c)} style={{
            padding: '8px 18px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: color === c ? 'var(--accent)' : 'var(--bg-card)',
            color: color === c ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${color === c ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            {c === 'white' ? '♔ Blancas' : '♚ Negras'}
          </button>
        ))}
      </div>
      <button onClick={iniciar} style={{ padding: '14px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        🚀 Empezar
      </button>
    </div>
  );

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>🎲 Jugadas Raras</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {varianteBase?.apertura} — {varianteBase?.variante}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✅ {score}/{rondas}</span>
          <button className="abandon-btn" onClick={() => setPhase('menu')}>← Volver</button>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={color}
            customSquareStyles={highlight}
            arePiecesDraggable={fase === 'jugando'}
            boardWidth={480}
            {...boardProps}
          />
          {/* Historial */}
          <div style={{ marginTop: 8, background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 10px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
            {movTeoria.map((m, i) => (
              <span key={i} style={{ marginRight: 4, color: i % 2 === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {i % 2 === 0 && <span style={{ color: 'var(--text-muted)', marginRight: 2 }}>{Math.floor(i/2)+1}.</span>}
                {m}
              </span>
            ))}
            <span style={{ color: 'var(--error)', fontWeight: 'bold', marginLeft: 4 }}>
              {Math.floor(movTeoria.length/2) + (movTeoria.length % 2 === 0 ? 1 : 0)}.{movTeoria.length % 2 === 0 ? '' : '..'} {movRaro} ⚠️
            </span>
          </div>
        </div>

        <div className="training-sidebar">
          {fase === 'jugando' ? (
            <>
              <div className="feedback-box error">
                ⚠️ ¡Jugada inesperada! El oponente jugó <strong style={{ color: 'var(--error)' }}>{movRaro}</strong> en vez de la teoría.
                <br />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  ¿Cuál es la mejor respuesta?
                </span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Contexto:</strong> Estabas en la {varianteBase?.apertura} ({varianteBase?.variante}). Tras {movTeoria.length} movimientos teóricos, el oponente se desvió.
              </div>
            </>
          ) : (
            <>
              <div className={`feedback-box ${feedback === 'correcto' ? 'ok' : 'hint'}`}>
                {feedback === 'correcto'
                  ? '✅ ¡Excelente! Encontraste la respuesta teórica.'
                  : '💡 Movimiento válido, pero la respuesta teórica era diferente.'}
              </div>
              <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 'bold', marginBottom: 6 }}>📖 Respuesta teórica</div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{movCorrecto}</div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0' }}>
                  En la {varianteBase?.apertura} ({varianteBase?.variante}), la teoría continúa con este movimiento.
                </p>
              </div>
              <button className="start-btn" onClick={generarRonda}>Siguiente ronda →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
