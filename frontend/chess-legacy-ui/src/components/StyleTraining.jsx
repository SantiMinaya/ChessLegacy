import { useState } from 'react';
import './StyleTraining.css';

export default function StyleTraining({ master, onBack }) {
  const [started, setStarted] = useState(false);

  // Características de estilo específicas del maestro
  const caracteristicas = master.styleTraits || [
    'Control del centro',
    'Desarrollo activo de piezas',
    'Búsqueda de iniciativa',
    'Juego posicional preciso',
  ];

  return (
    <div className="style-training">
      <button className="back-btn" onClick={onBack}>← Volver</button>

      <div className="training-header" style={{ borderTopColor: master.color }}>
        <img src={master.photo} alt={master.name} />
        <div>
          <h1>Entrenar Estilo de {master.name}</h1>
          <p>{master.style}</p>
        </div>
      </div>

      <div className="training-content">
        <div className="training-card">
          <h2>🎯 Encuentra el Movimiento</h2>
          <p>
            Se te presentará una posición de una partida real de <strong style={{ color: 'var(--accent)' }}>{master.name}</strong>.
            Intenta encontrar el movimiento que jugó y aprende a pensar como él.
          </p>
          {!started ? (
            <button className="start-btn" onClick={() => setStarted(true)}>
              🚀 Comenzar Entrenamiento
            </button>
          ) : (
            <div className="training-coming-soon">
              <span style={{ fontSize: 36 }}>🏗️</span>
              <p style={{ marginTop: 12 }}>
                El módulo de entrenamiento de estilo está en desarrollo.<br />
                Pronto podrás practicar posiciones reales de {master.name}.
              </p>
            </div>
          )}
        </div>

        <div className="training-card">
          <h2>📊 Tu Progreso</h2>
          <div className="stats-grid">
            <div className="training-stat">
              <span className="training-stat-value">0</span>
              <span className="training-stat-label">Posiciones Resueltas</span>
            </div>
            <div className="training-stat">
              <span className="training-stat-value">0%</span>
              <span className="training-stat-label">Similitud de Estilo</span>
            </div>
          </div>
        </div>

        <div className="training-card">
          <h2>💡 Características del Estilo</h2>
          <ul>
            {caracteristicas.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
