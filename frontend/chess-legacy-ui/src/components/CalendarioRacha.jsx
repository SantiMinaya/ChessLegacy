import { useEffect, useState } from 'react';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CalendarioRacha.css';

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default function CalendarioRacha() {
  const { user } = useAuth();
  const [diasActivos, setDiasActivos] = useState(new Set());
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    progresoAPI.getCalendario(user.token)
      .then(r => setDiasActivos(new Set(r.data)))
      .catch(() => {});
  }, [user.token]);

  // Construir cuadrícula: 53 semanas × 7 días, empezando el domingo de hace ~364 días
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Primer día: retroceder 364 días y ajustar al domingo anterior
  const inicio = new Date(hoy);
  inicio.setDate(inicio.getDate() - 364);
  inicio.setDate(inicio.getDate() - inicio.getDay()); // retroceder al domingo

  const semanas = [];
  const etiquetasMeses = []; // { semana, mes }
  let cursor = new Date(inicio);
  let semanaIdx = 0;

  while (cursor <= hoy) {
    const semana = [];
    for (let d = 0; d < 7; d++) {
      const fecha = new Date(cursor);
      const iso = fecha.toISOString().slice(0, 10);
      semana.push({ fecha, iso, futuro: fecha > hoy });
      cursor.setDate(cursor.getDate() + 1);
    }
    // Detectar cambio de mes en esta semana para la etiqueta
    const primerDia = semana[0].fecha;
    if (semanaIdx === 0 || primerDia.getDate() <= 7) {
      etiquetasMeses.push({ semana: semanaIdx, mes: MESES[primerDia.getMonth()] });
    }
    semanas.push(semana);
    semanaIdx++;
  }

  const totalActivos = diasActivos.size;

  return (
    <div className="calendario-wrap">
      <div className="calendario-header">
        <span>{totalActivos} día{totalActivos !== 1 ? 's' : ''} activo{totalActivos !== 1 ? 's' : ''} en el último año</span>
      </div>
      <div className="calendario-scroll">
        <div className="calendario-grid-wrap">
          {/* Etiquetas de meses */}
          <div className="calendario-meses">
            {etiquetasMeses.map((e, i) => (
              <span key={i} style={{ gridColumn: e.semana + 1 }}>{e.mes}</span>
            ))}
          </div>
          {/* Días de la semana */}
          <div className="calendario-dias-semana">
            {['D','L','M','X','J','V','S'].map((d, i) => (
              <span key={i}>{i % 2 === 1 ? d : ''}</span>
            ))}
          </div>
          {/* Cuadrícula */}
          <div className="calendario-grid">
            {semanas.map((semana, si) => (
              <div key={si} className="calendario-col">
                {semana.map(({ fecha, iso, futuro }) => {
                  const activo = diasActivos.has(iso);
                  const label = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  return (
                    <div
                      key={iso}
                      className={`calendario-celda ${futuro ? 'futuro' : activo ? 'activo' : 'inactivo'}`}
                      onMouseEnter={e => setTooltip({ text: activo ? `✅ ${label}` : label, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="calendario-leyenda">
          <span>Menos</span>
          <div className="calendario-celda inactivo" />
          <div className="calendario-celda activo" />
          <span>Más</span>
        </div>
      </div>
      {tooltip && (
        <div className="calendario-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
