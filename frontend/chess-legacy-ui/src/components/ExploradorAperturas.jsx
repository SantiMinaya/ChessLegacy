import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';
import { useToast } from '../context/ToastContext';

export default function ExploradorAperturas() {
  const { boardProps } = useBoardTheme();
  const { playSound } = useToast();

  const [game, setGame] = useState(new Chess());
  const [movimientos, setMovimientos] = useState([]); // SANs jugados
  const [todasVariantes, setTodasVariantes] = useState([]); // [{apertura, variante, moves[]}]
  const [cargando, setCargando] = useState(true);
  const [orientation, setOrientation] = useState('white');

  // Cargar todas las variantes al montar
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const rAps = await aperturasAPI.getAll();
        const aperturas = rAps.data;
        const todas = [];
        for (const ap of aperturas) {
          const rVars = await aperturasAPI.getVariantes(ap);
          for (const va of rVars.data) {
            const rMov = await aperturasAPI.getAprendizaje(ap, va);
            todas.push({
              apertura: ap,
              variante: va,
              moves: rMov.data.movimientos || [],
            });
          }
        }
        setTodasVariantes(todas);
      } catch {}
      setCargando(false);
    };
    cargar();
  }, []);

  // Calcular variantes que coinciden con los movimientos actuales
  const coincidentes = useCallback(() => {
    if (!movimientos.length) return [];
    const jugados = movimientos.join(' ');
    return todasVariantes.filter(v => {
      const teoria = v.moves.join(' ');
      return teoria.startsWith(jugados) || jugados.startsWith(teoria.split(' ').slice(0, movimientos.length).join(' '));
    });
  }, [movimientos, todasVariantes]);

  // Variantes que coinciden exactamente hasta aquí
  const variantesActivas = coincidentes();

  // Siguiente movimiento teórico por variante (el que viene después de los jugados)
  const siguientesMovimientos = variantesActivas
    .filter(v => v.moves.length > movimientos.length)
    .map(v => ({
      apertura: v.apertura,
      variante: v.variante,
      siguiente: v.moves[movimientos.length],
      total: v.moves.length,
    }));

  // Agrupar por siguiente movimiento
  const porMovimiento = siguientesMovimientos.reduce((acc, v) => {
    const key = v.siguiente;
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  // Variantes completadas (los movimientos jugados cubren toda la línea)
  const variantesCompletadas = variantesActivas.filter(v => v.moves.length <= movimientos.length);

  // Detectar transposiciones: variantes que llegan al mismo FEN por distinto camino
  const fenActual = game.fen().split(' ')[0]; // solo la posición, sin contadores
  const transposiciones = todasVariantes.filter(v => {
    // Ya coincide por movimientos — no es transposición
    if (variantesActivas.some(a => a.apertura === v.apertura && a.variante === v.variante)) return false;
    // Comprobar si algún FEN intermedio de esta variante coincide con el actual
    const g = new Chess();
    for (const m of v.moves) {
      try {
        if (!g.move(m)) break;
        if (g.fen().split(' ')[0] === fenActual) return true;
      } catch { break; }
    }
    return false;
  }).slice(0, 5); // máximo 5 transposiciones

  const onPieceDrop = (from, to) => {
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return false;
    setGame(g);
    setMovimientos(prev => [...prev, m.san]);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
    return true;
  };

  const retroceder = () => {
    if (!movimientos.length) return;
    const g = new Chess();
    const nuevos = movimientos.slice(0, -1);
    nuevos.forEach(m => g.move(m));
    setGame(g);
    setMovimientos(nuevos);
  };

  const reset = () => {
    setGame(new Chess());
    setMovimientos([]);
  };

  const jugarMovimiento = (san) => {
    const g = new Chess(game.fen());
    const m = g.move(san);
    if (!m) return;
    setGame(g);
    setMovimientos(prev => [...prev, m.san]);
    playSound(m.flags.includes('c') ? 'capture' : g.isCheck() ? 'check' : 'move');
  };

  const esTeórico = movimientos.length === 0 || variantesActivas.length > 0;
  const esNuevoMovimiento = movimientos.length > 0 && variantesActivas.length === 0;

  if (cargando) return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
      ⏳ Cargando base de datos de aperturas...
    </div>
  );

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>🌳 Explorador de Aperturas</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
            Juega movimientos y descubre qué variantes teóricas coinciden
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="abandon-btn" onClick={retroceder} disabled={!movimientos.length}>← Atrás</button>
          <button className="abandon-btn" onClick={reset}>🔄 Reset</button>
          <button className="abandon-btn" onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')}>🔄 Girar</button>
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            boardOrientation={orientation}
            boardWidth={480}
            arePiecesDraggable={true}
            {...boardProps}
          />
          {/* Movimientos jugados */}
          {movimientos.length > 0 && (
            <div style={{ marginTop: 10, background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>
              {movimientos.map((m, i) => (
                <span key={i} style={{ marginRight: 4, color: i % 2 === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {i % 2 === 0 && <span style={{ color: 'var(--text-muted)', marginRight: 2 }}>{Math.floor(i/2)+1}.</span>}
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="training-sidebar">
          {/* Estado teórico */}
          <div className={`feedback-box ${esNuevoMovimiento ? 'error' : 'ok'}`}>
            {movimientos.length === 0
              ? '♟️ Juega el primer movimiento para explorar'
              : esNuevoMovimiento
              ? '⚠️ Movimiento fuera de teoría — posición no registrada'
              : `✅ Posición teórica — ${variantesActivas.length} variante${variantesActivas.length !== 1 ? 's' : ''} coinciden`}
          </div>

          {/* Variantes completadas */}
          {variantesCompletadas.length > 0 && (
            <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 'bold', marginBottom: 6 }}>
                ✅ Línea completada
              </div>
              {variantesCompletadas.map((v, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                  {v.apertura} — <span style={{ color: 'var(--accent)' }}>{v.variante}</span>
                </div>
              ))}
            </div>
          )}

          {/* Siguientes movimientos teóricos */}
          {Object.keys(porMovimiento).length > 0 && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Continuaciones teóricas
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(porMovimiento).map(([mov, vars]) => (
                  <button
                    key={mov}
                    onClick={() => jugarMovimiento(mov)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                      textAlign: 'left', transition: 'border-color var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)', fontSize: 15, minWidth: 40 }}>
                      {mov}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {vars.slice(0, 3).map((v, i) => (
                        <div key={i} style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.apertura}{v.variante ? ` — ${v.variante}` : ''}
                        </div>
                      ))}
                      {vars.length > 3 && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{vars.length - 3} más...</div>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {vars.length} var.
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variantes activas completas */}
          {variantesActivas.length > 0 && Object.keys(porMovimiento).length === 0 && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Variantes en esta posición
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {variantesActivas.map((v, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-primary)' }}>{v.apertura}</span>
                    {v.variante && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>— {v.variante}</span>}
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 8 }}>{v.moves.length} movs.</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sin teoría */}
          {esNuevoMovimiento && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Esta posición no está en la base de datos de aperturas. Puede ser:
                <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                  <li>Una jugada poco común pero válida</li>
                  <li>Un error de apertura</li>
                  <li>Una variante que aún no está registrada</li>
                </ul>
              </div>
              <button
                className="abandon-btn"
                style={{ marginTop: 10 }}
                onClick={retroceder}
              >
                ← Volver al último movimiento teórico
              </button>
            </div>
          )}

          {/* Transposiciones */}
          {transposiciones.length > 0 && movimientos.length > 0 && (
            <div style={{ background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.3)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: 'var(--warning)', fontWeight: 'bold', marginBottom: 6 }}>
                🔀 Transposición detectada
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                Esta posición también se puede llegar desde:
              </div>
              {transposiciones.map((v, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '2px 0' }}>
                  ↔️ {v.apertura} — <span style={{ color: 'var(--accent)' }}>{v.variante}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
