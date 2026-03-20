import { createContext, useContext, useState, useEffect } from 'react';

export const TEMAS = {
  oscuro: {
    nombre: 'Oscuro', emoji: '🌙',
    vars: {
      '--bg-primary':    '#1a1a2e',
      '--bg-secondary':  '#16213e',
      '--bg-card':       'rgba(255,255,255,0.05)',
      '--bg-card-hover': 'rgba(255,255,255,0.08)',
      '--border':        'rgba(212,175,55,0.3)',
      '--border-subtle': 'rgba(255,255,255,0.08)',
      '--text-primary':  '#e0e0e0',
      '--text-secondary':'#c0c0c0',
      '--text-muted':    '#888888',
      '--accent':        '#d4af37',
      '--accent-hover':  '#f0c040',
      '--accent-text':   '#1a1a2e',
      '--success':       '#4caf50',
      '--error':         '#f44336',
      '--warning':       '#ff9800',
      '--shadow':        'rgba(0,0,0,0.4)',
    }
  },
  claro: {
    nombre: 'Claro', emoji: '☀️',
    vars: {
      '--bg-primary':    '#f5f0e8',
      '--bg-secondary':  '#ede8dc',
      '--bg-card':       'rgba(255,255,255,0.8)',
      '--bg-card-hover': 'rgba(255,255,255,0.95)',
      '--border':        'rgba(139,90,43,0.4)',
      '--border-subtle': 'rgba(0,0,0,0.1)',
      '--text-primary':  '#2c1810',
      '--text-secondary':'#4a3728',
      '--text-muted':    '#8b7355',
      '--accent':        '#8b5e3c',
      '--accent-hover':  '#a0714f',
      '--accent-text':   '#ffffff',
      '--success':       '#2e7d32',
      '--error':         '#c62828',
      '--warning':       '#e65100',
      '--shadow':        'rgba(0,0,0,0.15)',
    }
  },
  esmeralda: {
    nombre: 'Esmeralda', emoji: '💚',
    vars: {
      '--bg-primary':    '#0d1f0d',
      '--bg-secondary':  '#0a1a0a',
      '--bg-card':       'rgba(0,100,0,0.15)',
      '--bg-card-hover': 'rgba(0,100,0,0.25)',
      '--border':        'rgba(0,200,100,0.35)',
      '--border-subtle': 'rgba(0,200,100,0.1)',
      '--text-primary':  '#d4f5d4',
      '--text-secondary':'#a8e6a8',
      '--text-muted':    '#5a9a5a',
      '--accent':        '#00c864',
      '--accent-hover':  '#00e070',
      '--accent-text':   '#0d1f0d',
      '--success':       '#00e070',
      '--error':         '#ff4444',
      '--warning':       '#ffaa00',
      '--shadow':        'rgba(0,0,0,0.5)',
    }
  },
  purpura: {
    nombre: 'Púrpura', emoji: '💜',
    vars: {
      '--bg-primary':    '#1a0a2e',
      '--bg-secondary':  '#120820',
      '--bg-card':       'rgba(100,0,200,0.12)',
      '--bg-card-hover': 'rgba(100,0,200,0.2)',
      '--border':        'rgba(180,100,255,0.35)',
      '--border-subtle': 'rgba(180,100,255,0.1)',
      '--text-primary':  '#e8d4ff',
      '--text-secondary':'#c8a8ff',
      '--text-muted':    '#8855bb',
      '--accent':        '#b464ff',
      '--accent-hover':  '#cc80ff',
      '--accent-text':   '#1a0a2e',
      '--success':       '#44dd88',
      '--error':         '#ff4466',
      '--warning':       '#ffaa22',
      '--shadow':        'rgba(0,0,0,0.5)',
    }
  },
  rojo: {
    nombre: 'Rojo', emoji: '🔴',
    vars: {
      '--bg-primary':    '#1a0a0a',
      '--bg-secondary':  '#120808',
      '--bg-card':       'rgba(180,0,0,0.12)',
      '--bg-card-hover': 'rgba(180,0,0,0.2)',
      '--border':        'rgba(220,50,50,0.4)',
      '--border-subtle': 'rgba(220,50,50,0.12)',
      '--text-primary':  '#ffe0e0',
      '--text-secondary':'#ffb8b8',
      '--text-muted':    '#aa5555',
      '--accent':        '#e03030',
      '--accent-hover':  '#ff4444',
      '--accent-text':   '#ffffff',
      '--success':       '#44cc66',
      '--error':         '#ff6666',
      '--warning':       '#ffaa00',
      '--shadow':        'rgba(0,0,0,0.5)',
    }
  },
  oceano: {
    nombre: 'Océano', emoji: '🌊',
    vars: {
      '--bg-primary':    '#050f1a',
      '--bg-secondary':  '#071525',
      '--bg-card':       'rgba(0,80,160,0.15)',
      '--bg-card-hover': 'rgba(0,80,160,0.25)',
      '--border':        'rgba(0,150,255,0.35)',
      '--border-subtle': 'rgba(0,150,255,0.1)',
      '--text-primary':  '#d0eeff',
      '--text-secondary':'#90ccff',
      '--text-muted':    '#4488aa',
      '--accent':        '#0096ff',
      '--accent-hover':  '#22aaff',
      '--accent-text':   '#050f1a',
      '--success':       '#00ddaa',
      '--error':         '#ff4455',
      '--warning':       '#ffaa00',
      '--shadow':        'rgba(0,0,0,0.5)',
    }
  },
  sepia: {
    nombre: 'Sepia', emoji: '📜',
    vars: {
      '--bg-primary':    '#2a1f0e',
      '--bg-secondary':  '#1e1508',
      '--bg-card':       'rgba(180,130,60,0.12)',
      '--bg-card-hover': 'rgba(180,130,60,0.2)',
      '--border':        'rgba(200,160,80,0.4)',
      '--border-subtle': 'rgba(200,160,80,0.12)',
      '--text-primary':  '#f5e6c8',
      '--text-secondary':'#e0c898',
      '--text-muted':    '#a08040',
      '--accent':        '#c8960a',
      '--accent-hover':  '#e0aa10',
      '--accent-text':   '#2a1f0e',
      '--success':       '#6aaa44',
      '--error':         '#cc4422',
      '--warning':       '#dd8800',
      '--shadow':        'rgba(0,0,0,0.5)',
    }
  },
  hielo: {
    nombre: 'Hielo', emoji: '🧊',
    vars: {
      '--bg-primary':    '#0a1520',
      '--bg-secondary':  '#0d1e2e',
      '--bg-card':       'rgba(150,220,255,0.08)',
      '--bg-card-hover': 'rgba(150,220,255,0.14)',
      '--border':        'rgba(150,220,255,0.3)',
      '--border-subtle': 'rgba(150,220,255,0.08)',
      '--text-primary':  '#e8f4ff',
      '--text-secondary':'#b8d8f0',
      '--text-muted':    '#5588aa',
      '--accent':        '#88ccff',
      '--accent-hover':  '#aaddff',
      '--accent-text':   '#0a1520',
      '--success':       '#44ddaa',
      '--error':         '#ff5566',
      '--warning':       '#ffcc44',
      '--shadow':        'rgba(0,0,0,0.5)',
    }
  },
};

