import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MasterDetail from './components/MasterDetail';
import LoginPage from './pages/LoginPage';
import { chessMasters } from './data/masters';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user, logout } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <BrowserRouter>
      <div className="app-header">
        <span className="app-header-user">👤 {user.username}</span>
        <button className="app-header-logout" onClick={logout}>Cerrar sesión</button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/master/:id" element={<MasterDetailWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

function MasterDetailWrapper() {
  const id = parseInt(window.location.pathname.split('/').pop());
  const master = chessMasters.find(m => m.id === id);
  return master ? <MasterDetail master={master} onBack={() => window.location.href = '/'} /> : <Home />;
}

export default App;
