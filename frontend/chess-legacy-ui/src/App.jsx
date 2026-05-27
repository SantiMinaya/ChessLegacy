import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import MasterDetail from './components/MasterDetail';
import LoginPage from './pages/LoginPage';
import { chessMasters } from './data/masters';
import { useAuth } from './context/AuthContext';
import { useTheme, TEMAS } from './context/ThemeContext';
import AnalisisPartida from './components/AnalisisPartida';
import { partidasAPI } from './services/api';
import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const { user, logout } = useAuth();
  const { tema, setTema } = useTheme();

  if (!user) return <LoginPage />;

  // Ciclo rápido entre temas con un botón
  const temasKeys = Object.keys(TEMAS);
  const nextTema = () => {
    const idx = temasKeys.indexOf(tema);
    setTema(temasKeys[(idx + 1) % temasKeys.length]);
  };

  return (
    <BrowserRouter>
      <div className="app-header">
        <button
          onClick={nextTema}
          title={`Tema: ${TEMAS[tema]?.nombre}`}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
        >
          {TEMAS[tema]?.emoji}
        </button>
        <span className="app-header-user">👤 {user.username}</span>
        <button className="app-header-logout" onClick={logout}>Cerrar sesión</button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/master/:id" element={<MasterDetailWrapper />} />
        <Route path="/partida/:id" element={<PartidaDetailWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

function MasterDetailWrapper() {
  const id = parseInt(window.location.pathname.split('/').pop());
  const master = chessMasters.find(m => m.id === id);
  return master ? <MasterDetail master={master} onBack={() => window.location.href = '/'} /> : <Home />;
}

function PartidaDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partida, setPartida] = useState(null);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    partidasAPI.getById(id)
      .then(res => {
        const p = res.data;
        setPartida(p);
        
        try {
          const g = new Chess();
          g.loadPgn(p.pgn);
          const history = g.history({ verbose: true });
          const parsedMoves = history.map(m => ({ san: m.san }));
          setMoves(parsedMoves);
        } catch (e) {
          console.error("Error parsing PGN", e);
          setError("Error al procesar el PGN de la partida.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("No se pudo cargar la partida o no existe.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div style={{ width: 50, height: 50, border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'analisis-spin 1s linear infinite' }} />
        <p style={{ marginTop: 20, fontSize: 16 }}>Cargando partida y análisis...</p>
      </div>
    );
  }

  if (error || !partida) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: 20 }}>
        <h2 style={{ color: 'var(--error)' }}>⚠️ Error</h2>
        <p style={{ margin: '10px 0 20px', textAlign: 'center' }}>{error || "Partida no encontrada."}</p>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'var(--bg-primary)', fontWeight: 'bold', cursor: 'pointer' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <AnalisisPartida 
      moves={moves}
      masterName={partida.colorJugador === 'Blancas' ? partida.oponente : 'el Gran Maestro'}
      onClose={() => navigate('/')}
    />
  );
}

export default App;
