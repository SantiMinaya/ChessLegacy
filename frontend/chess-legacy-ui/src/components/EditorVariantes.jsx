import { useState, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useBoardTheme } from '../context/BoardThemeContext';

const STORAGE_KEY = 'chess_legacy_variantes';

function cargarVariantes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function guardarVariantes(v) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
}

export default function EditorVariantes() {
  const { boardProps } = useBoardTheme();
  const [variantes, setVariantes] = useState(cargarVariantes);
  const [varianteActual, setVarianteActual] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [historial, setHistorial] = useState([]);
  const [posActual, setPosActual] = useState(0);
  const [notaActual, setNotaActual] = useState('');
  const [nombreNueva, setNombreNueva] = useState('');
  const [colorNueva, setColorNueva] = useState('white');
  const [vista, setVista] = useState('lista');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [optionSquares, setOptionSquares] = useState({});

  // Refs para acceder al estado actual dentro de handlers sin stale closures
  const gameRef = useRef(game);
  const historialRef = useRef(historial);
  const posActualRef = useRef(posActual);
  const varianteActualRef = useRef(varianteActual);
  const variantesRef = useRef(variantes);

  gameRef.current = game;
  historialRef.current = historial;
  posActualRef.current = posActual;
  varianteActualRef.current = varianteActual;
  variantesRef.current = variantes;

  const fenActual = game.fen();

  const getLegalMoves = (square, g) => {
    const moves = g.moves({ square, verbose: true });
    const squares = {};
    for (const m of moves) {
      squares[m.to] = {
        background: g.get(m.to)
          ? 'radial-gradient(circle, rgba(255,0,0,0.4) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(212,175,55,0.5) 30%, transparent 30%)',
        borderRadius: '50%',
      };
    }
    return squares;
  };

  const ejecutarMovimiento = (from, to) => {
    const hist = historialRef.current;
    const pos = posActualRef.current;
    const g = gameRef.current;
    const va = varianteActualRef.current;
    const vars = variantesRef.current;

    if (pos < hist.length) return false; // solo al final
    const newGame = new Chess(g.fen());
    const move = newGame.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const newEntry = { san: move.san, from, to, fen: newGame.fen() };
    const newHist = [...hist, newEntry];

    setHistorial(newHist);
    setGame(newGame);
    setPosActual(newHist.length);
    setNotaActual(va?.notas?.[newGame.fen()] || '');
    setSelectedSquare(null);
    setOptionSquares({});

    if (va) {
      const v = { ...va, movimientos: newHist.map(m => ({ from: m.from, to: m.to })) };
      const nuevas = vars.map(x => x.id === v.id ? v : x);
      setVarianteActual(v);
      setVariantes(nuevas);
      guardarVariantes(nuevas);
    }
    return true;
  };

  const onSquareClick = (square) => {
    const g = gameRef.current;
    const pos = posActualRef.current;
    const hist = historialRef.current;
    const va = varianteActualRef.current;
    if (!va || pos < hist.length) return;

    const piece = g.get(square);
    const myColor = va.color === 'white' ? 'w' : 'b';
    const isMyPiece = piece && piece.color === myColor;

    if (!selectedSquare) {
      if (!isMyPiece) return;
      setSelectedSquare(square);
      setOptionSquares(getLegalMoves(square, g));
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setOptionSquares({});
      return;
    }

    if (isMyPiece) {
      setSelectedSquare(square);
      setOptionSquares(getLegalMoves(square, g));
      return;
    }

    const ok = ejecutarMovimiento(selectedSquare, square);
    if (!ok) {
      setSelectedSquare(null);
      setOptionSquares({});
    }
  };

  const onPieceDrop = (from, to) => {
    const pos = posActualRef.current;
    const hist = historialRef.current;
    if (pos < hist.length) return false;
    setSelectedSquare(null);
    setOptionSquares({});
    return ejecutarMovimiento(from, to);
  };

  const customSquareStyles = {
    ...(selectedSquare ? { [selectedSquare]: { background: 'rgba(212,175,55,0.6)' } } : {}),
    ...optionSquares,
  };

  // ── Resto de funciones ──

  const nuevaVariante = () => {
    if (!nombreNueva.trim()) return;
    const v = { id: Date.now(), nombre: nombreNueva.trim(), color: colorNueva, movimientos: [], notas: {} };
    const nuevas = [...variantes, v];
    setVariantes(nuevas);
    guardarVariantes(nuevas);
    abrirVariante(v);
    setNombreNueva('');
  };

  const abrirVariante = (v) => {
    setVarianteActual(v);
    const g = new Chess();
    const hist = [];
    for (const m of v.movimientos) {
      const move = g.move({ from: m.from, to: m.to, promotion: 'q' });
      if (move) hist.push({ san: move.san, from: m.from, to: m.to, fen: g.fen() });
    }
    setGame(g);
    setHistorial(hist);
    setPosActual(hist.length);
    setNotaActual(v.notas?.[g.fen()] || '');
    setSelectedSquare(null);
    setOptionSquares({});
    setVista('editor');
  };

  const eliminarVariante = (id) => {
    const nuevas = variantes.filter(v => v.id !== id);
    setVariantes(nuevas);
    guardarVariantes(nuevas);
    if (varianteActual?.id === id) setVista('lista');
  };

  const guardarNota = () => {
    if (!varianteActual) return;
    const notas = { ...varianteActual.notas };
    if (notaActual.trim()) {
      notas[fenActual] = notaActual.trim();
    } else {
      delete notas[fenActual];
    }
    const v = { ...varianteActual, notas };
    const nuevas = variantes.map(x => x.id === v.id ? v : x);
    setVarianteActual(v);
    setVariantes(nuevas);
    guardarVariantes(nuevas);
  };

  const irAPosicion = (idx) => {
    const g = new Chess();
    for (let i = 0; i < idx; i++) {
      g.move({ from: historial[i].from, to: historial[i].to, promotion: 'q' });
    }
    setGame(g);
    setPosActual(idx);
    setNotaActual(varianteActual?.notas?.[g.fen()] || '');
    setSelectedSquare(null);
    setOptionSquares({});
  };

  const deshacerUltimo = () => {
    if (historial.length === 0) return;
    const newHist = historial.slice(0, -1);
    const g = new Chess();
    for (const m of newHist) g.move({ from: m.from, to: m.to, promotion: 'q' });
    setHistorial(newHist);
    setGame(g);
    setPosActual(newHist.length);
    setNotaActual(varianteActual?.notas?.[g.fen()] || '');
    setSelectedSquare(null);
    setOptionSquares({});

    const v = { ...varianteActual, movimientos: newHist.map(m => ({ from: m.from, to: m.to })) };
    const nuevas = variantes.map(x => x.id === v.id ? v : x);
    setVarianteActual(v);
    setVariantes(nuevas);
    guardarVariantes(nuevas);
  };

  // ── LISTA ──
  if (vista === 'lista') return (
    <div>
      <div className="training-header">
        <h2 style={{ margin: 0 }}>✏️ Editor de Variantes</h2>
        <span style={{ fontSize: 13, color: '#888' }}>Crea y anota tus propias líneas</span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={nombreNueva}
          onChange={e => setNombreNueva(e.target.value)}
          placeholder="Nombre de la variante..."
          onKeyDown={e => e.key === 'Enter' && nuevaVariante()}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 8, border: '1px solid #444', background: '#16213e', color: '#e0e0e0', fontSize: 14 }}
        />
        <select value={colorNueva} onChange={e => setColorNueva(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #444', background: '#16213e', color: '#e0e0e0' }}>
          <option value="white">♔ Blancas</option>
          <option value="black">♚ Negras</option>
        </select>
        <button className="start-btn" style={{ padding: '8px 18px' }} onClick={nuevaVariante}>+ Nueva</button>
      </div>

      {variantes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
          <div style={{ fontSize: 40 }}>✏️</div>
          <p>No tienes variantes guardadas. ¡Crea la primera!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {variantes.map(v => (
            <div key={v.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #333', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#e0e0e0' }}>{v.nombre}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                  {v.color === 'white' ? '♔ Blancas' : '♚ Negras'} · {v.movimientos.length} movimientos · {Object.values(v.notas || {}).filter(Boolean).length} notas
                </div>
              </div>
              <button onClick={() => abrirVariante(v)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #d4af37', background: 'transparent', color: '#d4af37', cursor: 'pointer', fontSize: 13 }}>
                ✏️ Editar
              </button>
              <button onClick={() => eliminarVariante(v.id)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #555', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 13 }}>
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── EDITOR ──
  const notaGuardada = varianteActual?.notas?.[fenActual];
  const alFinal = posActual === historial.length;

  return (
    <div>
      <div className="training-header">
        <div>
          <button onClick={() => setVista('lista')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 4 }}>← Volver a lista</button>
          <h2 style={{ margin: 0, color: '#d4af37' }}>{varianteActual?.nombre}</h2>
          <span style={{ fontSize: 13, color: '#888' }}>{varianteActual?.color === 'white' ? '♔ Blancas' : '♚ Negras'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="color-badge">{historial.length} movimientos</span>
          {!alFinal && <span style={{ fontSize: 12, color: '#ff9800' }}>👁 Solo lectura</span>}
        </div>
      </div>

      <div className="training-layout">
        <div className="board-wrap">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onPieceDrop}
            onSquareClick={onSquareClick}
            customSquareStyles={customSquareStyles}
            boardOrientation={varianteActual?.color || 'white'}
            boardWidth={480}
            arePiecesDraggable={alFinal}
            {...boardProps}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'center' }}>
            <button onClick={() => irAPosicion(0)} disabled={posActual === 0} style={navBtn}>⏮</button>
            <button onClick={() => irAPosicion(Math.max(0, posActual - 1))} disabled={posActual === 0} style={navBtn}>◀</button>
            <button onClick={() => irAPosicion(Math.min(historial.length, posActual + 1))} disabled={posActual === historial.length} style={navBtn}>▶</button>
            <button onClick={() => irAPosicion(historial.length)} disabled={posActual === historial.length} style={navBtn}>⏭</button>
            <button onClick={deshacerUltimo} disabled={historial.length === 0} style={{ ...navBtn, marginLeft: 8, color: '#f44336', borderColor: '#f44336' }}>↩ Deshacer</button>
          </div>
        </div>

        <div className="training-sidebar">
          <div style={{ background: '#16213e', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Línea</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {historial.map((m, i) => (
                <span
                  key={i}
                  onClick={() => irAPosicion(i + 1)}
                  style={{
                    cursor: 'pointer', padding: '2px 6px', borderRadius: 4, fontSize: 13, fontFamily: 'monospace',
                    background: posActual === i + 1 ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)',
                    color: posActual === i + 1 ? '#d4af37' : '#c0c0c0',
                    border: posActual === i + 1 ? '1px solid #d4af37' : '1px solid transparent',
                  }}
                >
                  {i % 2 === 0 && <span style={{ color: '#666', marginRight: 2 }}>{Math.floor(i/2)+1}.</span>}
                  {m.san}
                  {varianteActual?.notas?.[m.fen]?.trim() && <span style={{ color: '#d4af37', marginLeft: 3 }}>💬</span>}
                </span>
              ))}
              {historial.length === 0 && <span style={{ color: '#555', fontSize: 13 }}>Mueve piezas para añadir movimientos</span>}
            </div>
          </div>

          <div style={{ background: '#16213e', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              💬 Nota para esta posición
              {notaGuardada?.trim() && <span style={{ color: '#4caf50', marginLeft: 8 }}>✓ guardada</span>}
            </div>
            <textarea
              value={notaActual}
              onChange={e => setNotaActual(e.target.value)}
              placeholder="Opcional — escribe un plan, idea táctica, advertencia..."
              rows={4}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: 6, color: '#e0e0e0', padding: '8px 10px', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
            />
            <button
              onClick={guardarNota}
              style={{ marginTop: 8, padding: '7px 16px', borderRadius: 6, border: 'none', background: '#d4af37', color: '#1a1a2e', fontWeight: 'bold', cursor: 'pointer', fontSize: 13 }}
            >
              💾 Guardar nota
            </button>
          </div>

          {Object.entries(varianteActual?.notas || {}).filter(([, v]) => v?.trim()).length > 0 && (
            <div style={{ background: '#16213e', borderRadius: 8, padding: 12, marginTop: 12 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📝 Notas guardadas</div>
              {Object.entries(varianteActual.notas).filter(([, v]) => v?.trim()).map(([, nota], i) => (
                <div key={i} style={{ borderBottom: '1px solid #222', paddingBottom: 8, marginBottom: 8, fontSize: 13, color: '#c0c0c0' }}>
                  <span style={{ color: '#666', fontSize: 11, display: 'block', marginBottom: 3 }}>Nota {i + 1}</span>
                  {nota}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  padding: '6px 12px', borderRadius: 6, border: '1px solid #444',
  background: 'transparent', color: '#888', cursor: 'pointer', fontSize: 14,
};
