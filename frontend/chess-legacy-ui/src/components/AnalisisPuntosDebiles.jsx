import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progresoAPI } from '../services/api';

export default function AnalisisPuntosDebiles() {
  const { user } = useAuth();
  const [partidas, setPartidas] = useState([]);
  const [progresos, setProgresos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([
      progresoAPI.getPartidas(user.token),
      progresoAPI.get(user.token),
    ]).then(([rP, rPr]) => {
      setPartidas(rP.data);
      setProgresos(rPr.data.progresos || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>⏳ Analizando...</p>;

  // ── Análisis de partidas ──
  const totalPartidas = partidas.length;
  const victorias = partidas.filter(p => p.resultado === 'win').length;
  const derrotas  = partidas.filter(p => p.resultado === 'loss').length;
  const tablas    = partidas.filter(p => p.resultado === 'draw').length;
  const winrate   = totalPartidas > 0 ? Math.round((victorias / totalPartidas) * 100) : 0;

  // Winrate por maestro
  const porMaestro = {};
  partidas.forEach(p => {
    if (!porMaestro[p.maestro]) porMaestro[p.maestro] = { win: 0, loss: 0, draw: 0 };
    porMaestro[p.maestro][p.resultado]++;
  });
  const maestrosOrdenados = Object.entries(porMaestro)
    .map(([nombre, stats]) => {
      const total = stats.win + stats.loss + stats.draw;
      return { nombre, ...stats, total, wr: Math.round((stats.win / total) * 100) };
    })
    .sort((a, b) => a.wr - b.wr); // peores primero

  // Winrate con blancas vs negras
  const conBlancas = partidas.filter(p => p.colorJugador === 'white');
  const conNegras  = partidas.filter(p => p.colorJugador === 'black');
  const wrBlancas  = conBlancas.length > 0 ? Math.round((conBlancas.filter(p => p.resultado === 'win').length / conBlancas.length) * 100) : null;
  const wrNegras   = conNegras.length  > 0 ? Math.round((conNegras.filter(p => p.resultado === 'win').length  / conNegras.length)  * 100) : null;

  // ── Análisis de aperturas ──
  const aperturasConProblemas = progresos
    .filter(p => !p.apertura.startsWith('__') && p.intentos > 0)
    .map(p => ({
      apertura: p.apertura,
      variante: p.variante,
      color: p.color,
      precision: Math.round((p.aciertos / p.intentos) * 100),
      sesiones: p.sesiones,
      sesionesPerfectas: p.sesionesPerfectas,
    }))
    .filter(p => p.precision < 70)
    .sort((a, b) => a.precision - b.precision)
    .slice(0, 8);

  // Aperturas más practicadas
  const masEstudiadas = progresos
    .filter(p => !p.apertura.startsWith('__'))
    .sort((a, b) => b.sesiones - a.sesiones)
    .slice(0, 5);

  // Recomendaciones
  const recomendaciones = [];
  if (wrBlancas !== null && wrNegras !== null) {
    if (wrBlancas < wrNegras - 15) recomendaciones.push({ tipo: 'warning', msg: `Tu winrate con blancas (${wrBlancas}%) es significativamente menor que con negras (${wrNegras}%). Practica más aperturas con blancas.` });
    if (wrNegras < wrBlancas - 15)  recomendaciones.push({ tipo: 'warning', msg: `Tu winrate con negras (${wrNegras}%) es significativamente menor que con blancas (${wrBlancas}%). Practica más defensas.` });
  }
  if (aperturasConProblemas.length > 0) {
    recomendaciones.push({ tipo: 'info', msg: `Tienes ${aperturasConProblemas.length} variantes con precisión menor al 70%. Repásalas en el modo Aprender.` });
  }
  if (maestrosOrdenados.length > 0 && maestrosOrdenados[0].wr < 30) {
    recomendaciones.push({ tipo: 'warning', msg: `Tienes dificultades contra ${maestrosOrdenados[0].nombre} (${maestrosOrdenados[0].wr}% winrate). Estudia su estilo de juego.` });
  }
  if (totalPartidas < 5) {
    recomendaciones.push({ tipo: 'info', msg: 'Juega más partidas para obtener un análisis más preciso.' });
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ color: '#d4af37', margin: '0 0 6px' }}>🔎 Análisis de Puntos Débiles</h2>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 28px' }}>Basado en tus {totalPartidas} partidas y sesiones de entrenamiento</p>

      {/* Recomendaciones */}
      {recomendaciones.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#d4af37', margin: '0 0 12px', fontSize: 15 }}>💡 Recomendaciones</h3>
          {recomendaciones.map((r, i) => (
            <div key={i} style={{
              background: r.tipo === 'warning' ? 'rgba(255,152,0,0.1)' : 'rgba(33,150,243,0.1)',
              border: `1px solid ${r.tipo === 'warning' ? '#ff9800' : '#2196f3'}`,
              borderRadius: 8, padding: '12px 14px', marginBottom: 8, fontSize: 14, color: '#e0e0e0',
            }}>
              {r.tipo === 'warning' ? '⚠️' : 'ℹ️'} {r.msg}
            </div>
          ))}
        </div>
      )}

      {/* Stats generales */}
      {totalPartidas > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#d4af37', margin: '0 0 12px', fontSize: 15 }}>📊 Rendimiento general</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
            {[
              ['Winrate', `${winrate}%`, winrate >= 50 ? '#4caf50' : '#f44336'],
              ['Victorias', victorias, '#4caf50'],
              ['Derrotas', derrotas, '#f44336'],
              ['Tablas', tablas, '#ff9800'],
              ...(wrBlancas !== null ? [['♔ Blancas', `${wrBlancas}%`, wrBlancas >= 50 ? '#4caf50' : '#f44336']] : []),
              ...(wrNegras !== null  ? [['♚ Negras',  `${wrNegras}%`,  wrNegras  >= 50 ? '#4caf50' : '#f44336']] : []),
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #333', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color }}>{val}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winrate por maestro */}
      {maestrosOrdenados.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#d4af37', margin: '0 0 12px', fontSize: 15 }}>👑 Rendimiento por maestro</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {maestrosOrdenados.map(m => (
              <div key={m.nombre} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 'bold', fontSize: 14 }}>{m.nombre}</span>
                  <span style={{ color: m.wr >= 50 ? '#4caf50' : m.wr >= 30 ? '#ff9800' : '#f44336', fontWeight: 'bold' }}>{m.wr}%</span>
                </div>
                <div style={{ background: '#1a1a2e', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${m.wr}%`, height: '100%', background: m.wr >= 50 ? '#4caf50' : m.wr >= 30 ? '#ff9800' : '#f44336', transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                  {m.win}V · {m.loss}D · {m.draw}T · {m.total} partidas
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aperturas con problemas */}
      {aperturasConProblemas.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: '#d4af37', margin: '0 0 12px', fontSize: 15 }}>📖 Aperturas a mejorar (precisión &lt;70%)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {aperturasConProblemas.map((p, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #333', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: 14 }}>{p.apertura}</span>
                    {p.variante && <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{p.variante}</span>}
                    <span style={{ fontSize: 11, color: p.color === 'white' ? '#f0d9b5' : '#b58863', marginLeft: 8 }}>
                      {p.color === 'white' ? '♔' : '♚'}
                    </span>
                  </div>
                  <span style={{ color: p.precision < 50 ? '#f44336' : '#ff9800', fontWeight: 'bold' }}>{p.precision}%</span>
                </div>
                <div style={{ background: '#1a1a2e', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${p.precision}%`, height: '100%', background: p.precision < 50 ? '#f44336' : '#ff9800' }} />
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{p.sesiones} sesiones · {p.sesionesPerfectas} perfectas</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPartidas === 0 && progresos.filter(p => !p.apertura.startsWith('__')).length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 48 }}>🔎</div>
          <p>Juega partidas y practica aperturas para ver tu análisis aquí.</p>
        </div>
      )}
    </div>
  );
}
