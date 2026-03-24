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

const STORAGE_KEY = 'chess_retos_completados';

export default function RetosDelDia() {
  const { user } = useAuth();
  const { showLogro } = useToast();
  const [retos, setRetos] = useState([]);
  const [completados, setCompletados] = useState(new Set());

  useEffect(() => {
    const hoy = new Date();
    setRetos(generarRetos(hoy));
    // Cargar completados del día de localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const hoyKey = hoy.toDateString();
      setCompletados(new Set(stored[hoyKey] || []));
    } catch { setCompletados(new Set()); }
  }, []);

  const completarReto = async (reto) => {
    if (completados.has(reto.key)) return;
    const nuevos = new Set(completados);
    nuevos.add(reto.key);
    setCompletados(nuevos);
    // Persistir
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const hoyKey = new Date().toDateString();
      stored[hoyKey] = [...nuevos];
      // Limpiar días viejos
      Object.keys(stored).forEach(k => { if (k !== hoyKey) delete stored[k]; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
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
  };

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
              <button
                className="reto-btn"
                onClick={() => completarReto(reto)}
                disabled={done}
              >
                {done ? '✅' : 'Completar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
