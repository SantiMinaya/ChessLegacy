import { useState, useEffect } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { chessMasters } from '../data/masters';

const API = 'http://localhost:5000/api/estadisticas/jugador';

export default function ComparadorMaestros() {
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');
  const [statsA, setStatsA] = useState(null);
  const [statsB, setStatsB] = useState(null);
  const [loading, setLoading] = useState(false);

  const masterA = chessMasters.find(m => m.id === Number(idA));
  const masterB = chessMasters.find(m => m.id === Number(idB));

  const comparar = async () => {
    if (!idA || !idB || idA === idB) return;
    setLoading(true);
    try {
      const [rA, rB] = await Promise.all([
        fetch(`${API}/${idA}`).then(r => r.json()),
        fetch(`${API}/${idB}`).then(r => r.json()),
      ]);
      setStatsA(rA);
      setStatsB(rB);
    } catch {}
    setLoading(false);
  };

  const radarData = statsA && statsB ? [
    { stat: 'Partidas', A: Math.min(100, statsA.totalPartidas / 5), B: Math.min(100, statsB.totalPartidas / 5) },
    { stat: 'Rating', A: (masterA?.rating - 2600) / 3, B: (masterB?.rating - 2600) / 3 },
    { stat: 'Aperturas', A: Math.min(100, statsA.aperturasTop?.length * 5 || 0), B: Math.min(100, statsB.aperturasTop?.length * 5 || 0) },
    { stat: 'Variantes', A: Math.min(100, statsA.variantesPorApertura?.length * 3 || 0), B: Math.min(100, statsB.variantesPorApertura?.length * 3 || 0) },
    { stat: 'Oponentes', A: Math.min(100, statsA.oponentesTop?.length * 5 || 0), B: Math.min(100, statsB.oponentesTop?.length * 5 || 0) },
  ] : [];

  const aperturasData = statsA && statsB ? (() => {
    const topA = (statsA.aperturasTop || []).slice(0, 5).map(a => a.apertura);
    const topB = (statsB.aperturasTop || []).slice(0, 5).map(a => a.apertura);
    const all = [...new Set([...topA, ...topB])].slice(0, 6);
    return all.map(ap => ({
      apertura: ap.length > 12 ? ap.slice(0, 12) + '…' : ap,
      [masterA?.name.split(' ').pop()]: statsA.aperturasTop?.find(a => a.apertura === ap)?.cantidad || 0,
      [masterB?.name.split(' ').pop()]: statsB.aperturasTop?.find(a => a.apertura === ap)?.cantidad || 0,
    }));
  })() : [];

  const evolucionData = statsA && statsB ? (() => {
    const aniosA = Object.fromEntries((statsA.evolucionAnual || []).map(e => [e.anio, e.cantidad]));
    const aniosB = Object.fromEntries((statsB.evolucionAnual || []).map(e => [e.anio, e.cantidad]));
    const allAnios = [...new Set([...Object.keys(aniosA), ...Object.keys(aniosB)])].sort();
    return allAnios.map(a => ({
      anio: a,
      [masterA?.name.split(' ').pop()]: aniosA[a] || 0,
      [masterB?.name.split(' ').pop()]: aniosB[a] || 0,
    }));
  })() : [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ color: '#d4af37', margin: '0 0 8px' }}>⚔️ Comparar Maestros</h2>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>Selecciona dos maestros para comparar sus estadísticas</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {[{ val: idA, set: setIdA, label: 'Maestro A', color: '#d4af37' }, { val: idB, set: setIdB, label: 'Maestro B', color: '#2196f3' }].map(({ val, set, label, color }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, color }}>{label}</label>
            <select value={val} onChange={e => set(e.target.value)} style={selectStyle}>
              <option value="">-- Selecciona --</option>
              {chessMasters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        ))}
        <button onClick={comparar} disabled={!idA || !idB || idA === idB || loading} style={{ padding: '10px 20px', background: '#d4af37', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', color: '#1a1a2e' }}>
          {loading ? '⏳...' : '⚔️ Comparar'}
        </button>
      </div>

      {statsA && statsB && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header comparativo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
            <MasterCard master={masterA} stats={statsA} color="#d4af37" />
            <span style={{ color: '#555', fontSize: 24, fontWeight: 'bold' }}>VS</span>
            <MasterCard master={masterB} stats={statsB} color="#2196f3" align="right" />
          </div>

          {/* Radar */}
          <div style={panelStyle}>
            <h4 style={h4Style}>Comparativa general</h4>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: '#888', fontSize: 12 }} />
                <Radar name={masterA?.name.split(' ').pop()} dataKey="A" stroke="#d4af37" fill="#d4af37" fillOpacity={0.2} />
                <Radar name={masterB?.name.split(' ').pop()} dataKey="B" stroke="#2196f3" fill="#2196f3" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Aperturas */}
          {aperturasData.length > 0 && (
            <div style={panelStyle}>
              <h4 style={h4Style}>Aperturas favoritas</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={aperturasData}>
                  <XAxis dataKey="apertura" tick={{ fill: '#666', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#666', fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={masterA?.name.split(' ').pop()} fill="#d4af37" radius={3} />
                  <Bar dataKey={masterB?.name.split(' ').pop()} fill="#2196f3" radius={3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Evolución */}
          {evolucionData.length > 0 && (
            <div style={panelStyle}>
              <h4 style={h4Style}>Partidas por año</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={evolucionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="anio" tick={{ fill: '#666', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#666', fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={masterA?.name.split(' ').pop()} stroke="#d4af37" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey={masterB?.name.split(' ').pop()} stroke="#2196f3" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MasterCard({ master, stats, color, align = 'left' }) {
  if (!master) return null;
  return (
    <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', gap: 4, alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <img src={master.photo} alt={master.name} style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${color}`, objectFit: 'cover' }} />
      <span style={{ fontWeight: 'bold', color: '#e0e0e0', fontSize: 15 }}>{master.name}</span>
      <span style={{ fontSize: 12, color }}>{master.rating} ELO</span>
      <span style={{ fontSize: 12, color: '#666' }}>{stats.totalPartidas} partidas</span>
    </div>
  );
}

const panelStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px' };
const h4Style = { color: '#d4af37', margin: '0 0 12px', fontSize: 13 };
const selectStyle = { padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,175,55,0.3)', color: '#e0e0e0', fontSize: 14, cursor: 'pointer' };
