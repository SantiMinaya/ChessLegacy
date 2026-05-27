import { useState } from 'react';
import PlayMaster from './PlayMaster';
import PartidasFamosas from '../pages/PartidasFamosas';
import StyleTraining from './StyleTraining';
import Biography from './Biography';
import Estadisticas from './Estadisticas';
import VisorPartidaFamosa from './VisorPartidaFamosa';
import './MasterDetail.css';

export default function MasterDetail({ master, onBack }) {
  const [mode, setMode] = useState(null);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);

  // Abre el visor directo con el PGN embebido
  const abrirPartidaDirecta = (game) => {
    setPartidaSeleccionada(game);
    setMode('visor');
  };

  if (mode === 'play') {
    return <PlayMaster master={master} onBack={() => setMode(null)} />;
  }

  if (mode === 'visor') {
    return <VisorPartidaFamosa game={partidaSeleccionada} onBack={() => { setMode(null); setPartidaSeleccionada(null); }} />;
  }

  if (mode === 'games') {
    return <PartidasFamosas jugadorId={master.id} jugadorNombre={master.name} filtrosIniciales={null} onBack={() => setMode(null)} />;
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
            <h2>♟️ Partidas Imprescindibles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {master.famousGamesList.map((game, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '10px', padding: '18px 20px',
                  borderLeft: `4px solid ${master.color}`,
                  border: `1px solid var(--border)`,
                  borderLeftColor: master.color,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 6px 0', color: '#d4af37', fontSize: 15 }}>{game.title}</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                        vs {game.opponent} · {game.year} · {game.event}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        {game.why}
                      </p>
                    </div>
                    <button
                      onClick={() => abrirPartidaDirecta(game)}
                      style={{
                        flexShrink: 0,
                        padding: '10px 16px',
                        background: master.color,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.target.style.opacity = '0.8'}
                      onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      ▶ Ver partida
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
            <button className="action-btn" onClick={() => setMode('games')}>📚 Ver Todas las Partidas</button>
            <button className="action-btn" onClick={() => setMode('stats')}>📊 Estadísticas y Analytics</button>
            <button className="action-btn" onClick={() => setMode('training')}>🎯 Entrenar Estilo</button>
            <button className="action-btn" onClick={() => setMode('bio')}>📖 Biografía Completa</button>
          </div>
        </section>
      </div>
    </div>
  );
}
