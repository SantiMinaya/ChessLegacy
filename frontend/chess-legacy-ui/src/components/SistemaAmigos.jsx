import { useState, useEffect } from 'react';
import { amigosAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getNivel } from '../data/niveles';

export default function SistemaAmigos() {
  const { user } = useAuth();
  const [tab, setTab] = useState('amigos'); // amigos | solicitudes | buscar
  const [amigos, setAmigos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {tipo: 'ok'|'error', texto}

  const cargar = async () => {
    try {
      const [rA, rS] = await Promise.all([
        amigosAPI.getAmigos(user.token),
        amigosAPI.getSolicitudes(user.token),
      ]);
      setAmigos(rA.data);
      setSolicitudes(rS.data);
    } catch {}
  };

  useEffect(() => { cargar(); }, []);

  const mostrarMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 3000);
  };

  const buscar = async () => {
    if (busqueda.trim().length < 2) return;
    setLoading(true);
    try {
      const r = await amigosAPI.buscar(user.token, busqueda.trim());
      setResultados(r.data);
    } catch {}
    setLoading(false);
  };

  const solicitar = async (username) => {
    try {
      await amigosAPI.solicitar(user.token, username);
      mostrarMsg('ok', `Solicitud enviada a ${username}`);
      setResultados(r => r.filter(u => u.username !== username));
    } catch (e) {
      mostrarMsg('error', e.response?.data?.error || 'Error al enviar solicitud');
    }
  };

  const aceptar = async (id, username) => {
    try {
      await amigosAPI.aceptar(user.token, id);
      mostrarMsg('ok', `¡Ahora eres amigo de ${username}!`);
      cargar();
    } catch {}
  };

  const rechazar = async (id) => {
    try {
      await amigosAPI.rechazar(user.token, id);
      setSolicitudes(s => s.filter(s => s.id !== id));
    } catch {}
  };

  const eliminar = async (amigoId, username) => {
    if (!confirm(`¿Eliminar a ${username} de tus amigos?`)) return;
    try {
      await amigosAPI.eliminar(user.token, amigoId);
      setAmigos(a => a.filter(a => a.amigoId !== amigoId));
      mostrarMsg('ok', `${username} eliminado de tus amigos`);
    } catch {}
  };

  const estaConectado = (ultimaActividad) => {
    if (!ultimaActividad) return false;
    const diff = Date.now() - new Date(ultimaActividad).getTime();
    return diff < 1000 * 60 * 30; // activo en los últimos 30 min
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: 'var(--accent)', margin: '0 0 16px' }}>👥 Amigos</h2>

      {msg && (
        <div className={`feedback-box ${msg.tipo === 'ok' ? 'ok' : 'error'}`} style={{ marginBottom: 16 }}>
          {msg.tipo === 'ok' ? '✅' : '❌'} {msg.texto}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
        {[
          ['amigos', `👥 Amigos (${amigos.length})`],
          ['solicitudes', `📬 Solicitudes${solicitudes.length > 0 ? ` (${solicitudes.length})` : ''}`],
          ['buscar', '🔍 Buscar'],
        ].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px', border: '1px solid var(--accent)',
            background: tab === t ? 'var(--accent)' : 'transparent',
            color: tab === t ? 'var(--accent-text)' : 'var(--accent)',
            cursor: 'pointer', fontSize: 13, fontWeight: tab === t ? 'bold' : 'normal',
            borderLeft: t !== 'amigos' ? 'none' : undefined,
            borderRadius: t === 'amigos' ? '6px 0 0 6px' : t === 'buscar' ? '0 6px 6px 0' : 0,
          }}>{l}</button>
        ))}
      </div>

      {/* Lista de amigos */}
      {tab === 'amigos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {amigos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
              <p>Aún no tienes amigos. ¡Busca usuarios para añadir!</p>
              <button className="start-btn" style={{ marginTop: 8 }} onClick={() => setTab('buscar')}>🔍 Buscar usuarios</button>
            </div>
          ) : amigos.map(a => {
            const nivel = getNivel(a.xp);
            const conectado = estaConectado(a.ultimaActividad);
            return (
              <div key={a.amigoId} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--border-radius)', padding: '12px 16px',
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {a.foto
                    ? <img src={a.foto} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                    : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>♟️</div>
                  }
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 12, height: 12, borderRadius: '50%',
                    background: conectado ? '#4caf50' : '#888',
                    border: '2px solid var(--bg-card)',
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: 15 }}>{a.username}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {nivel.emoji} {nivel.nombre} · {a.xp} XP · 🔥 {a.rachaActual} días
                  </div>
                  <div style={{ fontSize: 11, color: conectado ? '#4caf50' : 'var(--text-muted)' }}>
                    {conectado ? '● Activo ahora' : a.ultimaActividad ? `Última vez: ${new Date(a.ultimaActividad).toLocaleDateString('es-ES')}` : 'Sin actividad'}
                  </div>
                </div>
                <button onClick={() => eliminar(a.amigoId, a.username)} style={{
                  background: 'transparent', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)', padding: '5px 10px', borderRadius: 6,
                  cursor: 'pointer', fontSize: 12, transition: 'all var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Solicitudes pendientes */}
      {tab === 'solicitudes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {solicitudes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📬</div>
              <p>No tienes solicitudes pendientes.</p>
            </div>
          ) : solicitudes.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--border-radius)', padding: '12px 16px',
            }}>
              {s.foto
                ? <img src={s.foto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>♟️</div>
              }
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{s.username}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.xp} XP · {new Date(s.fechaSolicitud).toLocaleDateString('es-ES')}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => aceptar(s.id, s.username)} style={{ padding: '6px 14px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>
                  ✅ Aceptar
                </button>
                <button onClick={() => rechazar(s.id)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buscar usuarios */}
      {tab === 'buscar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
              placeholder="Buscar por nombre de usuario..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 'var(--border-radius)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
            <button onClick={buscar} disabled={loading || busqueda.trim().length < 2} style={{
              padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)',
              border: 'none', borderRadius: 'var(--border-radius)', fontWeight: 'bold', cursor: 'pointer',
            }}>
              {loading ? '⏳' : '🔍'}
            </button>
          </div>

          {resultados.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {resultados.map(u => {
                const nivel = getNivel(u.xp);
                const yaAmigo = amigos.some(a => a.amigoId === u.id);
                return (
                  <div key={u.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--border-radius)', padding: '12px 16px',
                  }}>
                    {u.foto
                      ? <img src={u.foto} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>♟️</div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{u.username}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{nivel.emoji} {nivel.nombre} · {u.xp} XP</div>
                    </div>
                    {yaAmigo ? (
                      <span style={{ fontSize: 12, color: 'var(--success)' }}>✅ Ya sois amigos</span>
                    ) : (
                      <button onClick={() => solicitar(u.username)} style={{
                        padding: '6px 14px', background: 'var(--accent)', color: 'var(--accent-text)',
                        border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 'bold',
                      }}>
                        + Añadir
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {resultados.length === 0 && busqueda.trim().length >= 2 && !loading && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
              No se encontraron usuarios con ese nombre.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
