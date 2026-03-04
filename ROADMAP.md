# 🗺️ Chess Legacy - Roadmap

## ✅ Completado

### Infraestructura Base
- [x] Backend ASP.NET Core 10 + SQLite + Entity Framework Core
- [x] Frontend React 18 + Vite
- [x] Integración Stockfish
- [x] API REST completa
- [x] Importación masiva de PGN (20.550+ partidas)

### Navegación
- [x] Tabs principales: "Grandes Maestros" / "Aprender Aperturas"
- [x] Ordenación de maestros por defecto, año y rating

### Galería y Perfiles de Maestros
- [x] 8 maestros históricos con cards interactivas
- [x] Perfiles con biografía, logros, frases célebres
- [x] Partidas imprescindibles con enlace directo al visor
- [x] Acciones por maestro: Jugar, Ver Partidas, Estadísticas, Entrenar Estilo, Biografía

### Visor de Partidas
- [x] 20.550+ partidas históricas
- [x] Navegación movimiento por movimiento
- [x] Filtros por año, oponente, evento, apertura, variante
- [x] Sistema de favoritos con localStorage
- [x] Evaluación en tiempo real con Stockfish
- [x] Barra de evaluación visual
- [x] Orientación del tablero según color del jugador

### Jugar Contra el Maestro
- [x] IA personalizada por maestro (8 estilos distintos)
- [x] Barras de estilo en tiempo real (ataque, táctica, posicional, sacrificios)
- [x] Historial de movimientos en partida

### Estadísticas y Analytics
- [x] Dashboard por maestro
- [x] Gráficos de aperturas más usadas
- [x] Evolución histórica por año
- [x] Oponentes más frecuentes

### 📖 Tab "Aprender Aperturas"

#### Modo Aprender
- [x] Selector de apertura, variante y color
- [x] Oponente juega automáticamente sus movimientos teóricos
- [x] Feedback inmediato: correcto / incorrecto + muestra el movimiento correcto
- [x] Botón revelar/ocultar línea teórica
- [x] Movimientos ya jugados siempre visibles
- [x] Apertura aleatoria
- [x] Resumen final con precisión
- [x] 25+ aperturas con variantes de 20-30 jugadas

#### Modo Contrarreloj ⏱️
- [x] 10 segundos por movimiento
- [x] Barra de tiempo visual con cambio de color (verde → naranja → rojo)
- [x] Timeout cuenta como error y muestra el movimiento correcto
- [x] Siempre apertura aleatoria
- [x] Contador de tiempos agotados en resultado final

#### Modo Adivina la Apertura 🤔
- [x] 5 rondas por sesión
- [x] Posición mostrada tras 6-10 movimientos
- [x] 4 opciones de respuesta (1 correcta + 3 señuelos)
- [x] Feedback visual: verde correcto / rojo incorrecto
- [x] Puntuación y precisión final

### Aperturas con líneas teóricas largas (20-30 jugadas)
- [x] Ruy Lopez (Cerrada, Abierta, Berlinesa, Steinitz, Schliemann, Exchange)
- [x] Italiana (Giuoco Piano, Dos Caballos, Evans)
- [x] Siciliana (Najdorf, Dragon, Sveshnikov, Scheveningen, Paulsen, Accelerated Dragon, Alapin, Closed)
- [x] Francesa (Winawer, Tarrasch, Classical, Advance, Exchange)
- [x] Caro-Kann (Classical, Advance, Panov, Exchange)
- [x] Escocesa (Classical, Steinitz)
- [x] Gambito de Rey (Aceptado, Rechazado)
- [x] Gambito de Dama (Aceptado, Rechazado, Eslava, Semi-Eslava, Tarrasch)
- [x] India de Rey (Classical, Samisch, Four Pawns, Fianchetto)
- [x] Nimzoindia (Classical, Rubinstein, Samisch)
- [x] India de Dama (Petrosian, Classical)
- [x] Grünfeld (Exchange, Russian)
- [x] Catalan (Open, Closed)
- [x] Petrov, Alekhine, Pirc, Escandinava, Holandesa, Inglesa, Reti, Bird, Vienesa, Budapest, Benko, Benoni

### API Endpoints de Aperturas
- [x] `GET /api/aperturas` — Lista aperturas
- [x] `GET /api/aperturas/{nombre}/variantes` — Variantes
- [x] `GET /api/aperturas/aprendizaje` — Línea teórica por apertura/variante
- [x] `GET /api/aperturas/aprendizaje/random` — Apertura aleatoria

---

## 📋 Pendiente

### Entrenamiento
- [ ] **Guardar sesiones automáticamente** — Conectar los 3 modos de entrenamiento con `POST /api/progreso/sesion` para que logros y progreso funcionen de verdad
- [ ] **Notificación de logro desbloqueado** — Toast/popup al conseguir un logro nuevo tras una sesión
- [ ] **Racha diaria** — Contador de días consecutivos practicando con calendario visual en el perfil
- [ ] Repetición espaciada — priorizar aperturas falladas en el random
- [ ] Modo difícil en "Adivina" — menos movimientos mostrados, sin variante en las opciones

### Nuevos modos de juego
- [ ] Puzzles tácticos históricos — posiciones de las 20.000 partidas con combinación ganadora
- [ ] Partida comentada — Stockfish con texto explicativo en tiempo real
- [ ] Modo torneo — match al mejor de 5 contra un maestro

### Mejoras a lo existente
- [ ] Exportar PGN de partidas jugadas contra maestros
- [ ] Buscador de posición por FEN en las 20.000 partidas
- [ ] Comparar dos maestros (gráfico enfrentado)
- [ ] Historial de partidas jugadas contra maestros

### UX / Experiencia
- [ ] **Partida del día** — Posición histórica destacada en la Home con contexto histórico, diferente cada día
- [ ] Loading states y spinners
- [ ] Responsive design para móviles
- [ ] Búsqueda global (maestros, partidas, aperturas)

### Deuda técnica
- [ ] Remover dependencia `pgn.net` (no compatible con .NET 10)
- [ ] Tests unitarios y de integración
- [ ] Documentación Swagger/Scalar
- [ ] Variables de entorno para configuración
- [ ] Logging estructurado

---

## 📊 Progreso General

**Completado:** ~80%
**Pendiente:** ~20%
