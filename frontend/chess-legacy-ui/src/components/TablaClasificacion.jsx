import { useState, useEffect } from 'react';
import { progresoAPI } from '../services/api';
import { getNivel } from '../data/niveles';

export default function TablaClasificacion({ miId }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progresoAPI.getClasificacion()
      .then(r => setRanking(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>⏳ Cargando clasificación...</p>;
  if (!ranking.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Aún no hay usuarios registrados.</p>;

  const medallas = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ranking.map((u, i) => {
        const nivel = getNivel(u.xp);
        const esMio = u.id === miId;
        return (
          <div key={u.id} style={{
            display: 'grid', gridTemplateColumns: '32px 40px 1fr auto auto',
            alignItems: 'center', gap: 12,
            background: esMio ? 'rgba(212,175,55,0.12)' : 'var(--bg-card)',
            border: `1px solid ${esMio ? 'var(--accent)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--border-radius)', padding: '10px 14px',
            transition: 'all var(--transition)',
          }}>
            <span style={{ fontWeight: 'bold', color: i < 3 ? undefined : 'var(--text-muted)', fontSize: i < 3 ? 20 : 14 }}>
              {i < 3 ? medallas[i] : `#${i + 1}`}
            </span>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: u.foto ? 'transparent' : 'var(--bg-secondary)',
              border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, overflow: 'hidden', flexShrink: 0,
            }}>
              {u.foto
                ? <img src={u.foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '♟️'}
            </div>
            <div>
              <div style={{ fontWeight: esMio ? 'bold' : 'normal', color: 'var(--text-primary)', fontSize: 14 }}>
                {u.username} {esMio && <span style={{ color: 'var(--accent)', fontSize: 11 }}>(tú)</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{nivel.emoji} {nivel.nombre}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: 15 }}>{u.xp} XP</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.victorias}V / {u.partidas}P</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#ff6b35', fontSize: 13 }}>🔥 {u.rachaActual}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.logros} logros</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
