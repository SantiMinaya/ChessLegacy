import { useState, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useToast } from '../context/ToastContext';
import { useBoardTheme } from '../context/BoardThemeContext';

const POSICIONES = [
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', desc: 'Italiana — posición activa', profundidad: 3 },
  { fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4', desc: 'Italiana — tensión central', profundidad: 3 },
  { fen: 'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5', desc: 'Gambito de Dama — posición típica', profundidad: 3 },
  { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', desc: 'Siciliana — desarrollo temprano', profundidad: 3 },
  { fen: 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6', desc: 'Italiana — posición compleja', profundidad: 4 },
  { fen: '2kr3r/ppp2ppp/2n5/3Rp1B1/8/2P5/PP3PPP/R5K1 w - - 0 1', desc: 'Táctica — busca la combinación', profundidad: 3 },
  { fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 3', desc: 'Posición abierta — múltiples opciones', profundidad: 3 },
];

export default function CalculoVariantes() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();
  const inputRef = useRef(null);

  const [phase, setPhase] = useState('menu');
  const [posIdx, setPosIdx] = useState(0);
  const [orientacion, setOrientacion] = useState('white');
  const [game, setGame] = useState(null);
  const [posicion, setPosicion] = useState(null);
  const [lineaEscrita, setLineaEscrita] = useState('');
  const [fase, setFase] = useState('calcular'); // calcular | ejecutar | resultado
  const [movEjecutados, setMovEjecutados] = useState([]);
  const [movCalculados, setMovCalculados] = useState([]);
  const [coincidencias, setCoincidencias] = useState([]);
  const [score, setScore] = useState(0);
  const [rondas, setRondas] = useState(0);

  const iniciarPosicion = (idx) => {
    const pos = POSICIONES[idx % POSICIONES.length];
    setPosicion(pos);
    setGame(new Chess(pos.fen));
    setLineaEscrita('');
    setFase('calcular');
    setMovEjecutados([]);
    setMovCalculados([]);
    setCoincidencias([]);
    setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const confirmarCalculo = () => {
    const movs = lineaEscrita.trim().split(/\s+/).filter(Boolean);
    if (!movs.length) return;
    setMovCalculados(movs);
    setFase('ejecutar');
  };

  const onPieceDrop = (from, to) => {
    if (fase !== 'ejecutar') return false;
    const g = new Chess(game.fen());
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return false; }
    if (!m) return false;
    setGame(g);
    const nuevos = [...movEjecutados, m.san];
    setMovEjecutados(nuevos);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');

    // Si ya ejecutamos suficientes movimientos, mostrar resultado
    if (nuevos.length >= posicion.profundidad) {
      const coinc = nuevos.map((mv, i) => ({
        ejecutado: mv,
        calculado: movCalculados[i] || '—',
        coincide: mv === movCalculados[i],
      }));
      setCoincidencias(coinc);
      const aciertos = coinc.filter(c => c.coincide).length;
      const bonus = aciertos === nuevos.length ? 2 : aciertos > 0 ? 1 : 0;
      setScore(s => s + bonus);
      setRondas(r => r + 1);
      setFase('resultado');
      if (aciertos === nuevos.length) playSound('correct');
    }
    return true;
  };

  const siguiente = () => {
    const next = (posIdx + 1) % POSICIONES.length;
    setPosIdx(next);
    iniciarPosicion(next);
  };

  if (phase === 'menu') return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🧮</div>
      <h2 style={{ color: 'var(--accent)', margin: 0 }}>Cálculo de Variantes</h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
        Se te muestra una posición. <strong style={{ color: 'var(--text-primary)' }}>Primero escribe la línea que calculas</strong> (sin mover nada). Luego ejecuta los movimientos en el tablero. Se compara lo que calculaste con lo que jugaste.
      </p>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', padding: '14px 18px', textAlign: 'left' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
          <strong style={{ color: 'var(--accent)' }}>¿Por qué es útil?</strong> Fuerza el hábito de calcular antes de actuar. El error más común en ajedrez amateur es mover sin haber calculado la respuesta del rival.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['white','black'].map(c => (
          <button key={c} onClick={() => setOrientacion(c)} style={{
            padding: '8px 20px', borderRadius: 'var(--border-radius)', cursor: 'pointer',
            background: orientacion === c ? 'var(--accent)' : 'var(--bg-card)',
            color: orientacion === c ? 'var(--accent-text)' : 'var(--text-primary)',
            border: `1px solid ${orientacion === c ? 'var(--accent)' : 'var(--border)'}`,
          }}>
            {c === 'white' ? '♔ Blancas' : '♚ Negras'}
          </button>
        ))}
      </div>
      <button onClick={() => iniciarPosicion(0)} style={{ padding: '14px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        🧮 Empezar
      </button>
    </div>
  );

  if (!game) return null;

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>🧮 Cálculo de Variantes</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{posicion?.desc}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {rondas > 0 && <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>⭐ {score} pts / {rondas} rondas</span>}
          <button className="abandon-btn" onClick={() => setPhase('menu')}>← Volver</button>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={orientacion}
            boardWidth={480}
            arePiecesDraggable={fase === 'ejecutar'}
            {...boardProps}
          />
          {movEjecutados.length > 0 && (
            <div style={{ marginTop: 8, background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 10px', fontFamily: 'monospace', fontSize: 12 }}>
              {movEjecutados.map((m, i) => (
                <span key={i} style={{ marginRight: 4, color: i % 2 === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {i % 2 === 0 && <span style={{ color: 'var(--text-muted)', marginRight: 2 }}>{Math.floor(i/2)+1}.</span>}
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="training-sidebar">
          {fase === 'calcular' && (
            <>
              <div className="feedback-box">
                🧮 <strong>Paso 1:</strong> Calcula {posicion?.profundidad} movimientos hacia adelante en tu cabeza y escríbelos aquí.
                <br />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  No muevas nada todavía. Primero calcula.
                </span>
              </div>
              <textarea
                ref={inputRef}
                value={lineaEscrita}
                onChange={e => setLineaEscrita(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmarCalculo(); } }}
                placeholder={`Ej: Nxf7 Rxf7 Qh5+ (${posicion?.profundidad} movimientos)`}
                rows={3}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius)',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 14, fontFamily: 'monospace',
                  resize: 'none', outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button className="start-btn" onClick={confirmarCalculo} disabled={!lineaEscrita.trim()}>
                ✅ Confirmar cálculo → Ejecutar
              </button>
            </>
          )}

          {fase === 'ejecutar' && (
            <>
              <div className="feedback-box ok">
                ♟️ <strong>Paso 2:</strong> Ahora ejecuta los movimientos en el tablero.
                <br />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Calculaste: <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{movCalculados.join(' ')}</strong>
                </span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Movimientos restantes: </span>
                <strong style={{ color: 'var(--accent)' }}>{posicion.profundidad - movEjecutados.length}</strong>
              </div>
            </>
          )}

          {fase === 'resultado' && (
            <>
              <div className={`feedback-box ${coincidencias.every(c => c.coincide) ? 'ok' : 'hint'}`}>
                {coincidencias.every(c => c.coincide)
                  ? '🎯 ¡Perfecto! Jugaste exactamente lo que calculaste.'
                  : `💡 ${coincidencias.filter(c => c.coincide).length}/${coincidencias.length} movimientos coincidieron con tu cálculo.`}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {coincidencias.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: c.coincide ? 'rgba(76,175,80,0.1)' : 'rgba(255,152,0,0.1)',
                    border: `1px solid ${c.coincide ? 'rgba(76,175,80,0.3)' : 'rgba(255,152,0,0.3)'}`,
                    borderRadius: 6, padding: '6px 10px', fontSize: 13,
                  }}>
                    <span style={{ color: 'var(--text-muted)', width: 20 }}>{i+1}.</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', minWidth: 50 }}>
                      Jugado: <strong>{c.ejecutado}</strong>
                    </span>
                    <span style={{ fontFamily: 'monospace', color: c.coincide ? 'var(--success)' : 'var(--warning)', fontSize: 12 }}>
                      Calculado: {c.calculado}
                    </span>
                    <span style={{ marginLeft: 'auto' }}>{c.coincide ? '✅' : '⚠️'}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text-muted)' }}>
                {coincidencias.every(c => c.coincide)
                  ? '🌟 +2 puntos — cálculo perfecto'
                  : coincidencias.some(c => c.coincide)
                  ? '⭐ +1 punto — cálculo parcial'
                  : '📚 +0 puntos — sigue practicando el cálculo'}
              </div>

              <button className="start-btn" onClick={siguiente}>Siguiente posición →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
