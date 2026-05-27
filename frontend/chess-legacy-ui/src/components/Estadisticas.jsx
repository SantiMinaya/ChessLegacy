import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';

const CARD = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: '24px 28px',
  marginBottom: 20,
};

const LABEL_STYLE = { fill: 'var(--text-muted)', fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: 8,
  fontSize: 13,
};

export default function Estadisticas({ jugadorId, jugadorNombre, onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/estadisticas/jugador/${jugadorId}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jugadorId]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 16 }}>
        ⏳ Cargando estadísticas de {jugadorNombre}...
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
        No hay estadísticas disponibles para {jugadorNombre}.
      </div>
    );
  }

  const coloresData = [
    { name: 'Blancas', value: stats.distribucionColores?.blancas ?? 0 },
    { name: 'Negras',  value: stats.distribucionColores?.negras  ?? 0 },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: 1400, margin: '0 auto', fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: 24, padding: '10px 20px', cursor: 'pointer',
          background: 'var(--bg-card)', border: '2px solid var(--accent)',
          color: 'var(--accent)', borderRadius: 'var(--border-radius)', fontSize: 15,
        }}
      >
        ← Volver
      </button>

      <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--accent)', marginBottom: 24 }}>
        📊 Estadísticas de {jugadorNombre}
      </h2>

      {/* Resumen */}
      <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 48 }}>♟️</div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>
            {stats.totalPartidas}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
            Partidas Analizadas
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Top aperturas */}
        <div style={CARD}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--accent)', fontFamily: 'Georgia, serif' }}>
            Top 10 Aperturas Más Usadas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.aperturasTop} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="apertura" angle={-40} textAnchor="end" height={90} tick={LABEL_STYLE} />
              <YAxis tick={LABEL_STYLE} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="cantidad" fill="var(--accent)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución colores */}
        <div style={CARD}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--accent)', fontFamily: 'Georgia, serif' }}>
            Distribución de Colores
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={coloresData}
                cx="50%" cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
              >
                <Cell fill="#e8e8e8" stroke="#888" strokeWidth={2} />
                <Cell fill="#2a2a2a" stroke="#888" strokeWidth={2} />
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolución histórica */}
      <div style={{ ...CARD, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', color: 'var(--accent)', fontFamily: 'Georgia, serif' }}>
          📈 Evolución Histórica (Partidas por Año)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={stats.evolucionAnual}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="anio" tick={LABEL_STYLE} />
            <YAxis tick={LABEL_STYLE} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ color: 'var(--text-muted)', fontSize: 12 }} />
            <Line type="monotone" dataKey="cantidad" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Oponentes y variantes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        <div style={CARD}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--accent)', fontFamily: 'Georgia, serif' }}>
            👥 Oponentes Más Frecuentes
          </h3>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {stats.oponentesTop?.map((op, idx) => (
              <div key={idx} style={{
                padding: '10px 4px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>{op.oponente}</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{op.cantidad} partidas</span>
              </div>
            ))}
          </div>
        </div>

        <div style={CARD}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--accent)', fontFamily: 'Georgia, serif' }}>
            📋 Variantes Más Jugadas
          </h3>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {stats.variantesPorApertura?.map((v, idx) => (
              <div key={idx} style={{ padding: '10px 4px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 'bold', fontSize: 14, color: 'var(--text-primary)' }}>{v.apertura}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <span>{v.variante}</span>
                  <span style={{ color: 'var(--accent)' }}>{v.cantidad}×</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
