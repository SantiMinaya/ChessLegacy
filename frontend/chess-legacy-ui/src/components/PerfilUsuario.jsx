import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progresoAPI } from '../services/api';
import { useBoardTheme, BOARD_THEMES, PIECE_SETS } from '../context/BoardThemeContext';
import { CUSTOM_PIECE_SETS } from '../data/pieceSets';
import CalendarioRacha from './CalendarioRacha';
import { getNivel } from '../data/niveles';
import { jsPDF } from 'jspdf';
import EstadisticasJuego from './EstadisticasJuego';
import PanelPersonalizacion from './PanelPersonalizacion';
import TablaClasificacion from './TablaClasificacion';
import GraficoXP from './GraficoXP';
import MisionesSemanales from './MisionesSemanales';
import './PerfilUsuario.css';

const LOGROS_INFO = {
  PRIMERA_APERTURA:    { nombre: 'Primera Apertura',   desc: 'Completa tu primera sesión',                    emoji: '🎓' },
  PRECISION_100:       { nombre: 'Perfección',          desc: 'Completa una apertura con 100% de precisión',   emoji: '💯' },
  DIEZ_APERTURAS:      { nombre: 'Estudioso',           desc: 'Practica 10 aperturas distintas',               emoji: '📚' },
  CINCUENTA_ACIERTOS:  { nombre: 'Buen Estudiante',     desc: 'Acumula 50 movimientos correctos',              emoji: '🎯' },
  CIEN_ACIERTOS:       { nombre: 'Experto',             desc: 'Acumula 100 movimientos correctos',             emoji: '🏅' },
  QUINIENTOS_ACIERTOS: { nombre: 'Gran Maestro',        desc: 'Acumula 500 movimientos correctos',             emoji: '👑' },
  CONTRARRELOJ_LIMPIO: { nombre: 'Sin Tiempo',          desc: 'Contrarreloj sin ningún timeout',               emoji: '⚡' },
  CINCO_SESIONES:      { nombre: 'Constante',           desc: 'Realiza 5 sesiones de entrenamiento',           emoji: '🔥' },
  VEINTE_SESIONES:     { nombre: 'Dedicado',            desc: 'Realiza 20 sesiones de entrenamiento',          emoji: '⭐' },
  ADIVINA_PERFECTO:    { nombre: 'Reconocedor',         desc: 'Consigue 5/5 en Adivina la Apertura',           emoji: '🤔' },
  PRIMER_TORNEO:       { nombre: 'Debutante',            desc: 'Completa tu primer torneo',                     emoji: '🎪' },
  PRIMER_TORNEO_GANADO:{ nombre: 'Campeón',              desc: 'Gana tu primer torneo',                         emoji: '🏆' },
  CINCO_TORNEOS:       { nombre: 'Veterano',             desc: 'Completa 5 torneos',                            emoji: '🎖️' },
  TORNEO_PERFECTO:     { nombre: 'Invicto',              desc: 'Gana un torneo sin perder ninguna ronda',       emoji: '👑' },
  VENCE_TODOS_MAESTROS:{ nombre: 'Conquistador',         desc: 'Gana al menos un torneo contra cada maestro',   emoji: '⚔️' },
  TORNEO_BALA:         { nombre: 'Rayo',              desc: 'Gana un torneo con tiempo bala (≤2 min)',       emoji: '⚡' },
  BLINDFOLD_WIN:        { nombre: 'Ciego',             desc: 'Gana una partida en modo blindfold',              emoji: '🙈' },
  SUPERVIVIENTE_20:     { nombre: 'Superviviente',     desc: 'Llega al puzzle 20 en modo supervivencia',        emoji: '💀' },
  SPEED_RUNNER:         { nombre: 'Speed Runner',      desc: 'Completa una apertura en menos de 30 segundos',  emoji: '⚡' },
  SEMANA_COMPLETA:      { nombre: 'Semana Completa',   desc: 'Mantén una racha de 7 días consecutivos',         emoji: '📅' },
  GEOGRAFO:             { nombre: 'Geógrafo',           desc: 'Acierta 100 casillas en Aprender Casillas',       emoji: '🗺️' },
  ANALISTA:             { nombre: 'Analista',           desc: 'Analiza 10 partidas post-partida',                emoji: '🔍' },
  PATRON_MAESTRO:       { nombre: 'Patrón Maestro',     desc: 'Completa los 5 patrones tácticos',                emoji: '🧩' },
};

