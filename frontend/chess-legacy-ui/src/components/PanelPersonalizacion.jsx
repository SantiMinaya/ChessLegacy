import { useTheme, TEMAS, FUENTES, TAMANIOS } from '../context/ThemeContext';
import './PanelPersonalizacion.css';

export default function PanelPersonalizacion() {
  const { tema, setTema, fuente, setFuente, tamanio, setTamanio, radiosBordes, setRadiosBordes, animaciones, setAnimaciones, compacto, setCompacto } = useTheme();

  return (
    <div className="panel-pers">

      {/* Temas */}
      <section className="pers-section">
        <h3 className="pers-title">🎨 Tema de color</h3>
        <div className="pers-temas-grid">
          {Object.entries(TEMAS).map(([key, t]) => {
            const bg = t.vars['--bg-primary'];
            const acc = t.vars['--accent'];
            const border = t.vars['--border'];
            return (
              <button
                key={key}
                className={`pers-tema-btn ${tema === key ? 'active' : ''}`}
                onClick={() => setTema(key)}
                style={{ '--tema-bg': bg, '--tema-acc': acc, '--tema-border': border }}
              >
                <div className="pers-tema-preview">
                  <div className="pers-tema-bg" style={{ background: bg }}>
                    <div className="pers-tema-card" style={{ background: t.vars['--bg-card'] || 'rgba(255,255,255,0.1)', border: `1px solid ${border}` }}>
                      <div className="pers-tema-accent" style={{ background: acc }} />
                      <div className="pers-tema-text" style={{ background: t.vars['--text-muted'] || '#888' }} />
                      <div className="pers-tema-text short" style={{ background: t.vars['--text-secondary'] || '#aaa' }} />
                    </div>
                  </div>
                </div>
                <span className="pers-tema-label">{t.emoji} {t.nombre}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tipografía */}
      <section className="pers-section">
        <h3 className="pers-title">🔤 Tipografía</h3>
        <div className="pers-row">
          {Object.entries(FUENTES).map(([key, f]) => (
            <button
              key={key}
              className={`pers-chip ${fuente === key ? 'active' : ''}`}
              onClick={() => setFuente(key)}
              style={{ fontFamily: f.valor }}
            >
              {f.nombre}
            </button>
          ))}
        </div>
        <p className="pers-preview-text" style={{ fontFamily: FUENTES[fuente]?.valor }}>
          ♟️ Chess Legacy — El ajedrez es vida en miniatura
        </p>
      </section>

      {/* Tamaño de fuente */}
      <section className="pers-section">
        <h3 className="pers-title">📏 Tamaño de texto</h3>
        <div className="pers-row">
          {Object.entries(TAMANIOS).map(([key, t]) => (
            <button
              key={key}
              className={`pers-chip ${tamanio === key ? 'active' : ''}`}
              onClick={() => setTamanio(key)}
              style={{ fontSize: t.base }}
            >
              {t.nombre}
            </button>
          ))}
        </div>
      </section>

      {/* Bordes */}
      <section className="pers-section">
        <h3 className="pers-title">⬜ Bordes</h3>
        <div className="pers-row">
          {[['cuadrado', '⬛ Cuadrado', '4px'], ['normal', '▪️ Normal', '8px'], ['redondeado', '🔵 Redondeado', '16px']].map(([key, label, radius]) => (
            <button
              key={key}
              className={`pers-chip ${radiosBordes === key ? 'active' : ''}`}
              onClick={() => setRadiosBordes(key)}
            >
              <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid currentColor', borderRadius: radius, verticalAlign: 'middle', marginRight: 6 }} />
              {label.split(' ')[1]}
            </button>
          ))}
        </div>
      </section>

      {/* Opciones */}
      <section className="pers-section">
        <h3 className="pers-title">⚙️ Opciones</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Toggle label="Animaciones" desc="Transiciones y efectos visuales" value={animaciones} onChange={setAnimaciones} />
          <Toggle label="Modo compacto" desc="Reduce el espaciado entre elementos" value={compacto} onChange={setCompacto} />
        </div>
      </section>

      {/* Reset */}
      <section className="pers-section">
        <button
          className="pers-reset"
          onClick={() => { setTema('oscuro'); setFuente('sistema'); setTamanio('normal'); setRadiosBordes('normal'); setAnimaciones(true); setCompacto(false); }}
        >
          🔄 Restablecer valores por defecto
        </button>
      </section>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12, flexShrink: 0,
          background: value ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
          position: 'relative', transition: 'background var(--transition)',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: value ? 'var(--accent-text)' : '#fff',
          transition: 'left var(--transition)',
        }} />
      </div>
      <div>
        <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
      </div>
    </label>
  );
}
