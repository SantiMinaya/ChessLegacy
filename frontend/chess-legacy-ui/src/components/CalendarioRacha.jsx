import { useEffect, useState } from 'react';
import { progresoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CalendarioRacha.css';

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const getLocalISODate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function CalendarioRacha() {
  const { user } = useAuth();
  const [diasActivos, setDiasActivos] = useState(new Set());
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    progresoAPI.getCalendario(user.token)
      .then(r => setDiasActivos(new Set(r.data)))
      .catch(() => {});
  }, [user.token]);

  // Año actual: de 1 de enero a 31 de diciembre
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const anyo = hoy.getFullYear();

  // Inicio: domingo de la semana que contiene el 1 de enero
  const primerDiaAnyo = new Date(anyo, 0, 1);
  const inicio = new Date(primerDiaAnyo);
  inicio.setDate(inicio.getDate() - inicio.getDay()); // retroceder al domingo

  // Fin: sábado de la semana que contiene el 31 de diciembre
  const ultimoDiaAnyo = new Date(anyo, 11, 31);
  const fin = new Date(ultimoDiaAnyo);
  fin.setDate(fin.getDate() + (6 - fin.getDay())); // avanzar al sábado

  const semanas = [];
  const etiquetasMeses = []; // { semana, mes }
  let cursor = new Date(inicio);
  let semanaIdx = 0;
  let mesActual = -1;

  while (cursor <= fin) {
    const semana = [];
    for (let d = 0; d < 7; d++) {
      const fecha = new Date(cursor);
      const iso = getLocalISODate(fecha);
      const fueraAnyo = fecha.getFullYear() !== anyo;
      semana.push({ fecha, iso, futuro: fecha > hoy, fueraAnyo });
      cursor.setDate(cursor.getDate() + 1);
    }

    // Etiqueta de mes: detectar cuando aparece un mes nuevo en días del año en curso
    const primerDiaReal = semana.find(d => !d.fueraAnyo);
    if (primerDiaReal) {
      const mes = primerDiaReal.fecha.getMonth();
      if (mes !== mesActual) {
        mesActual = mes;
        etiquetasMeses.push({ semana: semanaIdx, mes: MESES[mes] });
      }
    }

    semanas.push(semana);
    semanaIdx++;
  }

  // Contar solo días activos dentro del año actual
  const totalActivos = [...diasActivos].filter(d => d.startsWith(`${anyo}-`)).length;

  return (
    <div className="calendario-wrap">
      <div className="calendario-header">
        <span>{totalActivos} día{totalActivos !== 1 ? 's' : ''} activo{totalActivos !== 1 ? 's' : ''} en {anyo}</span>
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
                {semana.map(({ fecha, iso, futuro, fueraAnyo }) => {
                  const activo = !fueraAnyo && diasActivos.has(iso);
                  const label = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  return (
                    <div
                      key={iso}
                      className={`calendario-celda ${fueraAnyo ? 'fuera-anyo' : futuro ? 'futuro' : activo ? 'activo' : 'inactivo'}`}
                      onMouseEnter={!fueraAnyo ? e => setTooltip({ text: activo ? `✅ ${label}` : label, x: e.clientX, y: e.clientY }) : undefined}
                      onMouseLeave={!fueraAnyo ? () => setTooltip(null) : undefined}
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
