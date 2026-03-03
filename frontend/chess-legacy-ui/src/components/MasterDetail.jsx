import { useState } from 'react';
import PlayMaster from './PlayMaster';
import PartidasFamosas from '../pages/PartidasFamosas';
import StyleTraining from './StyleTraining';
import Biography from './Biography';
import Estadisticas from './Estadisticas';
import './MasterDetail.css';

export default function MasterDetail({ master, onBack }) {
  const [mode, setMode] = useState(null);

  if (mode === 'play') {
    return <PlayMaster master={master} onBack={() => setMode(null)} />;
  }
  
  if (mode === 'games') {
    return <PartidasFamosas jugadorId={master.id} jugadorNombre={master.name} onBack={() => setMode(null)} />;
  }
  
  if (mode === 'training') {
    return <StyleTraining master={master} onBack={() => setMode(null)} />;
  }
  
  if (mode === 'bio') {
    return <Biography master={master} onBack={() => setMode(null)} />;
  }

  if (mode === 'stats') {
    return <Estadisticas jugadorId={master.id} jugadorNombre={master.name} onBack={() => setMode(null)} />;
  }

  return (
    <div className="master-detail">
      <button className="back-btn" onClick={onBack}>← Volver</button>
      
      <div className="detail-header" style={{ borderTopColor: master.color }}>
        <div className="detail-photo">
          <img src={master.photo} alt={master.name} />
        </div>
        <div className="detail-info">
          <h1>{master.fullName}</h1>
          <p className="years">{master.years}</p>
          <p className="nationality">🌍 {master.nationality}</p>
          <div className="rating-badge">Rating: {master.rating}</div>
        </div>
      </div>

      <div className="detail-content">
        <section className="section">
          <h2>Logros</h2>
          <ul>
            {master.titles.map((title, i) => (
              <li key={i}>{title}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Estilo de Juego</h2>
          <p>{master.style}</p>
        </section>

        <section className="section quote-section">
          <h2>Frase Célebre</h2>
          <blockquote>"{master.quote}"</blockquote>
        </section>

        <section className="section">
          <h2>Estadísticas</h2>
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{master.famousGames}</span>
              <span className="stat-label">Partidas Famosas</span>
            </div>
            <div className="stat">
              <span className="stat-value">{master.rating}</span>
              <span className="stat-label">Rating Histórico</span>
            </div>
          </div>
        </section>

        <section className="section actions">
          <h2>Entrenar con {master.name}</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => setMode('play')}>🎮 Jugar Contra {master.name}</button>
            <button className="action-btn" onClick={() => setMode('games')}>📚 Ver Partidas</button>
            <button className="action-btn" onClick={() => setMode('stats')}>📊 Estadísticas y Analytics</button>
            <button className="action-btn" onClick={() => setMode('training')}>🎯 Entrenar Estilo</button>
            <button className="action-btn" onClick={() => setMode('bio')}>📖 Biografía Completa</button>
          </div>
        </section>
      </div>
    </div>
  );
}
