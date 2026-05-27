import { useState, useEffect } from 'react';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './RetosDelDia.css';

const PLANTILLAS = [
  { id: 'apertura', texto: (ap) => `Completa la ${ap} sin errores`, xp: 30, icono: '📖' },
  { id: 'casillas', texto: () => 'Acierta 8 casillas seguidas', xp: 20, icono: '🗺️' },
  { id: 'puzzle',   texto: () => 'Resuelve 3 puzzles tácticos', xp: 25, icono: '🧩' },
  { id: 'contrarreloj', texto: () => 'Completa una apertura en contrarreloj', xp: 35, icono: '⏱️' },
  { id: 'adivinar', texto: () => 'Consigue 4/5 en Adivina la Apertura', xp: 25, icono: '🤔' },
];

const APERTURAS = ['Siciliana', 'Ruy Lopez', 'Italiana', 'Francesa', 'Caro-Kann', 'Gambito de Dama', 'India de Rey'];

function generarRetos(fecha) {
  // Seed numérico robusto
  const seed = fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate();
  const rng = (n) => { const x = Math.sin(seed * 31 + n * 17) * 10000; return x - Math.floor(x); };
  // Elegir 3 plantillas distintas
  const usados = new Set();
  return [0, 1, 2].map(i => {
    let idx;
    let attempts = 0;
    do { idx = Math.floor(rng(i + attempts) * PLANTILLAS.length); attempts++; }
    while (usados.has(idx) && attempts < 20);
    usados.add(idx);
    const plantilla = PLANTILLAS[idx];
    const apertura = APERTURAS[Math.floor(rng(i + 10) * APERTURAS.length)];
    return { ...plantilla, texto: plantilla.texto(apertura), key: `${fecha.toDateString()}-${i}` };
  });
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

const getCompletadosKey = () => `chess_retos_completados_${getUserId()}`;
const getProgresoKey = () => `chess_retos_progreso_${getUserId()}`;

export default function RetosDelDia() {
  const { user } = useAuth();
  const { showLogro } = useToast();
  const [retos, setRetos] = useState([]);
  const [completados, setCompletados] = useState(new Set());

  // Función para completar reto y guardar progreso
  const completarReto = async (reto, currentCompletados) => {
    if (currentCompletados.has(reto.key)) return currentCompletados;
    const nuevos = new Set(currentCompletados);
    nuevos.add(reto.key);
    setCompletados(nuevos);
    // Persistir
    try {
      const completadosKey = getCompletadosKey();
      const stored = JSON.parse(localStorage.getItem(completadosKey) || '{}');
      const hoyKey = new Date().toDateString();
      stored[hoyKey] = [...nuevos];
      // Limpiar días viejos
      Object.keys(stored).forEach(k => { if (k !== hoyKey) delete stored[k]; });
      localStorage.setItem(completadosKey, JSON.stringify(stored));
    } catch {}
    // Dar XP
    if (user?.token) {
      try {
        await progresoAPI.guardarSesion(user.token, {
          apertura: `__reto__${reto.id}`,
          variante: null, color: 'white',
          intentos: 1, aciertos: 1, modo: 'reto',
        });
      } catch {}
    }
    showLogro({ emoji: reto.icono, nombre: `+${reto.xp} XP — ${reto.texto}` });
    return nuevos;
  };

  useEffect(() => {
    const hoy = new Date();
    const listaRetos = generarRetos(hoy);
    setRetos(listaRetos);

    // Cargar completados del día
    let currentCompletados = new Set();
    try {
      const completadosKey = getCompletadosKey();
      const stored = JSON.parse(localStorage.getItem(completadosKey) || '{}');
      const hoyKey = hoy.toDateString();
      currentCompletados = new Set(stored[hoyKey] || []);
      setCompletados(currentCompletados);
    } catch { setCompletados(currentCompletados); }

    // Verificar progreso pasivo de retos
    try {
      const progKey = getProgresoKey();
      const progStored = JSON.parse(localStorage.getItem(progKey) || '{}');
      const hoyKey = hoy.toDateString();
      if (progStored.fecha === hoyKey) {
        // Verificar cada reto
        listaRetos.forEach(async (reto) => {
          if (currentCompletados.has(reto.key)) return;

          let cumple = false;
          if (reto.id === 'casillas' && progStored.casillas_seguidas >= 8) cumple = true;
          else if (reto.id === 'puzzle' && progStored.puzzles_resueltos >= 3) cumple = true;
          else if (reto.id === 'contrarreloj' && progStored.contrarreloj_completados?.length >= 1) cumple = true;
          else if (reto.id === 'adivinar' && progStored.adivina_aciertos >= 4) cumple = true;
          else if (reto.id === 'apertura') {
            if (progStored.aperturas_perfectas?.length >= 1) cumple = true;
          }

          if (cumple) {
            currentCompletados = await completarReto(reto, currentCompletados);
          }
        });
      }
    } catch {}
  }, [user]);

  const todosCompletados = retos.every(r => completados.has(r.key));

  return (
    <div className="retos-card">
      <div className="retos-header">
        <span className="retos-badge">🎯 Retos del Día</span>
        {todosCompletados && <span className="retos-all-done">✅ ¡Todos completados!</span>}
      </div>
      <div className="retos-lista">
        {retos.map(reto => {
          const done = completados.has(reto.key);
          return (
            <div key={reto.key} className={`reto-item ${done ? 'done' : ''}`}>
              <span className="reto-icono">{reto.icono}</span>
              <span className="reto-texto">{reto.texto}</span>
              <span className="reto-xp">+{reto.xp} XP</span>
              <span className="reto-status" style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: done ? 'var(--success)' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: 6,
                background: done ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${done ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.1)'}`
              }}>
                {done ? '✅ Completado' : '⌛ Pendiente'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
