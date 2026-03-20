import { useState, useEffect } from 'react';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PLANTILLAS_MISIONES = [
  { id: 'sesiones_5',    texto: 'Completa 5 sesiones de entrenamiento',     xp: 50,  icono: '📖' },
  { id: 'aperturas_3',  texto: 'Practica 3 aperturas distintas',            xp: 40,  icono: '🎯' },
  { id: 'torneo_1',     texto: 'Completa 1 torneo',                         xp: 60,  icono: '🏆' },
  { id: 'puzzles_10',   texto: 'Resuelve 10 puzzles tácticos',              xp: 45,  icono: '🧩' },
  { id: 'casillas_50',  texto: 'Acierta 50 casillas en Aprender Casillas',  xp: 35,  icono: '🗺️' },
  { id: 'contrarreloj', texto: 'Completa 2 sesiones de contrarreloj',       xp: 55,  icono: '⏱️' },
  { id: 'supervivencia',texto: 'Llega al puzzle 10 en Supervivencia',       xp: 70,  icono: '💀' },
  { id: 'speedrun',     texto: 'Completa 1 Speed Run',                      xp: 40,  icono: '⚡' },
  { id: 'partida_win',  texto: 'Gana 1 partida contra un maestro',          xp: 80,  icono: '⚔️' },
  { id: 'adivina_4',    texto: 'Consigue 4/5 en Adivina la Apertura',       xp: 45,  icono: '🤔' },
];

function getLunesActual() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  return lunes.toISOString().slice(0, 10);
}

function generarMisiones(semanaKey) {
  const seed = semanaKey.replace(/-/g, '');
  const rng = (n) => { let x = Math.sin(parseInt(seed) + n) * 10000; return x - Math.floor(x); };
  const indices = new Set();
  while (indices.size < 3) indices.add(Math.floor(rng(indices.size + 1) * PLANTILLAS_MISIONES.length));
  return [...indices].map(i => ({ ...PLANTILLAS_MISIONES[i], key: `${semanaKey}-${PLANTILLAS_MISIONES[i].id}` }));
}

const STORAGE_KEY = 'chess_misiones_completadas';

export default function MisionesSemanales() {
  const { user } = useAuth();
  const { showLogro } = useToast();
  const [misiones, setMisiones] = useState([]);
  const [completadas, setCompletadas] = useState(new Set());
  const [semanaKey] = useState(getLunesActual);

  useEffect(() => {
    setMisiones(generarMisiones(semanaKey));
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setCompletadas(new Set(stored[semanaKey] || []));
    } catch { setCompletadas(new Set()); }
  }, [semanaKey]);

  const completar = async (mision) => {
    if (completadas.has(mision.key)) return;
    const nuevas = new Set(completadas);
    nuevas.add(mision.key);
    setCompletadas(nuevas);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      // Limpiar semanas viejas
      Object.keys(stored).forEach(k => { if (k !== semanaKey) delete stored[k]; });
      stored[semanaKey] = [...nuevas];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {}
    if (user?.token) {
      try {
        await progresoAPI.guardarSesion(user.token, {
          apertura: `__mision__${mision.id}`,
          variante: null, color: 'white',
          intentos: 1, aciertos: 1, modo: 'mision',
        });
      } catch {}
    }
    showLogro({ emoji: mision.icono, nombre: `+${mision.xp} XP — ${mision.texto}` });
  };

  const diasRestantes = () => {
    const hoy = new Date();
    const domingo = new Date(semanaKey);
    domingo.setDate(domingo.getDate() + 6);
    const diff = Math.ceil((domingo - hoy) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const todas = misiones.every(m => completadas.has(m.key));

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontSize: 12, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20 }}>
          🎯 Misiones Semanales
        </span>
        <span style={{ fontSize: 12, color: todas ? 'var(--success)' : 'var(--text-muted)' }}>
          {todas ? '✅ ¡Completadas!' : `⏳ ${diasRestantes()} días restantes`}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {misiones.map(m => {
          const done = completadas.has(m.key);
          return (
            <div key={m.key} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: '10px 14px',
              opacity: done ? 0.5 : 1,
            }}>
              <span style={{ fontSize: 20 }}>{m.icono}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{m.texto}</span>
              <span style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold' }}>+{m.xp} XP</span>
              <button onClick={() => completar(m)} disabled={done} style={{
                background: 'transparent', border: `1px solid ${done ? 'rgba(76,175,80,0.4)' : 'rgba(168,85,247,0.4)'}`,
                color: done ? 'var(--success)' : '#a855f7',
                padding: '5px 12px', borderRadius: 6, cursor: done ? 'default' : 'pointer',
                fontSize: 12, whiteSpace: 'nowrap', transition: 'background var(--transition)',
              }}>
                {done ? '✅' : 'Completar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
