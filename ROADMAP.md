# 🗺️ Chess Legacy - Roadmap

## ✅ Completado

### Infraestructura Base
- [x] Backend ASP.NET Core 10 + SQLite + Entity Framework Core
- [x] Frontend React 18 + Vite
- [x] Integración Stockfish con profundidad configurable por petición
- [x] API REST completa con JWT + BCrypt
- [x] Importación masiva de PGN (20.550+ partidas)
- [x] Importación automática al arrancar si la BD está vacía

### Navegación
- [x] Tabs: Maestros / Aperturas / Torneo / Análisis / Perfil
- [x] Ordenación de maestros por defecto, año y rating
- [x] Botón de ciclo rápido de temas en el header

### Galería y Perfiles de Maestros
- [x] 8 maestros históricos con cards interactivas
- [x] Perfiles con biografía, logros, frases célebres, estadísticas
- [x] Partidas imprescindibles con enlace directo al visor
- [x] Acciones: Jugar, Ver Partidas, Estadísticas, Entrenar Estilo, Biografía

### Visor de Partidas
- [x] 20.550+ partidas históricas
- [x] Navegación movimiento por movimiento
- [x] Filtros por año, oponente, evento, apertura, variante
- [x] Sistema de favoritos con localStorage
- [x] Evaluación en tiempo real con Stockfish
- [x] Barra de evaluación visual (corregida: positivo = ventaja blancas)
- [x] Orientación del tablero según color del jugador

### Jugar Contra el Maestro
- [x] IA personalizada por maestro (8 estilos distintos con Contempt value)
- [x] **3 niveles de dificultad** — Fácil (prof. 3), Normal (8), Difícil (15)
- [x] **Modo Blindfold** 🙈 — tablero oculto, input de notación SAN
- [x] **Partida comentada** — texto explicativo en tiempo real
- [x] Barras de estilo en tiempo real
- [x] Historial de movimientos
- [x] Guardado automático de partidas al terminar (BD)
- [x] Exportar PGN para Chess.com / Lichess
- [x] **Análisis post-partida** 🔍 — clasificación por jugada con Stockfish

### Estadísticas y Analytics (por maestro histórico)
- [x] Dashboard por maestro
- [x] Gráficos de aperturas más usadas
- [x] Evolución histórica por año
- [x] Oponentes más frecuentes
- [x] **Comparador de dos maestros** — radar chart + aperturas + evolución

### Tab Análisis
- [x] **Análisis libre** — tablero interactivo + Stockfish en tiempo real + cargar FEN
- [x] **Buscador por FEN** — busca en las 20.000+ partidas históricas
- [x] **Comparador de maestros** — gráficos enfrentados

### Modos de Entrenamiento de Aperturas
- [x] **Modo Aprender** — teoría movimiento a movimiento con repetición espaciada
- [x] **Modo Contrarreloj** ⏱️ — 10 segundos por movimiento
- [x] **Adivina la Apertura** 🤔 — 5 rondas con 4 opciones
- [x] **Aprender Casillas** 🗺️ — encuentra la casilla + mueve la pieza
- [x] **Puzzles Tácticos** 🧩 — 8 puzzles clásicos
- [x] **Patrones Tácticos** 📌 — 5 categorías (Clavada, Horquilla, Descubierta, Mate, Sacrificio)
- [x] **Brillantes Históricos** 💎 — 9 combinaciones legendarias con explicación táctica
- [x] **Modo Supervivencia** 💀 — puzzles en cadena con 3 vidas
- [x] **Speed Run** ⚡ — aperturas cronometradas con récord personal
- [x] **Entrenador de Finales** ♟️ — Stockfish juega el bando contrario
- [x] **Modo Espejo** 🪞 — juegas ambos colores, tablero gira automáticamente
- [x] **Explorador de Aperturas** 🌳 — árbol interactivo en tiempo real
- [x] **Progreso de Aperturas** 📊 — árbol visual con estado por variante

### Aperturas (200+ variantes)
- [x] Ruy Lopez (20+ variantes: Cerrada, Abierta, Berlinesa, Noruega, Arcángel, Möller, Keres, Adam, Schliemann...)
- [x] Italiana (25+ variantes: Giuoco Piano, Greco, Møller, Pianissimo, Canal, Evans, Dos Caballos, Traxler, Fegatello, Lolli...)
- [x] Siciliana (30+ variantes: Najdorf, Dragon, Sveshnikov, Scheveningen, Pelikán, Boleslavski, Richter-Rauzer, Taimánov, Kan, Smith-Morra, Grand Prix...)
- [x] Francesa (20+ variantes: Winawer, Tarrasch, Paulsen, MacCutcheon, Avance, Cambio, Rubinstein, Guimard...)
- [x] Caro-Kann (20+ variantes: Clásica, Avance, Panov, Fantasía, Edinburgo, Smyslov, Dos Caballos...)
- [x] Escocesa (15+ variantes: Clásica, Horwitz A/B/C, Mieses, Tartakóver, Blackburne, Paulsen, Blumenfeld...)
- [x] Gambito de Dama (20+ variantes: Aceptado, Rechazado, Eslava, Semi-Eslava, Tarrasch, Chigorin, Albin, Báltica...)
- [x] India de Rey, Nimzoindia, India de Dama, Grünfeld, Catalan
- [x] Alekhine (15+ variantes: Four Pawns, Exchange, Voronezh, Moderna, Balogh, Dos Caballos...)
- [x] Petrov (20+ variantes: Clásica, Nimzowitsch, Lasker, Cochrane, Stafford, Steinitz, Italiana...)
- [x] Escandinava (15+ variantes: Qa5, Qd6, Valenciana, Patzer, Marshall, Portuguesa, Gambito Islandés...)
- [x] Vienesa (15+ variantes: Gambito Vienés, Falkbeer, Boden-Kieseritzky, Zhuravlev, Jobava...)
- [x] Sistema Londres (10+ variantes: Clásica, Jobava, vs Fianchetto, vs India de Rey, Agresiva...)
- [x] Gambito de Rey, Gambito Goering, Gambito Escocés, Pirc, Holandesa, Inglesa, Reti, Bird, Budapest, Benko, Benoni

