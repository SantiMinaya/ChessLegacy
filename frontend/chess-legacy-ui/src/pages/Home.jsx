import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chessMasters } from '../data/masters';
import AperturaTraining from '../components/AperturaTraining';
import PerfilUsuario from '../components/PerfilUsuario';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('masters');
  const [orden, setOrden] = useState('default');

  const masterOrdenados = [...chessMasters].sort((a, b) => {
    if (orden === 'anio-asc') return parseInt(a.years) - parseInt(b.years);
    if (orden === 'anio-desc') return parseInt(b.years) - parseInt(a.years);
    if (orden === 'rating') return b.rating - a.rating;
    return a.id - b.id;
  });

  return (
    <div className="home">
      <header className="home-header">
        <h1>♟️ Chess Legacy</h1>
        <p>Aprende de los grandes maestros de la historia</p>
      </header>

      <div className="home-tabs">
        <button className={tab === 'masters' ? 'active' : ''} onClick={() => setTab('masters')}>👑 Grandes Maestros</button>
        <button className={tab === 'openings' ? 'active' : ''} onClick={() => setTab('openings')}>📖 Aprender Aperturas</button>
        <button className={tab === 'perfil' ? 'active' : ''} onClick={() => setTab('perfil')}>👤 Mi Perfil</button>
      </div>

      {tab === 'openings' && <AperturaTraining onBack={() => setTab('masters')} hideBack />}
      {tab === 'perfil' && <PerfilUsuario />}

      {tab === 'masters' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            {[['default', 'Por defecto'], ['anio-asc', 'Año ↑'], ['anio-desc', 'Año ↓'], ['rating', 'Rating ↓']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setOrden(val)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #d4af37',
                  background: orden === val ? '#d4af37' : 'transparent',
                  color: orden === val ? '#000' : '#d4af37',
                  cursor: 'pointer',
                  fontWeight: orden === val ? 'bold' : 'normal'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="masters-grid">
            {masterOrdenados.map(master => (
              <div
                key={master.id}
                className="master-card"
                onClick={() => navigate(`/master/${master.id}`)}
              >
                <img src={master.photo} alt={master.name} />
                <div className="card-content">
                  <h3>{master.name}</h3>
                  <p className="years">{master.years}</p>
                  <p className="nationality">{master.nationality}</p>
                  <div className="rating">⭐ {master.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
