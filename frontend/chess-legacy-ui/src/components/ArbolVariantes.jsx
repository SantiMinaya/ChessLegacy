import { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { aperturasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';

// Construye el árbol de variantes a partir de una lista de líneas
function construirArbol(lineas) {
  const raiz = { id: 'root', san: null, children: {}, variantes: [] };

  for (const linea of lineas) {
    let nodo = raiz;
    for (let i = 0; i < linea.moves.length; i++) {
      const san = linea.moves[i];
      if (!nodo.children[san]) {
        nodo.children[san] = { id: `${nodo.id}-${san}`, san, children: {}, variantes: [], ply: i + 1 };
      }
      nodo = nodo.children[san];
      if (i === linea.moves.length - 1) {
        nodo.variantes.push({ apertura: linea.apertura, variante: linea.variante });
      }
    }
  }
  return raiz;
}

// Renderiza el árbol como lista anidada
function NodoArbol({ nodo, profundidad = 0, onSelect, seleccionado, ply }) {
  const [expandido, setExpandido] = useState(profundidad < 2);
  const hijos = Object.values(nodo.children);
  const esBlanca = ply % 2 === 1;
  const numMov = Math.ceil(ply / 2);
  const esSeleccionado = seleccionado === nodo.id;

  if (!nodo.san) {
    return (
      <div>
        {hijos.map(h => (
          <NodoArbol key={h.id} nodo={h} profundidad={profundidad} onSelect={onSelect} seleccionado={seleccionado} ply={1} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: profundidad > 0 ? 16 : 0 }}>
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          padding: '3px 8px', borderRadius: 6, marginBottom: 2,
          background: esSeleccionado ? 'rgba(212,175,55,0.2)' : 'transparent',
          border: esSeleccionado ? '1px solid rgba(212,175,55,0.5)' : '1px solid transparent',
          transition: 'all 0.15s',
        }}
        onClick={() => { onSelect(nodo); setExpandido(e => !e); }}
        onMouseEnter={e => { if (!esSeleccionado) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { if (!esSeleccionado) e.currentTarget.style.background = 'transparent'; }}
      >
        {esBlanca && <span style={{ color: '#555', fontSize: 11, minWidth: 24 }}>{numMov}.</span>}
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 14, color: esSeleccionado ? '#d4af37' : esBlanca ? '#e0e0e0' : '#aaa' }}>
          {nodo.san}
        </span>
        {nodo.variantes.length > 0 && (
          <span style={{ fontSize: 10, background: 'rgba(212,175,55,0.2)', color: '#d4af37', padding: '1px 5px', borderRadius: 10 }}>
            {nodo.variantes[0].variante || nodo.variantes[0].apertura}
          </span>
        )}
        {hijos.length > 0 && (
          <span style={{ color: '#555', fontSize: 10 }}>{expandido ? '▼' : '▶'} {hijos.length}</span>
        )}
      </div>

      {expandido && hijos.length > 0 && (
        <div style={{ borderLeft: '1px solid #2a2a4a', marginLeft: 12, paddingLeft: 4 }}>
          {hijos.map(h => (
            <NodoArbol key={h.id} nodo={h} profundidad={profundidad + 1} onSelect={onSelect} seleccionado={seleccionado} ply={ply + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArbolVariantes() {
  const { boardProps } = useBoardTheme();
  const [aperturas, setAperturas] = useState([]);
  const [aperturaSel, setAperturaSel] = useState('');
  const [lineas, setLineas] = useState([]);
  const [arbol, setArbol] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [nodoSel, setNodoSel] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    aperturasAPI.getAll().then(r => setAperturas(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!aperturaSel) { setLineas([]); setArbol(null); return; }
    setCargando(true);
    aperturasAPI.getVariantes(aperturaSel).then(async rV => {
      const todas = [];
      for (const va of rV.data) {
        try {
          const rM = await aperturasAPI.getAprendizaje(aperturaSel, va);
          todas.push({ apertura: aperturaSel, variante: va, moves: rM.data.movimientos || [] });
        } catch {}
      }
      setLineas(todas);
      setArbol(construirArbol(todas));
      setNodoSel(null);
      setGame(new Chess());
    }).catch(() => {}).finally(() => setCargando(false));
  }, [aperturaSel]);

  const seleccionarNodo = (nodo) => {
    setNodoSel(nodo);
    // Reconstruir la posición hasta este nodo
    const path = [];
    const buscarPath = (n, objetivo, camino) => {
      if (n.id === objetivo.id) { path.push(...camino); return true; }
      for (const h of Object.values(n.children)) {
        if (buscarPath(h, objetivo, [...camino, h.san])) return true;
      }
      return false;
    };
    if (arbol) buscarPath(arbol, nodo, []);

    const g = new Chess();
    for (const san of path) {
      try { g.move(san); } catch { break; }
    }
    setGame(g);
  };

  const aperturasFiltered = aperturas.filter(a => a.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div>
      <div className="training-header">
        <div>
          <h2 style={{ margin: 0 }}>🌳 Árbol de Variantes</h2>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>Navega las líneas de cada apertura como un árbol interactivo</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar apertura..."
          style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8, border: '1px solid #444', background: '#16213e', color: '#e0e0e0', fontSize: 14 }}
        />
        <select
          value={aperturaSel}
          onChange={e => setAperturaSel(e.target.value)}
          style={{ flex: 2, minWidth: 200, padding: '8px 12px', borderRadius: 8, border: '1px solid #444', background: '#16213e', color: '#e0e0e0', fontSize: 14 }}
        >
          <option value="">-- Selecciona una apertura --</option>
          {aperturasFiltered.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {cargando && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>⏳ Cargando variantes...</div>}

      {arbol && !cargando && (
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Árbol */}
          <div style={{ flex: 1, minWidth: 280, background: '#0d1117', border: '1px solid #2a2a4a', borderRadius: 12, padding: 16, maxHeight: 520, overflowY: 'auto' }}>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              {lineas.length} variantes · {aperturaSel}
            </div>
            <NodoArbol nodo={arbol} onSelect={seleccionarNodo} seleccionado={nodoSel?.id} ply={0} />
          </div>

          {/* Tablero + info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            <Chessboard
              position={game.fen()}
              arePiecesDraggable={false}
              boardWidth={360}
              {...boardProps}
            />

            {nodoSel && nodoSel.variantes.length > 0 && (
              <div style={{ background: '#16213e', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Variante</div>
                {nodoSel.variantes.map((v, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#e0e0e0' }}>
                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{v.apertura}</span>
                    {v.variante && <span style={{ color: '#888' }}> — {v.variante}</span>}
                  </div>
                ))}
              </div>
            )}

            {nodoSel && (
              <div style={{ background: '#16213e', border: '1px solid #333', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Movimiento seleccionado</div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#d4af37', fontWeight: 'bold' }}>{nodoSel.san}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Jugada {nodoSel.ply}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!aperturaSel && !cargando && (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 48 }}>🌳</div>
          <p>Selecciona una apertura para ver su árbol de variantes</p>
        </div>
      )}
    </div>
  );
}
