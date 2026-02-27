import { useState } from 'react';
import { chessMasters } from '../data/masters';
import MasterCard from '../components/MasterCard';
import MasterDetail from '../components/MasterDetail';
import './Home.css';

export default function Home() {
  const [selectedMaster, setSelectedMaster] = useState(null);

  if (selectedMaster) {
    return <MasterDetail master={selectedMaster} onBack={() => setSelectedMaster(null)} />;
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>♟️ Chess Legacy</h1>
        <p>Aprende de los grandes maestros de la historia</p>
      </header>
      
      <div className="masters-grid">
        {chessMasters.map(master => (
          <MasterCard key={master.id} master={master} onClick={setSelectedMaster} />
        ))}
      </div>
    </div>
  );
}
