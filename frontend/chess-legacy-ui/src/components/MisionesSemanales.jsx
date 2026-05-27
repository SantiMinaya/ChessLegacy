import { useState, useEffect } from 'react';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const PLANTILLAS_MISIONES = [
  { id: 'sesiones_5',    texto: 'Completa 5 sesiones de entrenamiento',    xp: 50, icono: '📖' },
  { id: 'aperturas_3',  texto: 'Practica 3 aperturas distintas',           xp: 40, icono: '🎯' },
  { id: 'torneo_1',     texto: 'Completa 1 torneo',                        xp: 60, icono: '🏆' },
  { id: 'puzzles_10',   texto: 'Resuelve 10 puzzles tácticos',             xp: 45, icono: '🧩' },
  { id: 'casillas_50',  texto: 'Acierta 50 casillas en Aprender Casillas', xp: 35, icono: '🗺️' },
  { id: 'contrarreloj', texto: 'Completa 2 sesiones de contrarreloj',      xp: 55, icono: '⏱️' },
  { id: 'supervivencia',texto: 'Llega al puzzle 10 en Supervivencia',      xp: 70, icono: '💀' },
  { id: 'speedrun',     texto: 'Completa 1 Speed Run',                     xp: 40, icono: '⚡' },
  { id: 'partida_win',  texto: 'Gana 1 partida contra un maestro',         xp: 80, icono: '⚔️' },
  { id: 'adivina_4',    texto: 'Consigue 4/5 en Adivina la Apertura',      xp: 45, icono: '🤔' },
];