### API Endpoints
- [x] Auth: register, login
- [x] Partidas: list, detail, del-dia, buscar-fen
- [x] Análisis: evaluar (con profundidad y personalidad)
- [x] Aperturas: list, variantes, aprendizaje, random, random-espaciado
- [x] Progreso: get, sesion, torneo, partida, partidas, calendario, foto, logro
- [x] Clasificación: ranking global
- [x] Estadísticas: por jugador histórico

### Sistema de Usuarios y Progreso
- [x] Registro y login con JWT + BCrypt
- [x] Progreso por apertura persistido en BD
- [x] Sesiones guardadas automáticamente en todos los modos
- [x] Racha diaria con calendario de actividad (365 días)
- [x] **Sistema de niveles XP** — 10 niveles (Peón → Gran Maestro)
- [x] **Foto de perfil** — subida en base64, guardada en BD
- [x] **Tabla de clasificación** — ranking global de usuarios
- [x] **Gráfico de evolución XP** — últimas 12 semanas
- [x] **Estadísticas de juego personal** — winrate por maestro, partidas por mes
- [x] **Historial de partidas** vs maestros con exportar PGN individual
- [x] **Exportar estadísticas a PDF**

### Sistema de Logros (24 logros)
- [x] Entrenamiento (10): Primera Apertura, Perfección, Estudioso, Buen Estudiante, Experto, Gran Maestro, Sin Tiempo, Constante, Dedicado, Reconocedor
- [x] Torneo (6): Debutante, Campeón, Veterano, Invicto, Conquistador, Rayo
- [x] Nuevos (8): Ciego, Superviviente, Speed Runner, Semana Completa, Geógrafo, Analista, Patrón Maestro

### Gamificación
- [x] **Retos del Día** — 3 retos diarios con XP, persisten en localStorage
- [x] **Misiones Semanales** — 3 misiones semanales con XP extra
- [x] **Partida del Día** — posición histórica diferente cada día
- [x] **Toast de logros** — notificación en tiempo real al desbloquear
- [x] **Sonidos** — Web Audio API (mover, capturar, jaque, acierto, error, fanfarria)

### Modo Torneo
- [x] 8 controles de tiempo, incremento configurable
- [x] 5 opciones de rondas (1, 3, 5, 7, 10)
- [x] Relojes con colores de alerta
- [x] Puntuación FIDE
- [x] Logros de torneo

### Personalización
- [x] **8 temas de color** — Oscuro, Claro, Esmeralda, Púrpura, Rojo, Océano, Sepia, Hielo
- [x] **4 tipografías** — Sistema, Georgia, Monospace, Redondeada
- [x] **3 tamaños de fuente** — Pequeño, Normal, Grande
- [x] **3 estilos de bordes** — Cuadrado, Normal, Redondeado
- [x] Toggle animaciones y modo compacto
- [x] 6 temas de tablero + 3 sets de piezas
- [x] CSS variables globales — toda la app responde al cambio de tema

---

## 📋 Pendiente

### Técnico
- [ ] Variables de entorno — `http://localhost:5000` hardcodeada en `api.js`, `PlayMaster.jsx` y `AnalisisPartida.jsx`
- [ ] Tests unitarios y de integración
- [ ] Swagger/Scalar para documentación de la API
- [ ] Logging estructurado
- [ ] Caché de evaluaciones Stockfish en BD (acelerar análisis post-partida)

### UX / Experiencia
- [ ] Responsive / móvil — el hueco más grande pendiente
- [ ] Confeti al ganar partidas o desbloquear logros importantes
- [ ] Animaciones de entrada en cards de maestros
- [ ] Onboarding para usuarios nuevos (tutorial 3-4 pasos)
- [ ] Búsqueda global (maestros, partidas, aperturas)
- [ ] Tema claro mejorado (algunos componentes con inline styles aún usan colores hardcodeados)

### Funcionalidades
- [ ] Más puzzles tácticos (extraídos automáticamente de las 20.000 partidas con Stockfish)
- [ ] Modo difícil en "Adivina la Apertura" — menos movimientos, sin variante en opciones
- [ ] Misiones semanales con verificación automática (actualmente se marcan manualmente)
- [ ] Generador de repertorio en PDF

### Despliegue
- [ ] Dockerfile para Railway/Fly.io
- [ ] Migración de SQLite a PostgreSQL para producción
- [ ] Stockfish para Linux (actualmente solo `.exe` Windows)
- [ ] Variables de entorno para URL de API

---

## 📊 Progreso General

**Completado:** ~97%
**Pendiente:** ~3% (principalmente técnico y responsive)
