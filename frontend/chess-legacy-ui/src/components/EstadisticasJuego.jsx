import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const COLORS = ['#d4af37', '#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#e91e63'];

export default function EstadisticasJuego({ partidas }) {
  const stats = useMemo(() => {
    if (!partidas.length) return null;

    // Winrate por maestro
    const porMaestro = {};
    partidas.forEach(p => {
      if (!porMaestro[p.maestro]) porMaestro[p.maestro] = { wins: 0, draws: 0, losses: 0, total: 0 };
      porMaestro[p.maestro].total++;
      if (p.resultado === 'win') porMaestro[p.maestro].wins++;
      else if (p.resultado === 'draw') porMaestro[p.maestro].draws++;
      else porMaestro[p.maestro].losses++;
    });

    const winratePorMaestro = Object.entries(porMaestro).map(([maestro, d]) => ({
      maestro: maestro.split(' ').pop(), // apellido
      winrate: Math.round((d.wins / d.total) * 100),
      wins: d.wins, draws: d.draws, losses: d.losses, total: d.total,
    })).sort((a, b) => b.winrate - a.winrate);

    // Resultado global
    const wins = partidas.filter(p => p.resultado === 'win').length;
    const draws = partidas.filter(p => p.resultado === 'draw').length;
    const losses = partidas.filter(p => p.resultado === 'loss').length;

    // Maestro más derrotado
    const maestroMasGanado = winratePorMaestro[0];

    // Maestro más difícil
    const maestroMasDificil = [...winratePorMaestro].sort((a, b) => a.winrate - b.winrate)[0];

    // Media de movimientos
    const mediaMovimientos = Math.round(partidas.reduce((s, p) => s + p.totalMovimientos, 0) / partidas.length);

    // Partidas por mes (últimos 6 meses)
    const porMes = {};
    partidas.forEach(p => {
      const d = new Date(p.fechaJugada);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      porMes[key] = (porMes[key] || 0) + 1;
    });
    const meses = Object.entries(porMes).sort().slice(-6).map(([mes, n]) => ({ mes: mes.slice(5), partidas: n }));

    return { winratePorMaestro, wins, draws, losses, maestroMasGanado, maestroMasDificil, mediaMovimientos, meses };
  }, [partidas]);

  if (!stats) return <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>Aún no has jugado partidas contra maestros.</p>;

  const pieData = [
    { name: 'Victorias', value: stats.wins, color: '#4caf50' },
    { name: 'Tablas', value: stats.draws, color: '#ff9800' },
    { name: 'Derrotas', value: stats.losses, color: '#f44336' },
  ].filter(d => d.value > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
        {[
          { label: 'Partidas', value: partidas.length, color: '#d4af37' },
          { label: 'Victorias', value: stats.wins, color: '#4caf50' },
          { label: 'Tablas', value: stats.draws, color: '#ff9800' },
          { label: 'Derrotas', value: stats.losses, color: '#f44336' },
          { label: 'Winrate', value: `${Math.round((stats.wins / partidas.length) * 100)}%`, color: '#d4af37' },
          { label: 'Media movs.', value: stats.mediaMovimientos, color: '#888' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Pie resultados */}
        <div style={panelStyle}>
          <h4 style={h4Style}>Resultados globales</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Winrate por maestro */}
        <div style={panelStyle}>
          <h4 style={h4Style}>Winrate por maestro</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.winratePorMaestro} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#666', fontSize: 11 }} />
              <YAxis type="category" dataKey="maestro" tick={{ fill: '#c0c0c0', fontSize: 11 }} width={60} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="winrate" radius={4}>
                {stats.winratePorMaestro.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Partidas por mes */}
      {stats.meses.length > 1 && (
        <div style={panelStyle}>
          <h4 style={h4Style}>Partidas por mes</h4>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={stats.meses}>
              <XAxis dataKey="mes" tick={{ fill: '#666', fontSize: 11 }} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="partidas" fill="#d4af37" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {stats.maestroMasGanado && (
          <div style={{ ...panelStyle, borderColor: 'rgba(76,175,80,0.3)' }}>
            <div style={{ fontSize: 11, color: '#4caf50', textTransform: 'uppercase', marginBottom: 4 }}>Maestro más derrotado</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#e0e0e0' }}>{stats.maestroMasGanado.maestro}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{stats.maestroMasGanado.wins} victorias de {stats.maestroMasGanado.total}</div>
          </div>
        )}
        {stats.maestroMasDificil && (
          <div style={{ ...panelStyle, borderColor: 'rgba(244,67,54,0.3)' }}>
            <div style={{ fontSize: 11, color: '#f44336', textTransform: 'uppercase', marginBottom: 4 }}>Maestro más difícil</div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#e0e0e0' }}>{stats.maestroMasDificil.maestro}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{stats.maestroMasDificil.winrate}% winrate</div>
          </div>
        )}
      </div>
    </div>
  );
}

const panelStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px' };
const h4Style = { color: '#d4af37', margin: '0 0 12px', fontSize: 13 };
