import './StyleTraining.css';

export default function StyleTraining({ master, onBack }) {
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
          <p>Se te presentará una posición de una partida real de {master.name}. Intenta encontrar el movimiento que jugó.</p>
          <button className="start-btn">Comenzar Entrenamiento</button>
        </div>

        <div className="training-card">
          <h2>📊 Tu Progreso</h2>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Posiciones Resueltas</span>
            </div>
            <div className="stat">
              <span className="stat-value">0%</span>
              <span className="stat-label">Similitud de Estilo</span>
            </div>
          </div>
        </div>

        <div className="training-card">
          <h2>💡 Características del Estilo</h2>
          <ul>
            <li>Agresividad en el ataque</li>
            <li>Sacrificios posicionales</li>
            <li>Iniciativa sobre material</li>
            <li>Juego táctico complejo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
