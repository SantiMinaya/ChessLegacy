import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chessMasters } from '../data/masters';
import './InfiniteChessboard.css';

export default function InfiniteChessboard() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMasterClick = (masterId) => {
    navigate(`/master/${masterId}`);
  };

  return (
    <div className="infinite-board-container">
      <div className="board-perspective">
        <div className="chessboard-3d" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className={`square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`}
              />
            ))
          )}
        </div>

        <div className="masters-floating">
          {chessMasters.map((master, index) => (
            <div
              key={master.id}
              className="master-piece"
              style={{
                '--delay': `${index * 0.1}s`,
                '--offset': `${(index % 2) * 100 - 50}px`,
                top: `${20 + index * 12}%`
              }}
              onClick={() => handleMasterClick(master.id)}
            >
              <div className="piece-shadow" />
              <div className="piece-content">
                <img src={master.photo} alt={master.name} />
                <div className="piece-info">
                  <h3>{master.name}</h3>
                  <p>{master.years}</p>
                  <span className="rating">⭐ {master.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll para explorar</span>
        <div className="arrow-down">↓</div>
      </div>
    </div>
  );
}
