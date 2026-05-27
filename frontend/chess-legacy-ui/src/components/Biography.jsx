import './Biography.css';

export default function Biography({ master, onBack }) {
  return (
    <div className="biography">
      <button className="back-btn" onClick={onBack}>← Volver</button>

      <div className="bio-header" style={{ borderTopColor: master.color }}>
        <img src={master.photo} alt={master.name} />
        <div>
          <h1>{master.fullName}</h1>
          <p className="years">{master.years}</p>
          <p className="nationality">🌍 {master.nationality}</p>
          {master.birthDate && <p className="years">📅 {master.birthDate}{master.deathDate ? ` – ${master.deathDate}` : ''}</p>}
        </div>
      </div>

      <div className="bio-content">

        {master.bio && (
          <section className="bio-section">
            <h2>📖 Biografía</h2>
            <p>{master.bio}</p>
          </section>
        )}

        <section className="bio-section">
          <h2>🏆 Carrera y Logros</h2>
          <p>{master.style}</p>
          <ul>
            {master.titles.map((title, i) => (
              <li key={i}>{title}</li>
            ))}
          </ul>
        </section>

        <section className="bio-section">
          <h2>💬 Frase Célebre</h2>
          <blockquote>"{master.quote}"</blockquote>
        </section>

        {master.famousGamesList && (
          <section className="bio-section">
            <h2>♟️ Partidas Imprescindibles</h2>
            <ul>
              {master.famousGamesList.map((game, i) => (
                <li key={i}>
                  <div>
                    <strong style={{ color: 'var(--accent)' }}>{game.title}</strong>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>vs {game.opponent} · {game.year}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bio-section">
          <h2>📊 Estadísticas</h2>
          <div className="bio-stats">
            <div className="bio-stat">
              <span className="bio-stat-value">{master.peakRating || master.rating}</span>
              <span className="bio-stat-label">Rating Máximo</span>
            </div>
            <div className="bio-stat">
              <span className="bio-stat-value">{master.famousGames}</span>
              <span className="bio-stat-label">Partidas Famosas</span>
            </div>
            <div className="bio-stat">
              <span className="bio-stat-value">{master.titles.length}</span>
              <span className="bio-stat-label">Títulos</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
