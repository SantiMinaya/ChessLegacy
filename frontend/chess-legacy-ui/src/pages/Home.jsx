import { useNavigate } from 'react-router-dom';
import { chessMasters } from '../data/masters';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home-header">
        <h1>♟️ Chess Legacy</h1>
        <p>Aprende de los grandes maestros de la historia</p>
      </header>
      
      <div className="masters-grid">
        {chessMasters.map(master => (
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
    </div>
  );
}
