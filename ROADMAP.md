# 🗺️ Chess Legacy - Roadmap

## ✅ Completado

### Infraestructura Base
- [x] Backend ASP.NET Core 10 + SQLite + Entity Framework Core
- [x] Frontend React 18 + Vite
- [x] Integración Stockfish
- [x] API REST completa
- [x] Importación masiva de PGN (20.550+ partidas)
- [x] **Importación automática al arrancar** — Si la BD está vacía, el backend importa todos los PGNs sin intervención manual
- [x] **Limpieza de importadores obsoletos** — Eliminados `PgnImporter`, `PgnImporterAdvanced` e `ImportacionController` (dependían de `pgn.net`, incompatible con .NET 10). Solo queda `SimplePgnImporter`

### Navegación
- [x] Tabs principales: "Grandes Maestros" / "Aprender Aperturas" / **"Torneo"** / "Mi Perfil"
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
- [x] **Guardar sesión automáticamente al completar** — llama a `POST /api/progreso/sesion` y muestra logros desbloqueados en pantalla de resultado
- [x] **Repetición espaciada** — el botón "Apertura Aleatoria" prioriza aperturas con peor precisión histórica (peso 1-6 según rendimiento). Endpoint `GET /api/aperturas/aprendizaje/random-espaciado`

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
- [x] `GET /api/aperturas/aprendizaje/random-espaciado` — Apertura ponderada por historial del usuario (requiere JWT)

### Sistema de Usuarios y Progreso
- [x] Registro y login con JWT + BCrypt
- [x] Progreso por apertura persistido en BD (`ProgresoApertura`)
- [x] **Sesiones guardadas automáticamente** al completar cualquier modo de entrenamiento
- [x] **Racha diaria** — campos `RachaActual`, `MaximaRacha` y `UltimaActividad` en `Usuario`. Se incrementa al practicar en días consecutivos, se reinicia si pasa más de un día
- [x] Perfil de usuario con stats: racha actual 🔥, máxima racha, sesiones, aciertos, aperturas practicadas, logros

### Sistema de Logros (16 logros)
#### Entrenamiento (10)
- [x] 🎓 Primera Apertura — completa tu primera sesión
- [x] 💯 Perfección — 100% de precisión en una apertura
- [x] 📚 Estudioso — practica 10 aperturas distintas
- [x] 🎯 Buen Estudiante — 50 movimientos correctos acumulados
- [x] 🏅 Experto — 100 movimientos correctos acumulados
- [x] 👑 Gran Maestro — 500 movimientos correctos acumulados
- [x] ⚡ Sin Tiempo — contrarreloj sin ningún timeout
- [x] 🔥 Constante — 5 sesiones de entrenamiento
- [x] ⭐ Dedicado — 20 sesiones de entrenamiento
- [x] 🤔 Reconocedor — 5/5 en Adivina la Apertura

#### Torneo (6)
- [x] 🎪 Debutante — completa tu primer torneo
- [x] 🏆 Campeón — gana tu primer torneo
- [x] 🎖️ Veterano — completa 5 torneos
- [x] 👑 Invicto — gana un torneo sin perder ninguna ronda
- [x] ⚔️ Conquistador — gana al menos un torneo contra cada uno de los 8 maestros
- [x] ⚡ Rayo — gana un torneo con control de tiempo bala (≤2 min)

### 🏆 Modo Torneo
- [x] Selección de rival entre los 8 grandes maestros (con foto y rating)
- [x] 8 controles de tiempo: Bala (1 min), Bala (2+1), Blitz (3, 3+2, 5), Rápido (10, 15+10), Clásico (30)
- [x] Incremento por movimiento configurable
- [x] 5 opciones de rondas: 1, 3, 5, 7 o 10
- [x] Relojes por jugador con colores: normal → naranja (≤30s) → rojo parpadeante (≤10s)
- [x] Reloj activo resaltado en dorado
- [x] Puntuación FIDE: 1 victoria / 0.5 tablas / 0 derrota
- [x] Pantalla de resultado por ronda con marcador acumulado
- [x] Pantalla final con trofeo, marcador y resumen ronda a ronda
- [x] Revancha y nueva configuración desde la pantalla final
- [x] Botón de abandono de ronda
- [x] Logros de torneo desbloqueables mostrados al finalizar
- [x] Resultado guardado en BD via `POST /api/progreso/torneo`

---

## 📋 Pendiente

### Entrenamiento
- [ ] Notificación toast al desbloquear un logro (sin esperar a pantalla de resultado)
- [ ] Modo difícil en "Adivina" — menos movimientos mostrados, sin variante en las opciones
- [ ] Guardar sesión en modos Contrarreloj y Adivina (actualmente solo en Modo Aprender)

### Nuevos modos de juego
- [ ] Puzzles tácticos históricos — posiciones de las 20.000 partidas con combinación ganadora
- [ ] Partida comentada — Stockfish con texto explicativo en tiempo real

### Mejoras a lo existente
- [ ] Exportar PGN de partidas jugadas contra maestros
- [ ] Buscador de posición por FEN en las 20.000 partidas
- [ ] Comparar dos maestros (gráfico enfrentado)
- [ ] Historial de partidas jugadas contra maestros
- [ ] Calendario visual de racha diaria en el perfil

### UX / Experiencia
- [ ] Partida del día — posición histórica destacada en la Home, diferente cada día
- [ ] Loading states y spinners
- [ ] Responsive design para móviles
- [ ] Búsqueda global (maestros, partidas, aperturas)

### Deuda técnica
- [ ] Tests unitarios y de integración
- [ ] Documentación Swagger/Scalar
- [ ] Variables de entorno para configuración
- [ ] Logging estructurado

---

## 📊 Progreso General

**Completado:** ~92%
**Pendiente:** ~8%
