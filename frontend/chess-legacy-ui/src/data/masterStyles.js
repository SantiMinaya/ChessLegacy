export const masterStyles = {
  1: { // Mikhail Tal
    name: "Mikhail Tal",
    style: "Agresivo y Táctico",
    preferences: {
      attackWeight: 0.9,        // Muy alto - "El Mago de Riga"
      sacrificeBonus: 0.8,      // Ama los sacrificios brillantes
      materialWeight: 0.3,      // Desprecia material por ataque
      kingSafetyWeight: 0.4,    // Arriesga su propio rey
      centerControlWeight: 0.6,
      developmentWeight: 0.7,
      tacticalComplexity: 0.9,  // Busca complicaciones
      positionalWeight: 0.3     // Menos posicional
    },
    description: "Busca ataques devastadores y sacrificios brillantes. Prefiere complicaciones tácticas sobre seguridad material."
  },
  2: { // José Raúl Capablanca
    name: "José Raúl Capablanca",
    style: "Posicional y Preciso",
    preferences: {
      attackWeight: 0.5,
      sacrificeBonus: 0.2,      // Raramente sacrifica
      materialWeight: 0.8,      // Valora mucho el material
      kingSafetyWeight: 0.8,    // Juego sólido
      centerControlWeight: 0.8,
      developmentWeight: 0.9,
      tacticalComplexity: 0.4,  // Prefiere simplicidad
      positionalWeight: 0.9,    // Maestro posicional
      endgameWeight: 0.95       // Genio de finales
    },
    description: "Juego simple y claro. Maestro de finales que convierte pequeñas ventajas en victorias."
  },
  3: { // Garry Kasparov
    name: "Garry Kasparov",
    style: "Dinámico y Universal",
    preferences: {
      attackWeight: 0.8,
      sacrificeBonus: 0.6,
      materialWeight: 0.7,
      kingSafetyWeight: 0.7,
      centerControlWeight: 0.9,
      developmentWeight: 0.9,
      tacticalComplexity: 0.8,
      positionalWeight: 0.8,
      preparationDepth: 0.95    // Preparación profunda
    },
    description: "Juego universal y dinámico. Combina táctica brillante con profunda preparación teórica."
  },
  4: { // Bobby Fischer
    name: "Bobby Fischer",
    style: "Preciso y Agresivo",
    preferences: {
      attackWeight: 0.8,
      sacrificeBonus: 0.5,
      materialWeight: 0.8,
      kingSafetyWeight: 0.9,    // Muy sólido
      centerControlWeight: 0.9,
      developmentWeight: 0.95,  // Desarrollo perfecto
      tacticalComplexity: 0.7,
      positionalWeight: 0.85,
      accuracy: 0.98            // Precisión extrema
    },
    description: "Precisión absoluta y preparación obsesiva. Juego sólido con ataques devastadores."
  },
  5: { // Anatoly Karpov
    name: "Anatoly Karpov",
    style: "Posicional y Estratégico",
    preferences: {
      attackWeight: 0.6,
      sacrificeBonus: 0.3,
      materialWeight: 0.85,
      kingSafetyWeight: 0.9,
      centerControlWeight: 0.85,
      developmentWeight: 0.85,
      tacticalComplexity: 0.5,
      positionalWeight: 0.95,   // Maestro posicional
      prophylaxis: 0.95         // Profilaxis extrema
    },
    description: "Estrangula lentamente al oponente. Maestro de la profilaxis y juego posicional."
  },
  6: { // Alexander Alekhine
    name: "Alexander Alekhine",
    style: "Combinativo y Agresivo",
    preferences: {
      attackWeight: 0.85,
      sacrificeBonus: 0.7,
      materialWeight: 0.6,
      kingSafetyWeight: 0.6,
      centerControlWeight: 0.8,
      developmentWeight: 0.8,
      tacticalComplexity: 0.85,
      positionalWeight: 0.7,
      combinationDepth: 0.9     // Combinaciones profundas
    },
    description: "Maestro del ataque y la táctica compleja. Busca combinaciones profundas y brillantes."
  },
  7: { // Tigran Petrosian
    name: "Tigran Petrosian",
    style: "Defensivo y Profiláctico",
    preferences: {
      attackWeight: 0.4,
      sacrificeBonus: 0.2,
      materialWeight: 0.9,
      kingSafetyWeight: 0.95,   // "Tigran de Hierro"
      centerControlWeight: 0.8,
      developmentWeight: 0.85,
      tacticalComplexity: 0.4,
      positionalWeight: 0.9,
      prophylaxis: 0.98,        // Máxima profilaxis
      defense: 0.95             // Defensa magistral
    },
    description: "Defensa impenetrable. Previene todas las amenazas del oponente antes de que sucedan."
  },
  8: { // Magnus Carlsen
    name: "Magnus Carlsen",
    style: "Universal y Preciso",
    preferences: {
      attackWeight: 0.7,
      sacrificeBonus: 0.5,
      materialWeight: 0.8,
      kingSafetyWeight: 0.85,
      centerControlWeight: 0.85,
      developmentWeight: 0.9,
      tacticalComplexity: 0.7,
      positionalWeight: 0.9,
      endgameWeight: 0.98,      // Genio de finales moderno
      grinding: 0.95            // Convierte ventajas mínimas
    },
    description: "Juego universal y preciso. Convierte ventajas microscópicas en victorias en finales."
  }
};

// Función para ajustar la evaluación de Stockfish según el estilo del maestro
export function adjustEvaluationByStyle(baseEval, position, masterId) {
  const style = masterStyles[masterId];
  if (!style) return baseEval;

  let adjustment = 0;

  // Bonificación por ataque al rey enemigo
  if (position.isCheck || position.attackingKing) {
    adjustment += style.preferences.attackWeight * 50;
  }

  // Penalización por material si el maestro es táctico
  if (position.materialDown && style.preferences.sacrificeBonus > 0.6) {
    adjustment += style.preferences.sacrificeBonus * 30;
  }

  // Bonificación por posiciones complejas para maestros tácticos
  if (position.complexity > 0.7 && style.preferences.tacticalComplexity > 0.7) {
    adjustment += 40;
  }

  // Bonificación por posiciones simples para maestros posicionales
  if (position.complexity < 0.4 && style.preferences.positionalWeight > 0.8) {
    adjustment += 30;
  }

  return baseEval + adjustment;
}

// Función para seleccionar el mejor movimiento según el estilo
export function selectMoveByStyle(moves, masterId) {
  const style = masterStyles[masterId];
  if (!style || moves.length === 0) return moves[0];

  // Ordenar movimientos según preferencias del maestro
  const scoredMoves = moves.map(move => {
    let score = move.eval || 0;

    // Bonificar movimientos de ataque
    if (move.isCheck) score += style.preferences.attackWeight * 100;
    if (move.isCapture && !move.isSacrifice) score += style.preferences.materialWeight * 50;
    if (move.isSacrifice) score += style.preferences.sacrificeBonus * 80;
    if (move.developsPiece) score += style.preferences.developmentWeight * 30;
    if (move.controlsCenter) score += style.preferences.centerControlWeight * 40;

    return { ...move, styleScore: score };
  });

  // Ordenar por score ajustado
  scoredMoves.sort((a, b) => b.styleScore - a.styleScore);

  // Los maestros más tácticos tienen más variabilidad
  const randomness = 1 - style.preferences.accuracy || 0.1;
  const topMoves = scoredMoves.slice(0, Math.max(1, Math.floor(moves.length * randomness)));

  return topMoves[Math.floor(Math.random() * topMoves.length)];
}
