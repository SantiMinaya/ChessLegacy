import { useState, useEffect } from 'react';
import { aperturasAPI, progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ArbolAperturas.css';

const NODE_W = 160;
const NODE_H = 44;
const H_GAP = 200;
const V_GAP = 64;

// Estado de progreso por variante considerando ambos colores
function getEstadoColor(prog) {
  if (!prog || prog.sesiones === 0) return 'sin-empezar';
  return prog.sesionesPerfectas >= 10 ? 'completada' : 'a-medias';
}

function getEstado(progWhite, progBlack) {
  const w = getEstadoColor(progWhite);
  const b = getEstadoColor(progBlack);
  if (w === 'completada' && b === 'completada') return 'completada';
  if (w === 'sin-empezar' && b === 'sin-empezar') return 'sin-empezar';
  return 'a-medias';
}

const ESTADO_ICON = { 'sin-empezar': '○', 'a-medias': '◑', 'completada': '●' };

export default function ArbolAperturas({ onPracticar, refreshKey = 0 }) {
  const { user } = useAuth();
  const [aperturas, setAperturas] = useState([]);
  const [selected, setSelected] = useState('');
  const [variantes, setVariantes] = useState([]);
  const [selectedVariante, setSelectedVariante] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progresos, setProgresos] = useState([]);
  const [totalVariantes, setTotalVariantes] = useState(0);

  useEffect(() => {
    aperturasAPI.getAll().then(r => {
      setAperturas(r.data);
      // Cargar variantes de todas las aperturas para el resumen global
      Promise.all(r.data.map(a => aperturasAPI.getVariantes(a).then(rv => rv.data.length).catch(() => 0)))
        .then(counts => setTotalVariantes(counts.reduce((a, b) => a + b, 0)));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.token) return;
    progresoAPI.get(user.token)
      .then(r => setProgresos(r.data.progresos || []))
      .catch(() => {});
  }, [user, refreshKey]);

  useEffect(() => {
    if (!selected) { setVariantes([]); setSelectedVariante(null); setMovimientos([]); return; }
    aperturasAPI.getVariantes(selected)
      .then(r => setVariantes(r.data))
      .catch(() => setVariantes([]));
    setSelectedVariante(null);
    setMovimientos([]);
  }, [selected]);

  const getProgreso = (variante, color) =>
    progresos.find(p => p.apertura === selected && p.variante === variante && p.color === color);

  const getEstadoVariante = (variante) =>
    getEstado(getProgreso(variante, 'white'), getProgreso(variante, 'black'));

  const handleVarianteClick = async (variante) => {
    if (selectedVariante === variante) { setSelectedVariante(null); setMovimientos([]); return; }
    setSelectedVariante(variante);
    setLoading(true);
    try {
      const r = await aperturasAPI.getAprendizaje(selected, variante);
      setMovimientos(r.data.movimientos || []);
    } catch { setMovimientos([]); }
    setLoading(false);
  };

  // Resumen global: una variante completada = ambos colores con 3 sesiones perfectas
  const aperturasUnicas = [...new Set(
    progresos.filter(p => !p.apertura.startsWith('__')).map(p => `${p.apertura}|||${p.variante}`)
  )];
  const completadas = aperturasUnicas.filter(key => {
    const [ap, va] = key.split('|||');
    const w = progresos.find(p => p.apertura === ap && p.variante === va && p.color === 'white');
    const b = progresos.find(p => p.apertura === ap && p.variante === va && p.color === 'black');
    return getEstadoColor(w) === 'completada' && getEstadoColor(b) === 'completada';
  }).length;
  const enProgreso = aperturasUnicas.filter(key => {
    const [ap, va] = key.split('|||');
    const w = progresos.find(p => p.apertura === ap && p.variante === va && p.color === 'white');
    const b = progresos.find(p => p.apertura === ap && p.variante === va && p.color === 'black');
    const e = getEstado(w, b);
    return e === 'a-medias';
  }).length;
  const globalPct = totalVariantes > 0 ? Math.round(completadas / totalVariantes * 100) : 0;

  // Conteo de estados para la apertura seleccionada
  const counts = variantes.reduce((acc, v) => {
    const e = getEstadoVariante(v);
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});

  // Layout: raíz a la izquierda, variantes a la derecha
  const rootX = 24;
  const rootY = variantes.length > 0
    ? ((variantes.length - 1) * V_GAP) / 2
    : 0;

  const svgH = Math.max(NODE_H + 16, variantes.length * V_GAP + NODE_H);
  const svgW = variantes.length > 0 ? rootX + NODE_W + H_GAP + NODE_W + 24 : rootX + NODE_W + 24;

  return (
    <div className="arbol-aperturas">
      <h2>📊 Progreso de Aperturas</h2>
      <p className="arbol-subtitle">Selecciona una apertura para ver el progreso de cada variante</p>

      <div className="arbol-selector">
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">-- Selecciona una apertura --</option>
          {aperturas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Resumen global */}
      {user && totalVariantes > 0 && (
        <div className="arbol-resumen-global">
          <div className="resumen-barra-wrap">
            <div className="resumen-barra">
              <div className="resumen-fill completada" style={{ width: `${globalPct}%` }} />
              <div className="resumen-fill a-medias" style={{ width: `${Math.round(enProgreso / totalVariantes * 100)}%` }} />
            </div>
            <span className="resumen-pct">{globalPct}%</span>
          </div>
          <div className="resumen-stats">
            <span className="leyenda-item completada">● {completadas} completadas</span>
            <span className="leyenda-item a-medias">◑ {enProgreso} en progreso</span>
            <span className="leyenda-item sin-empezar">○ {totalVariantes - completadas - enProgreso} sin empezar</span>
            <span className="resumen-total">de {totalVariantes} variantes totales</span>
          </div>
        </div>
      )}

      {selected && (
        <div className="arbol-container">
          {variantes.length > 0 && (
            <div className="arbol-leyenda">
              <span className="leyenda-item sin-empezar">○ Sin empezar ({counts['sin-empezar'] || 0})</span>
              <span className="leyenda-item a-medias">◑ En progreso ({counts['a-medias'] || 0})</span>
              <span className="leyenda-item completada">● Completada ({counts['completada'] || 0})</span>
            </div>
          )}
          <svg width={svgW} height={svgH} className="arbol-svg">
            {/* Líneas desde raíz a variantes */}
            {variantes.map((v, i) => {
              const estado = getEstadoVariante(v);
              const vY = i * V_GAP + NODE_H / 2;
              const rY = rootY + NODE_H / 2;
              const rX2 = rootX + NODE_W;
              const vX1 = rootX + NODE_W + H_GAP;
              const mx = rX2 + (vX1 - rX2) / 2;
              return (
                <path
                  key={v}
                  d={`M ${rX2} ${rY} C ${mx} ${rY}, ${mx} ${vY}, ${vX1} ${vY}`}
                  className={`arbol-branch ${selectedVariante === v ? 'active' : ''} branch-${estado}`}
                />
              );
            })}

            {/* Nodo raíz */}
            <g transform={`translate(${rootX}, ${rootY})`}>
              <rect width={NODE_W} height={NODE_H} rx="8" className="arbol-node root-node" />
              <text x={NODE_W / 2} y={NODE_H / 2 + 1} textAnchor="middle" dominantBaseline="middle" className="arbol-node-text root-text">
                {selected.length > 18 ? selected.slice(0, 16) + '…' : selected}
              </text>
            </g>

            {/* Nodos variantes */}
            {variantes.map((v, i) => {
              const vY = i * V_GAP;
              const vX = rootX + NODE_W + H_GAP;
              const isActive = selectedVariante === v;
              const estado = getEstadoVariante(v);
              const progW = getProgreso(v, 'white');
              const progB = getProgreso(v, 'black');
              const estadoW = getEstadoColor(progW);
              const estadoB = getEstadoColor(progB);
              return (
                <g
                  key={v}
                  transform={`translate(${vX}, ${vY})`}
                  onClick={() => handleVarianteClick(v)}
                  className="arbol-variante-group"
                >
                  <rect width={NODE_W} height={NODE_H} rx="8" className={`arbol-node variante-node ${isActive ? 'active' : ''} node-${estado}`} />
                  <text x={10} y={NODE_H / 2 - 6} dominantBaseline="middle" className={`arbol-node-text ${isActive ? 'active' : ''}`} fontSize="11">
                    {v.length > 16 ? v.slice(0, 14) + '…' : v}
                  </text>
                  {/* Indicadores de color blancas/negras */}
                  <text x={10} y={NODE_H / 2 + 9} dominantBaseline="middle" className={`arbol-estado-text estado-${estadoW}`} fontSize="9">
                    ♔ {estadoW === 'completada' ? '✓✓✓' : estadoW === 'a-medias' ? `${progW?.sesionesPerfectas ?? 0}/10` : '—'}
                  </text>
                  <text x={NODE_W / 2 + 4} y={NODE_H / 2 + 9} dominantBaseline="middle" className={`arbol-estado-text estado-${estadoB}`} fontSize="9">
                    ♚ {estadoB === 'completada' ? '✓✓✓' : estadoB === 'a-medias' ? `${progB?.sesionesPerfectas ?? 0}/10` : '—'}
                  </text>
                </g>
              );
            })}

            {variantes.length === 0 && selected && (
              <text x={rootX + NODE_W + 24} y={rootY + NODE_H / 2 + 1} dominantBaseline="middle" className="arbol-empty-text">
                Sin variantes registradas
              </text>
            )}
          </svg>

          {/* Panel de movimientos */}
          {selectedVariante && (
            <div className="arbol-moves-panel">
              <div className="arbol-moves-header">
                <h3>{selected} — {selectedVariante}</h3>
                {onPracticar && (
                  <button className="arbol-practicar-btn" onClick={() => onPracticar(selected, selectedVariante)}>
                    🚀 Practicar
                  </button>
                )}
              </div>
              {loading ? (
                <span className="arbol-loading">Cargando...</span>
              ) : (
                <div className="arbol-moves-list">
                  {movimientos.map((mv, i) => (
                    <span key={i} className="arbol-move">
                      {i % 2 === 0 && <span className="arbol-move-num">{Math.floor(i / 2) + 1}.</span>}
                      {mv}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
