import { useState } from 'react';
import PlayMaster from './PlayMaster';
import PartidasFamosas from '../pages/PartidasFamosas';
import StyleTraining from './StyleTraining';
import Biography from './Biography';
import Estadisticas from './Estadisticas';
import AperturaTraining from './AperturaTraining';
import './MasterDetail.css';

export default function MasterDetail({ master, onBack }) {
  const [mode, setMode] = useState(null);
  const [filtrosIniciales, setFiltrosIniciales] = useState(null);

  const abrirPartida = (filtros) => {
    setFiltrosIniciales(filtros);
    setMode('games');
  };

  if (mode === 'play') {
    return <PlayMaster master={master} onBack={() => setMode(null)} />;
  }
  
  if (mode === 'games') {
    return <PartidasFamosas jugadorId={master.id} jugadorNombre={master.name} filtrosIniciales={filtrosIniciales} onBack={() => { setMode(null); setFiltrosIniciales(null); }} />;
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

  if (mode === 'openings') {
    return <AperturaTraining onBack={() => setMode(null)} />;
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
              <span className="stat-value">{master.peakRating || master.rating}</span>
              <span className="stat-label">Rating Máximo</span>
            </div>
          </div>
        </section>

        {master.bio && (
          <section className="section">
            <h2>Biografía</h2>
            <p style={{ lineHeight: '1.7', opacity: 0.9 }}>{master.bio}</p>
            {master.birthDate && <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.7 }}>📅 Nacimiento: {master.birthDate}</p>}
            {master.deathDate && <p style={{ fontSize: '14px', opacity: 0.7 }}>✝️ Fallecimiento: {master.deathDate}</p>}
          </section>
        )}

        {master.famousGamesList && (
          <section className="section">
            <h2>Partidas Imprescindibles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {master.famousGamesList.map((game, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', borderLeft: `3px solid ${master.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', color: '#d4af37' }}>{game.title}</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', opacity: 0.7 }}>vs {game.opponent} · {game.year} · {game.event}</p>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{game.why}</p>
                    </div>
                    <button
                      onClick={() => abrirPartida(game.filtros)}
                      style={{ marginLeft: '16px', padding: '8px 14px', background: master.color, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px' }}
                    >
                      🔍 Ver partida
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="section actions">
          <h2>Entrenar con {master.name}</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => setMode('play')}>🎮 Jugar Contra {master.name}</button>
            <button className="action-btn" onClick={() => setMode('games')}>📚 Ver Partidas</button>
            <button className="action-btn" onClick={() => setMode('stats')}>📊 Estadísticas y Analytics</button>
            <button className="action-btn" onClick={() => setMode('training')}>🎯 Entrenar Estilo</button>
            <button className="action-btn" onClick={() => setMode('openings')}>📖 Aprender Aperturas</button>
            <button className="action-btn" onClick={() => setMode('bio')}>📖 Biografía Completa</button>
          </div>
        </section>
      </div>
    </div>
  );
}