const TODOS_LOGROS = Object.keys(LOGROS_INFO);

export default function PerfilUsuario() {
  const { user } = useAuth();
  const { boardTheme, setBoardTheme, pieceSet, setPieceSet, showLegalMoves, setShowLegalMoves } = useBoardTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partidas, setPartidas] = useState([]);
  const [foto, setFoto] = useState(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  useEffect(() => {
    progresoAPI.get(user.token)
      .then(r => setData(r.data))
      .catch(() => setData({ progresos: [], logros: [] }))
      .finally(() => setLoading(false));
    progresoAPI.getPartidas(user.token)
      .then(r => setPartidas(r.data))
      .catch(() => {});
  }, [user.token]);

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendoFoto(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      try {
        await progresoAPI.subirFoto(user.token, base64);
        setFoto(base64);
      } catch {}
      setSubiendoFoto(false);
    };
    reader.readAsDataURL(file);
  };

  const exportPgn = (pgn, maestro, fecha) => {
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vs_${maestro.replace(' ', '_')}_${fecha.slice(0,10)}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    if (!data) return;
    const { progresos, logros, rachaActual, maximaRacha, xp: xpVal = 0 } = data;
    const nivel = getNivel(xpVal);
    const logrosObt = new Set(logros.map(l => l.codigo));
    const totAciertos = progresos.reduce((s, p) => s + p.aciertos, 0);
    const totSesiones = progresos.reduce((s, p) => s + p.sesiones, 0);
    const apDistintas = new Set(progresos.map(p => p.apertura)).size;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text('Chess Legacy — Estadísticas', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Usuario: ${user.username}`, 20, 35);
    doc.text(`Nivel: ${nivel.nombre} (${xpVal} XP)`, 20, 43);
    doc.text(`Racha actual: ${rachaActual} dias`, 20, 51);
    doc.text(`Maxima racha: ${maximaRacha} dias`, 20, 59);
    doc.text(`Sesiones totales: ${totSesiones}`, 20, 67);
    doc.text(`Aciertos totales: ${totAciertos}`, 20, 75);
    doc.text(`Aperturas practicadas: ${apDistintas}`, 20, 83);
    doc.text(`Logros: ${logrosObt.size}/${TODOS_LOGROS.length}`, 20, 91);
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.text('Progreso por Apertura', 20, 105);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let y = 115;
    progresos.filter(p => !p.apertura.startsWith('__torneo__')).slice(0, 20).forEach(p => {
      const pct = p.intentos > 0 ? Math.round((p.aciertos / p.intentos) * 100) : 0;
      doc.text(`${p.apertura}${p.variante ? ' - ' + p.variante : ''}: ${pct}% (${p.sesiones} sesiones)`, 20, y);
      y += 8;
    });
    doc.save(`chess-legacy-${user.username}.pdf`);
  };

  if (loading) return <p style={{ color: '#c0c0c0', textAlign: 'center', padding: 40 }}>⏳ Cargando perfil...</p>;

  const { progresos, logros, rachaActual, maximaRacha, xp = 0 } = data;
  const nivel = getNivel(xp);
  const logrosObtenidos = new Set(logros.map(l => l.codigo));
  const totalAciertos = progresos.reduce((s, p) => s + p.aciertos, 0);
  const totalSesiones = progresos.reduce((s, p) => s + p.sesiones, 0);
  const aperturasDistintas = new Set(progresos.map(p => p.apertura)).size;

  return (
    <div className="perfil">
      <div className="perfil-header">
        <div className="perfil-avatar-wrap" style={{ position: 'relative' }}>
          {foto
            ? <img src={foto} alt="avatar" className="perfil-avatar-img" />
            : <div className="perfil-avatar">♟️</div>
          }
          <label style={{ position: 'absolute', inset: 0, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
          >
            <span style={{ opacity: 0, fontSize: 20, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >{subiendoFoto ? '⏳' : '📷'}</span>
            <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <h2>{user.username}</h2>
          <p>Miembro de Chess Legacy</p>
          <div className="nivel-badge">
            <span>{nivel.emoji} {nivel.nombre}</span>
            <span className="nivel-xp">{xp} XP</span>
          </div>
          <div className="nivel-barra-wrap">
            <div className="nivel-barra-fill" style={{ width: `${nivel.progreso}%` }} />
          </div>
          {nivel.siguiente && (
            <p className="nivel-meta">{nivel.xpEnNivel} / {nivel.xpParaSiguiente} XP → {nivel.siguiente.emoji} {nivel.siguiente.nombre}</p>
          )}
        </div>
        <button onClick={exportarPDF} style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, alignSelf: 'flex-start' }}>
          📄 Exportar PDF
        </button>
      </div>

      <div className="perfil-stats">
        <div className="perfil-stat racha">
          <span>{rachaActual} {rachaActual > 0 ? '🔥' : '—'}</span>
          <label>Racha actual</label>
        </div>
        <div className="perfil-stat">
          <span>{maximaRacha}</span>
          <label>Máxima racha</label>
        </div>
        <div className="perfil-stat"><span>{totalSesiones}</span><label>Sesiones</label></div>
        <div className="perfil-stat"><span>{totalAciertos}</span><label>Aciertos</label></div>
        <div className="perfil-stat"><span>{aperturasDistintas}</span><label>Aperturas</label></div>
        <div className="perfil-stat"><span>{logrosObtenidos.size}/{TODOS_LOGROS.length}</span><label>Logros</label></div>
      </div>

      <div className="perfil-section">
        <h3>🏆 Tabla de Clasificación</h3>
        <TablaClasificacion miId={user.id} />
      </div>

      <div className="perfil-section">
        <h3>🎯 Misiones Semanales</h3>
        <MisionesSemanales />
      </div>

      <div className="perfil-section">
        <h3>📈 Evolución XP</h3>
        <GraficoXP progresos={progresos} xpActual={xp} />
      </div>

      <div className="perfil-section">
        <h3>📅 Actividad</h3>
        <CalendarioRacha />
      </div>

      <div className="perfil-section">
        <h3>🎨 Personalización</h3>
        <PanelPersonalizacion />
      </div>

      <div className="perfil-section">
        <h3>🎨 Apariencia del Tablero</h3>
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 16px' }}>Tema del tablero</p>
        <div className="apariencia-grid">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => {
            const cells = Array.from({ length: 16 }, (_, i) => (Math.floor(i/4) + i%4) % 2 === 0 ? theme.light : theme.dark);
            return (
              <div key={key} className="apariencia-item" onClick={() => setBoardTheme(key)}>
                <div className={`apariencia-preview ${boardTheme === key ? 'selected' : ''}`}>
                  {cells.map((c, i) => <div key={i} className="apariencia-preview-cell" style={{ background: c }} />)}
                </div>
                <span className={`apariencia-label ${boardTheme === key ? 'selected' : ''}`}>{theme.name}</span>
              </div>
            );
          })}
        </div>
        <p style={{ color: '#888', fontSize: 13, margin: '20px 0 12px' }}>Set de piezas</p>
        <div className="piezas-grid">
          {Object.entries(PIECE_SETS).map(([key, set]) => {
            const wK = CUSTOM_PIECE_SETS[key]?.wK;
            const bK = CUSTOM_PIECE_SETS[key]?.bK;
            return (
              <div key={key} className="apariencia-item" onClick={() => setPieceSet(key)}>
                <div className={`pieza-preview ${pieceSet === key ? 'selected' : ''}`}>
                  {wK ? wK({ squareWidth: 36 }) : <span style={{fontSize:32}}>♔</span>}
                  {bK ? bK({ squareWidth: 36 }) : <span style={{fontSize:32}}>♚</span>}
                </div>
                <span className={`apariencia-label ${pieceSet === key ? 'selected' : ''}`}>{set.name}</span>
              </div>
            );
          })}
        </div>

        <p style={{ color: '#888', fontSize: 13, margin: '28px 0 12px' }}>Opciones de juego</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: '#e0e0e0' }}>
          <div
            onClick={() => setShowLegalMoves(!showLegalMoves)}
            style={{
              width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'background 0.2s',
              background: showLegalMoves ? '#d4af37' : '#444', position: 'relative', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3, left: showLegalMoves ? 23 : 3,
              width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
            }} />
          </div>
          Mostrar casillas disponibles al seleccionar pieza
        </label>
      </div>

      <div className="perfil-section">
        <h3>🏆 Logros</h3>
        <div className="logros-grid">
          {TODOS_LOGROS.map(codigo => {
            const info = LOGROS_INFO[codigo];
            const obtenido = logrosObtenidos.has(codigo);
            const logroData = logros.find(l => l.codigo === codigo);
            return (
              <div key={codigo} className={`logro-card ${obtenido ? 'obtenido' : 'bloqueado'}`}>
                <div className="logro-emoji">{obtenido ? info.emoji : '🔒'}</div>
                <div className="logro-info">
                  <span className="logro-nombre">{info.nombre}</span>
                  <span className="logro-desc">{info.desc}</span>
                  {obtenido && logroData && (
                    <span className="logro-fecha">{new Date(logroData.fechaObtenido).toLocaleDateString('es-ES')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {progresos.length > 0 && (
        <div className="perfil-section">
          <h3>📖 Progreso por Apertura</h3>
          <div className="progreso-lista">
            {progresos
              .filter(p => !p.apertura.startsWith('__torneo__'))
              .sort((a, b) => b.sesiones - a.sesiones)
              .map(p => {
                const pct = p.intentos > 0 ? Math.round((p.aciertos / p.intentos) * 100) : 0;
                return (
                  <div key={p.id} className="progreso-item">
                    <div className="progreso-nombre">
                      <span>{p.apertura}</span>
                      {p.variante && <span className="progreso-variante">{p.variante}</span>}
                    </div>
                    <div className="progreso-barra">
                      <div className="progreso-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="progreso-meta">
                      <span>{pct}%</span>
                      <span>{p.sesiones} sesiones</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {partidas.length > 0 && (
        <div className="perfil-section">
          <h3>📊 Estadísticas de Juego</h3>
          <EstadisticasJuego partidas={partidas} />
        </div>
      )}

      {partidas.length > 0 && (
        <div className="perfil-section">
          <h3>⚔️ Historial vs Maestros</h3>
          <div className="historial-lista">
            {partidas.map(p => (
              <div key={p.id} className="historial-item">
                <div className="historial-resultado" data-result={p.resultado}>
                  {p.resultado === 'win' ? '🏆' : p.resultado === 'draw' ? '🤝' : '💀'}
                </div>
                <div className="historial-info">
                  <span className="historial-maestro">{p.maestro}</span>
                  <span className="historial-meta">{p.totalMovimientos} movimientos · {new Date(p.fechaJugada).toLocaleDateString('es-ES')}</span>
                </div>
                <button className="historial-pgn-btn" onClick={() => exportPgn(p.pgn, p.maestro, p.fechaJugada)}>📥 PGN</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
