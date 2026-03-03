import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function Estadisticas({ jugadorId, jugadorNombre, onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, [jugadorId]);

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/estadisticas/jugador/${jugadorId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando estadísticas...</div>;
  }

  if (!stats) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No hay datos disponibles</div>;
  }

  const coloresData = [
    { name: 'Blancas', value: stats.distribucionColores.blancas },
    { name: 'Negras', value: stats.distribucionColores.negras }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}>← Volver</button>
      <h2>Estadísticas de {jugadorNombre}</h2>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Resumen General</h3>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a90e2' }}>
          {stats.totalPartidas} partidas analizadas
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Top 10 Aperturas Más Usadas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.aperturasTop}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="apertura" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#4a90e2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Distribución de Colores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={coloresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {coloresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#ffffff' : '#000000'} stroke="#333" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>Evolución Histórica (Partidas por Año)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.evolucionAnual}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="anio" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cantidad" stroke="#4a90e2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Oponentes Más Frecuentes</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {stats.oponentesTop.map((oponente, idx) => (
              <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span>{oponente.oponente}</span>
                <span style={{ fontWeight: 'bold', color: '#4a90e2' }}>{oponente.cantidad} partidas</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Variantes Más Jugadas</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {stats.variantesPorApertura.map((variante, idx) => (
              <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 'bold' }}>{variante.apertura}</div>
                <div style={{ fontSize: '12px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{variante.variante}</span>
                  <span style={{ color: '#4a90e2' }}>{variante.cantidad} veces</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
