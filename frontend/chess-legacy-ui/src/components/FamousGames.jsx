import { useState } from 'react';
import './FamousGames.css';

const sampleGames = [
  {
    id: 1,
    event: "Campeonato Mundial",
    year: 1960,
    opponent: "Botvinnik",
    result: "1-0",
    pgn: "1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7"
  },
  {
    id: 2,
    event: "Torneo de Candidatos",
    year: 1959,
    opponent: "Fischer",
    result: "1-0",
    pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6"
  }
];

export default function FamousGames({ master, onBack }) {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="famous-games">
      <button className="back-btn" onClick={onBack}>← Volver</button>
      
      <div className="games-header" style={{ borderTopColor: master.color }}>
        <h1>Partidas Famosas de {master.name}</h1>
        <p>Explora las mejores partidas de la historia</p>
      </div>

      <div className="games-grid">
        {sampleGames.map(game => (
          <div key={game.id} className="game-card" onClick={() => setSelectedGame(game)}>
            <h3>{game.event} ({game.year})</h3>
            <p className="opponent">vs {game.opponent}</p>
            <p className="result">{game.result}</p>
          </div>
        ))}
      </div>

      {selectedGame && (
        <div className="game-viewer">
          <h2>{selectedGame.event} - {master.name} vs {selectedGame.opponent}</h2>
          <pre>{selectedGame.pgn}</pre>
          <button onClick={() => setSelectedGame(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
