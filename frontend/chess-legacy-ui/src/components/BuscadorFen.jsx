import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { partidasAPI } from '../services/api';
import { useBoardTheme } from '../context/BoardThemeContext';

export default function BuscadorFen({ onVerPartida }) {
  const { boardProps } = useBoardTheme();
  const [fen, setFen] = useState('');
  const [preview, setPreview] = useState(null);
  const [fenError, setFenError] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const validarFen = (f) => {
    try { new Chess(f); return true; } catch { return false; }
  };

  const handleFenChange = (e) => {
    const val = e.target.value;
    setFen(val);
    setFenError('');
    if (val.trim() && validarFen(val.trim())) {
      setPreview(val.trim());
    } else {
      setPreview(null);
    }
  };

  const buscar = async () => {
    if (!fen.trim()) return;
    if (!validarFen(fen.trim())) { setFenError('FEN inválido'); return; }
    setBuscando(true);
    setBuscado(false);
    try {
      const r = await partidasAPI.buscarPorFen(fen.trim());
      setResultados(r.data);
      setBuscado(true);
    } catch { setResultados([]); setBuscado(true); }
    finally { setBuscando(false); }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ color: '#d4af37', margin: '0 0 8px' }}>🔍 Buscar posición por FEN</h2>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 20px' }}>
        Pega un FEN y busca si alguna de las 20.000+ partidas históricas pasó por esa posición
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={fen}
          onChange={handleFenChange}
          placeholder="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
          style={{
            flex: 1, minWidth: 300, padding: '10px 14px', borderRadius: 8, fontSize: 13,
            background: 'rgba(255,255,255,0.07)', color: '#e0e0e0', outline: 'none',
            border: `1px solid ${fenError ? '#f44336' : 'rgba(212,175,55,0.3)'}`,
          }}
          onKeyDown={e => e.key === 'Enter' && buscar()}
        />
        <button
          onClick={buscar}
          disabled={buscando}
          style={{
            padding: '10px 20px', borderRadius: 8, background: '#d4af37',
            border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#1a1a2e',
          }}
        >
          {buscando ? '⏳ Buscando...' : '🔍 Buscar'}
        </button>
      </div>
      {fenError && <p style={{ color: '#f44336', fontSize: 12, margin: '-12px 0 12px' }}>{fenError}</p>}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {preview && (
          <div style={{ flexShrink: 0 }}>
            <p style={{ color: '#888', fontSize: 12, margin: '0 0 8px' }}>Vista previa</p>
            <Chessboard position={preview} arePiecesDraggable={false} boardWidth={240} {...boardProps} />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 200 }}>
          {buscado && (
            resultados.length === 0 ? (
              <div style={{ color: '#888', fontSize: 14, padding: '20px 0' }}>
                No se encontraron partidas con esa posición
              </div>
            ) : (
              <>
                <p style={{ color: '#4caf50', fontSize: 13, margin: '0 0 12px' }}>
                  ✅ {resultados.length} partida{resultados.length !== 1 ? 's' : ''} encontrada{resultados.length !== 1 ? 's' : ''}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {resultados.map(p => (
                    <div key={p.id} style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#e0e0e0', fontSize: 14, fontWeight: 500 }}>
                          vs {p.oponente} · {p.anio}
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          {p.evento} · {p.nombreApertura || 'Sin apertura'}
                        </div>
                      </div>
                      <span style={{
                        color: p.resultado === '1-0' ? '#4caf50' : p.resultado === '0-1' ? '#f44336' : '#ff9800',
                        fontWeight: 'bold', fontSize: 13,
                      }}>{p.resultado}</span>
                      {onVerPartida && (
                        <button
                          onClick={() => onVerPartida(p.id)}
                          style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                        >
                          Ver
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