function getLunesActual() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  
  const yyyy = lunes.getFullYear();
  const mm = String(lunes.getMonth() + 1).padStart(2, '0');
  const dd = String(lunes.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Seed numérico robusto a partir de la fecha YYYYMMDD
function seedFromKey(key) {
  return key.split('-').reduce((acc, part) => acc * 100 + parseInt(part, 10), 0);
}

function rng(seed, n) {
  const x = Math.sin(seed + n) * 10000;
  return x - Math.floor(x);
}

function generarMisiones(semanaKey) {
  const seed = seedFromKey(semanaKey);
  const indices = new Set();
  let n = 0;
  while (indices.size < 3) {
    const idx = Math.floor(rng(seed, n++) * PLANTILLAS_MISIONES.length);
    indices.add(idx);
  }
  return [...indices].map(i => ({
    ...PLANTILLAS_MISIONES[i],
    key: `${semanaKey}-${PLANTILLAS_MISIONES[i].id}`,
  }));
}

const getUserId = () => {
  try {
    const userStr = localStorage.getItem('chess_user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      return userObj.id || userObj.username || 'anon';
    }
  } catch {}
  return 'anon';
};

const getMisionesKey = () => `chess_misiones_completadas_${getUserId()}`;

export default function MisionesSemanales({ progresos = [], logros = [], partidas = [] }) {
  const { user } = useAuth();
  const { showLogro } = useToast();
  const [misiones, setMisiones] = useState([]);
  const [completadas, setCompletadas] = useState(new Set());
  const [semanaKey] = useState(getLunesActual);

  useEffect(() => {
    setMisiones(generarMisiones(semanaKey));
    try {
      const misionesKey = getMisionesKey();
      const stored = JSON.parse(localStorage.getItem(misionesKey) || '{}');
      setCompletadas(new Set(stored[semanaKey] || []));
    } catch {
      setCompletadas(new Set());
    }
  }, [semanaKey, user]);

  const completar = async (mision) => {
    if (completadas.has(mision.key)) return;
    const nuevas = new Set(completadas);
    nuevas.add(mision.key);
    setCompletadas(nuevas);
    try {
      const misionesKey = getMisionesKey();
      const stored = JSON.parse(localStorage.getItem(misionesKey) || '{}');
      Object.keys(stored).forEach(k => { if (k !== semanaKey) delete stored[k]; });
      stored[semanaKey] = [...nuevas];
      localStorage.setItem(misionesKey, JSON.stringify(stored));
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

  // Escaneo automático y pasivo de misiones
  useEffect(() => {
    if (misiones.length === 0) return;

    let currentCompletadas = new Set(completadas);
    let changed = false;

    misiones.forEach(async (mision) => {
      if (currentCompletadas.has(mision.key)) return;

      let cumple = false;
      const totalSes = progresos.filter(p => !p.apertura.startsWith('__')).reduce((sum, p) => sum + p.sesiones, 0);
      const apDist = new Set(progresos.filter(p => !p.apertura.startsWith('__')).map(p => p.apertura)).size;
      const totalAciertos = progresos.reduce((s, p) => s + p.aciertos, 0);

      // Conseguir datos de localStorage del usuario
      const progKey = `chess_retos_progreso_${getUserId()}`;
      const progStored = JSON.parse(localStorage.getItem(progKey) || '{}');

      if (mision.id === 'sesiones_5' && totalSes >= 5) cumple = true;
      else if (mision.id === 'aperturas_3' && apDist >= 3) cumple = true;
      else if (mision.id === 'torneo_1' && (progresos.some(p => p.apertura === '__torneo__' && p.sesiones >= 1) || logros.some(l => l.codigo === 'PRIMER_TORNEO'))) cumple = true;
      else if (mision.id === 'puzzles_10' && (progStored.puzzles_resueltos >= 10 || totalAciertos >= 10)) cumple = true;
      else if (mision.id === 'casillas_50' && (progStored.casillas_seguidas >= 50 || totalAciertos >= 50 || logros.some(l => l.codigo === 'GEOGRAFO'))) cumple = true;
      else if (mision.id === 'contrarreloj' && (progStored.contrarreloj_completados?.length >= 2 || totalSes >= 2)) cumple = true;
      else if (mision.id === 'supervivencia' && (logros.some(l => l.codigo === 'SUPERVIVIENTE_20') || totalAciertos >= 10)) cumple = true;
      else if (mision.id === 'speedrun' && (logros.some(l => l.codigo === 'SPEED_RUNNER') || totalSes >= 1)) cumple = true;
      else if (mision.id === 'partida_win' && (partidas.some(p => p.resultado === 'win') || logros.some(l => l.codigo === 'VENCE_TODOS_MAESTROS'))) cumple = true;
      else if (mision.id === 'adivina_4' && (progStored.adivina_aciertos >= 4 || logros.some(l => l.codigo === 'ADIVINA_PERFECTO'))) cumple = true;

      if (cumple) {
        currentCompletadas.add(mision.key);
        changed = true;
        
        // Registrar localmente
        try {
          const misionesKey = getMisionesKey();
          const stored = JSON.parse(localStorage.getItem(misionesKey) || '{}');
          Object.keys(stored).forEach(k => { if (k !== semanaKey) delete stored[k]; });
          stored[semanaKey] = [...currentCompletadas];
          localStorage.setItem(misionesKey, JSON.stringify(stored));
        } catch {}

        // Enviar al backend
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
      }
    });

    if (changed) {
      setCompletadas(currentCompletadas);
    }
  }, [misiones, progresos, logros, partidas, semanaKey, user]);

  const diasRestantes = () => {
    const hoy = new Date();
    const domingo = new Date(semanaKey);
    domingo.setDate(domingo.getDate() + 6);
    const diff = Math.ceil((domingo - hoy) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const todas = misiones.length > 0 && misiones.every(m => completadas.has(m.key));

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
              borderRadius: 10, padding: '10px 14px', opacity: done ? 0.55 : 1,
            }}>
              <span style={{ fontSize: 20 }}>{m.icono}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{m.texto}</span>
              <span style={{ fontSize: 12, color: '#a855f7', fontWeight: 'bold', marginRight: 10 }}>+{m.xp} XP</span>
              <span style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: done ? 'var(--success)' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: 6,
                background: done ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${done ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.1)'}`
              }}>
                {done ? '✅ Completada' : '⌛ En Progreso'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
