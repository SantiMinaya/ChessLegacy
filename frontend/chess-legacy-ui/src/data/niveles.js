export const NIVELES = [
  { nivel: 1,  nombre: 'Peón',          xpMin: 0,    emoji: '♟️' },
  { nivel: 2,  nombre: 'Alfil',         xpMin: 100,  emoji: '🏃' },
  { nivel: 3,  nombre: 'Caballo',       xpMin: 250,  emoji: '🐴' },
  { nivel: 4,  nombre: 'Torre',         xpMin: 500,  emoji: '🏰' },
  { nivel: 5,  nombre: 'Dama',          xpMin: 900,  emoji: '👸' },
  { nivel: 6,  nombre: 'Rey',           xpMin: 1500, emoji: '👑' },
  { nivel: 7,  nombre: 'Candidato',     xpMin: 2500, emoji: '🎯' },
  { nivel: 8,  nombre: 'Maestro FIDE',  xpMin: 4000, emoji: '🏅' },
  { nivel: 9,  nombre: 'MI',            xpMin: 6000, emoji: '🥈' },
  { nivel: 10, nombre: 'Gran Maestro',  xpMin: 9000, emoji: '🏆' },
];

export function getNivel(xp) {
  let actual = NIVELES[0];
  for (const n of NIVELES) {
    if (xp >= n.xpMin) actual = n;
    else break;
  }
  const idx = NIVELES.indexOf(actual);
  const siguiente = NIVELES[idx + 1] || null;
  const xpEnNivel = xp - actual.xpMin;
  const xpParaSiguiente = siguiente ? siguiente.xpMin - actual.xpMin : 1;
  const progreso = siguiente ? Math.round((xpEnNivel / xpParaSiguiente) * 100) : 100;
  return { ...actual, siguiente, xpEnNivel, xpParaSiguiente, progreso };
}
