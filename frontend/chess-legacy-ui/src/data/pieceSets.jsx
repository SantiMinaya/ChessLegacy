// Sets de piezas SVG inline — sin dependencias externas

// Colores por set
const COLORS = {
  neo:   { w: '#ffffff', b: '#1a1a1a', stroke: '#333', wStroke: '#555', bStroke: '#000' },
  flat:  { w: '#f5f0e8', b: '#4a3728', stroke: 'none', wStroke: 'none', bStroke: 'none' },
};

function makePiece(paths, color, stroke) {
  return ({ squareWidth }) => (
    <svg viewBox="0 0 45 45" width={squareWidth} height={squareWidth}>
      <g style={{ fill: color, stroke, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        {paths}
      </g>
    </svg>
  );
}

// Paths SVG estilo "Neo" (formas limpias y modernas)
const NEO_PATHS = {
  K: (c, s) => makePiece(<>
    <path d="M22.5 11.63V6M20 8h5" style={{stroke:s,strokeWidth:1.5,fill:'none'}}/>
    <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" style={{fill:c,stroke:s}}/>
    <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0" style={{fill:'none',stroke:s}}/>
  </>, c, s),
  Q: (c, s) => makePiece(<>
    <circle cx="6" cy="12" r="2.75" style={{fill:c,stroke:s}}/>
    <circle cx="14" cy="9" r="2.75" style={{fill:c,stroke:s}}/>
    <circle cx="22.5" cy="8" r="2.75" style={{fill:c,stroke:s}}/>
    <circle cx="31" cy="9" r="2.75" style={{fill:c,stroke:s}}/>
    <circle cx="39" cy="12" r="2.75" style={{fill:c,stroke:s}}/>
    <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6L22.5 10l-3 14.5L14 11l-.3 14L7 14 9 26z" style={{fill:c,stroke:s,strokeLinecap:'butt'}}/>
    <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1 1.5 1 2.5 1 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 .5-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" style={{fill:c,stroke:s,strokeLinecap:'butt'}}/>
  </>, c, s),
  R: (c, s) => makePiece(<>
    <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14h23v-5h-4v2h-5V9h-5v2h-5V9h-4v5z" style={{fill:c,stroke:s,strokeLinecap:'butt'}}/>
    <path d="M34 14H11l3 2.5v13L11 32h23l-3-2.5v-13L34 14z" style={{fill:c,stroke:s,strokeLinecap:'butt'}}/>
  </>, c, s),
  B: (c, s) => makePiece(<>
    <path d="M9 36c3.39-1 10.11.43 13.5-2 3.39 2.43 10.11 1 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-1-10.11.43-13.5-1-3.39 1.43-10.11 0-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" style={{fill:c,stroke:s}}/>
    <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" style={{fill:c,stroke:s}}/>
    <circle cx="22.5" cy="8" r="2.5" style={{fill:c,stroke:s}}/>
  </>, c, s),
  N: (c, s) => makePiece(<>
    <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-20" style={{fill:c,stroke:s}}/>
    <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" style={{fill:c,stroke:s}}/>
    <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" style={{fill:s,stroke:s}}/>
  </>, c, s),
  P: (c, s) => makePiece(<>
    <path d="M22 9a4 4 0 0 0-3.22 6.38C16.83 16.5 15.5 18.59 15.5 21c0 2.03.94 3.84 2.41 5.03C14.91 27.09 10.5 31.58 10.5 39.5h23c0-7.92-4.41-12.41-7.41-13.47A6.5 6.5 0 0 0 28.5 21c0-2.41-1.33-4.5-3.28-5.62A4 4 0 0 0 22 9z" style={{fill:c,stroke:s}}/>
  </>, c, s),
};

// Flat style — formas geométricas simples sin stroke
const FLAT_PATHS = {
  K: (c) => makePiece(<>
    <rect x="19" y="5" width="7" height="3" rx="1" style={{fill:c,stroke:'none'}}/>
    <rect x="21" y="3" width="3" height="7" rx="1" style={{fill:c,stroke:'none'}}/>
    <path d="M10 38h25v-8l4-4v-6l-4-2-3 3-2-8-8-3-8 3-2 8-3-3-4 2v6l4 4v8z" style={{fill:c,stroke:'none'}}/>
  </>, c, 'none'),
  Q: (c) => makePiece(<>
    <circle cx="6" cy="11" r="3" style={{fill:c,stroke:'none'}}/>
    <circle cx="14" cy="8" r="3" style={{fill:c,stroke:'none'}}/>
    <circle cx="22.5" cy="7" r="3" style={{fill:c,stroke:'none'}}/>
    <circle cx="31" cy="8" r="3" style={{fill:c,stroke:'none'}}/>
    <circle cx="39" cy="11" r="3" style={{fill:c,stroke:'none'}}/>
    <path d="M8 26l1-13 5 11 3-13 3 13 3-13 3 13 5-11 1 13c-8-2-16-2-24 0z" style={{fill:c,stroke:'none'}}/>
    <path d="M8 26c0 3 1 4 2 5s1 3 1 5h23c0-2 0-4 1-5s2-2 2-5c-8-2-21-2-29 0z" style={{fill:c,stroke:'none'}}/>
  </>, c, 'none'),
  R: (c) => makePiece(<>
    <path d="M10 38h25v-4H10v4zM13 34v-5h19v5H13zM12 14h21v15H12V14zM11 9h5v5h-5V9zM19 9h7v5h-7V9zM29 9h5v5h-5V9z" style={{fill:c,stroke:'none'}}/>
  </>, c, 'none'),
  B: (c) => makePiece(<>
    <circle cx="22.5" cy="8" r="3" style={{fill:c,stroke:'none'}}/>
    <path d="M22.5 11c-8 3-9 12-4 15h-4v3h16v-3h-4c5-3 4-12-4-15z" style={{fill:c,stroke:'none'}}/>
    <path d="M10 37h25v-3H10v3z" style={{fill:c,stroke:'none'}}/>
  </>, c, 'none'),
  N: (c) => makePiece(<>
    <path d="M13 37h20v-3l-3-3c0-5 3-8 3-14-2-5-6-8-11-8-3 0-5 1-7 3l2 3-3 1v3l3 1-1 4 3 1v8l-3 1v3z" style={{fill:c,stroke:'none'}}/>
  </>, c, 'none'),
  P: (c) => makePiece(<>
    <circle cx="22.5" cy="13" r="5" style={{fill:c,stroke:'none'}}/>
    <path d="M17 20c-2 2-3 5-3 8h17c0-3-1-6-3-8H17z" style={{fill:c,stroke:'none'}}/>
    <path d="M13 39h19v-3c-2-4-5-6-6-8H19c-1 2-4 4-6 8v3z" style={{fill:c,stroke:'none'}}/>
  </>, c, 'none'),
};

function buildSet(paths, wColor, bColor, wStroke, bStroke) {
  const map = {};
  const pieces = ['K','Q','R','B','N','P'];
  for (const p of pieces) {
    map[`w${p}`] = paths[p](wColor, wStroke);
    map[`b${p}`] = paths[p](bColor, bStroke);
  }
  return map;
}

export const CUSTOM_PIECE_SETS = {
  neo:  buildSet(NEO_PATHS,  '#ffffff', '#1a1a1a', '#333333', '#000000'),
  flat: buildSet(FLAT_PATHS, '#f5f0e8', '#3d2b1f', 'none',    'none'),
};
