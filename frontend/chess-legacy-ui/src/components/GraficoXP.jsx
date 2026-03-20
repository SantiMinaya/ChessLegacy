import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function GraficoXP({ progresos, xpActual }) {
  // Simulamos evolución XP a partir de las sesiones con sus fechas
  const data = useMemo(() => {
    if (!progresos.length) return [];

    // Agrupar aciertos por semana
    const porSemana = {};
    progresos.forEach(p => {
      const fecha = new Date(p.ultimaSesion || Date.now());
      // Semana del año
      const inicio = new Date(fecha);
      inicio.setDate(inicio.getDate() - inicio.getDay());
      const key = inicio.toISOString().slice(0, 10);
      porSemana[key] = (porSemana[key] || 0) + (p.sesiones * 10 + p.aciertos);
    });

    const semanas = Object.entries(porSemana).sort(([a], [b]) => a.localeCompare(b));
    let acumulado = 0;
    return semanas.slice(-12).map(([fecha, xp]) => {
      acumulado += xp;
      return {
        semana: fecha.slice(5), // MM-DD
        xp: acumulado,
      };
    });
  }, [progresos]);

  if (data.length < 2) return (
    <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
      Completa más sesiones para ver tu evolución de XP
    </p>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Últimas 12 semanas</span>
        <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{xpActual} XP total</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="semana" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text-muted)' }}
            itemStyle={{ color: 'var(--accent)' }}
          />
          <Line type="monotone" dataKey="xp" stroke="var(--accent)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