export const FUENTES = {
  sistema:  { nombre: 'Sistema',   valor: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  georgia:  { nombre: 'Georgia',   valor: "Georgia, 'Times New Roman', serif" },
  mono:     { nombre: 'Monospace', valor: "'Courier New', Courier, monospace" },
  rounded:  { nombre: 'Redondeada', valor: "'Trebuchet MS', 'Lucida Sans', sans-serif" },
};

export const TAMANIOS = {
  pequeno: { nombre: 'Pequeño', base: '13px' },
  normal:  { nombre: 'Normal',  base: '15px' },
  grande:  { nombre: 'Grande',  base: '17px' },
};

const ThemeContext = createContext(null);

function applyTheme(temaKey, fuenteKey, tamanioKey) {
  const tema = TEMAS[temaKey];
  const fuente = FUENTES[fuenteKey];
  const tamanio = TAMANIOS[tamanioKey];
  const root = document.documentElement;
  if (tema) Object.entries(tema.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  if (fuente) root.style.setProperty('--font-family', fuente.valor);
  if (tamanio) root.style.setProperty('--font-size-base', tamanio.base);
  root.setAttribute('data-theme', temaKey);
}

export function ThemeProvider({ children }) {
  const [tema, setTemaState] = useState(() => localStorage.getItem('appTema') || 'oscuro');
  const [fuente, setFuenteState] = useState(() => localStorage.getItem('appFuente') || 'sistema');
  const [tamanio, setTamanioState] = useState(() => localStorage.getItem('appTamanio') || 'normal');
  const [radiosBordes, setRadiosBordesState] = useState(() => localStorage.getItem('appRadios') || 'normal');
  const [animaciones, setAnimacionesState] = useState(() => localStorage.getItem('appAnimaciones') !== 'false');
  const [compacto, setCompactoState] = useState(() => localStorage.getItem('appCompacto') === 'true');

  useEffect(() => { applyTheme(tema, fuente, tamanio); }, []);

  const setTema = (t) => {
    localStorage.setItem('appTema', t);
    setTemaState(t);
    applyTheme(t, fuente, tamanio);
  };
  const setFuente = (f) => {
    localStorage.setItem('appFuente', f);
    setFuenteState(f);
    applyTheme(tema, f, tamanio);
  };
  const setTamanio = (s) => {
    localStorage.setItem('appTamanio', s);
    setTamanioState(s);
    applyTheme(tema, fuente, s);
  };
  const setRadiosBordes = (r) => { localStorage.setItem('appRadios', r); setRadiosBordesState(r); document.documentElement.style.setProperty('--border-radius', r === 'cuadrado' ? '4px' : r === 'redondeado' ? '16px' : '8px'); };
  const setAnimaciones = (v) => { localStorage.setItem('appAnimaciones', v); setAnimacionesState(v); document.documentElement.style.setProperty('--transition', v ? '0.2s ease' : '0s'); };
  const setCompacto = (v) => { localStorage.setItem('appCompacto', v); setCompactoState(v); document.documentElement.style.setProperty('--spacing', v ? '0.6' : '1'); };

  return (
    <ThemeContext.Provider value={{ tema, setTema, fuente, setFuente, tamanio, setTamanio, radiosBordes, setRadiosBordes, animaciones, setAnimaciones, compacto, setCompacto }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
