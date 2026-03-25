import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chessMasters } from '../data/masters';
import AperturaTraining from '../components/AperturaTraining';
import PerfilUsuario from '../components/PerfilUsuario';
import TournamentMode from '../components/TournamentMode';
import PartidaDelDia from '../components/PartidaDelDia';
import RetosDelDia from '../components/RetosDelDia';
import AnalisisLibre from '../components/AnalisisLibre';
import BuscadorFen from '../components/BuscadorFen';
import ComparadorMaestros from '../components/ComparadorMaestros';
import MapaCalor from '../components/MapaCalor';
import HistorialPartidas from '../components/HistorialPartidas';
import AnalisisPuntosDebiles from '../components/AnalisisPuntosDebiles';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('masters');
  const [orden, setOrden] = useState('default');

  const [analisisTab, setAnalisisTab] = useState('libre');

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
        <button className={tab === 'masters' ? 'active' : ''} onClick={() => setTab('masters')}>👑 Maestros</button>
        <button className={tab === 'openings' ? 'active' : ''} onClick={() => setTab('openings')}>📖 Aperturas</button>
        <button className={tab === 'tournament' ? 'active' : ''} onClick={() => setTab('tournament')}>🏆 Torneo</button>
        <button className={tab === 'analisis' ? 'active' : ''} onClick={() => setTab('analisis')}>🔬 Análisis</button>
        <button className={tab === 'historial' ? 'active' : ''} onClick={() => setTab('historial')}>📚 Historial</button>
        <button className={tab === 'perfil' ? 'active' : ''} onClick={() => setTab('perfil')}>👤 Perfil</button>
      </div>

      {tab === 'openings' && <AperturaTraining onBack={() => setTab('masters')} hideBack />}
      {tab === 'tournament' && <TournamentMode onBack={() => setTab('masters')} />}
      {tab === 'historial' && (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <HistorialPartidas />
        </div>
      )}
      {tab === 'perfil' && <PerfilUsuario />}
      {tab === 'analisis' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            {[['libre', '🔬 Análisis libre'], ['fen', '🔍 Buscar por FEN'], ['comparar', '⚔️ Comparar Maestros'], ['calor', '🔥 Mapa de Calor'], ['debiles', '🔎 Puntos Débiles']].map(([v, l]) => (
              <button key={v} onClick={() => setAnalisisTab(v)} style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid #d4af37',
                background: analisisTab === v ? '#d4af37' : 'transparent',
                color: analisisTab === v ? '#1a1a2e' : '#d4af37',
                cursor: 'pointer', fontWeight: analisisTab === v ? 'bold' : 'normal',
              }}>{l}</button>
            ))}
          </div>
          {analisisTab === 'libre' && <AnalisisLibre />}
          {analisisTab === 'fen' && <BuscadorFen onVerPartida={(id) => navigate(`/partida/${id}`)} />}
          {analisisTab === 'comparar' && <ComparadorMaestros />}
          {analisisTab === 'calor' && <MapaCalor />}
          {analisisTab === 'debiles' && <AnalisisPuntosDebiles />}
        </div>
      )}

      {tab === 'masters' && (
        <>
          <PartidaDelDia onVerPartida={(id) => navigate(`/partida/${id}`)} />
          <RetosDelDia />
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
