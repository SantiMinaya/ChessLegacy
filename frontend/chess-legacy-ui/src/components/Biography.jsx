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
        </div>
      </div>

      <div className="bio-content">
        <section className="bio-section">
          <h2>Vida Temprana</h2>
          <p>Información sobre los primeros años y cómo aprendió ajedrez...</p>
        </section>

        <section className="bio-section">
          <h2>Carrera Profesional</h2>
          <p>{master.style}</p>
          <ul>
            {master.titles.map((title, i) => (
              <li key={i}>{title}</li>
            ))}
          </ul>
        </section>

        <section className="bio-section">
          <h2>Legado</h2>
          <blockquote>"{master.quote}"</blockquote>
          <p>Su influencia en el ajedrez moderno y contribuciones a la teoría...</p>
        </section>

        <section className="bio-section">
          <h2>Estadísticas</h2>
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{master.rating}</span>
              <span className="stat-label">Rating Histórico</span>
            </div>
            <div className="stat">
              <span className="stat-value">{master.famousGames}</span>
              <span className="stat-label">Partidas Famosas</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
