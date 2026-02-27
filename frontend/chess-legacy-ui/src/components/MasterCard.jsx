import './MasterCard.css';

export default function MasterCard({ master, onClick }) {
  return (
    <div className="master-card" onClick={() => onClick(master)} style={{ borderTopColor: master.color }}>
      <div className="master-photo">
        <img src={master.photo} alt={master.name} />
      </div>
      <div className="master-info">
        <h2>{master.name}</h2>
        <p className="years">{master.years}</p>
        <p className="nationality">🌍 {master.nationality}</p>
        <div className="rating">Rating: {master.rating}</div>
        <p className="style-preview">{master.style.substring(0, 80)}...</p>
      </div>
    </div>
  );
}
