import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MasterDetail from './components/MasterDetail';
import { chessMasters } from './data/masters';
import './App.css';

function App() {
  return (
    <BrowserRouter>
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
