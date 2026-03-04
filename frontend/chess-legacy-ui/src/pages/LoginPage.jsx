import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn = mode === 'login' ? authAPI.login : authAPI.register;
      const r = await fn(username, password);
      login(r.data);
    } catch (err) {
      setError(err.response?.data || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">♟️</div>
        <h1>Chess Legacy</h1>
        <p className="login-subtitle">Aprende de los grandes maestros</p>

        <div className="login-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Iniciar sesión</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Registrarse</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading || !username || !password}>
            {loading ? '⏳ Cargando...' : mode === 'login' ? '🚀 Entrar' : '✅ Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
