<div align="center">

# ♟️ Chess Legacy

**Plataforma completa de entrenamiento y análisis de ajedrez**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Stockfish](https://img.shields.io/badge/Stockfish-Engine-orange?style=for-the-badge)](https://stockfishchess.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*Juega contra maestros legendarios · Entrena aperturas · Analiza con Stockfish · Compite en torneos*

---

[🎮 Modos de juego](#-modos-de-juego) · [📖 Aperturas](#-aperturas) · [🏆 Torneo](#-torneo) · [🔬 Análisis](#-análisis) · [👤 Perfil](#-perfil) · [🚀 Instalación](#-instalación)

</div>

---

## ✨ ¿Qué es Chess Legacy?

Chess Legacy es una plataforma web de ajedrez con **más de 20 modos de entrenamiento**, evaluación con Stockfish, 20.550+ partidas históricas de los 8 grandes maestros de la historia, sistema de progresión con XP y logros, y personalización completa de la interfaz.

---

## 🚀 Instalación

### Requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js | 18+ |
| .NET SDK | 10.0+ |
| Stockfish | Cualquiera |
| Git | Cualquiera |

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/chess-legacy.git
cd chess-legacy

# 2. Backend
cd backend/ChessLegacy.API
dotnet restore
dotnet ef database update --context ChessLegacyContext
dotnet run                    # → http://localhost:5000

# 3. Frontend (nueva terminal)
cd frontend/chess-legacy-ui
npm install
npm run dev                   # → http://localhost:5173
```

> **Nota:** Las 20.550+ partidas históricas se importan automáticamente al arrancar si la base de datos está vacía.

> **Stockfish:** Coloca el ejecutable en `backend/ChessLegacy.API/stockfish/stockfish.exe`

---

## 📁 Estructura del proyecto

```
chess-legacy/
├── 📂 backend/
│   └── ChessLegacy.API/
│       ├── Controllers/        # Endpoints REST
│       ├── Services/           # Lógica + detección de aperturas (200+ variantes)
│       ├── Engine/             # Integración Stockfish
│       ├── Models/             # Entidades del dominio
│       ├── Data/               # DbContext + migraciones EF Core
│       └── Scripts/pgn_files/  # Archivos PGN por maestro
│
└── 📂 frontend/
    └── chess-legacy-ui/
        └── src/
            ├── components/     # +45 componentes React
            ├── context/        # Auth, BoardTheme, Theme, Toast
            ├── pages/          # Home, Login, PartidasFamosas
            ├── data/           # masters.js, niveles.js
            └── services/       # api.js
```

---

## 🎮 Modos de juego

### ⚔️ Jugar contra el Maestro

Enfrenta a 8 grandes maestros históricos con IA personalizada según su estilo real.

| Maestro | Estilo | ELO |
|---------|--------|-----|
| Mikhail Tal | Agresivo y táctico — sacrificios imposibles | 2705 |
| Garry Kasparov | Universal y dinámico | 2851 |
| Bobby Fischer | Preciso y perfeccionista | 2785 |
| José R. Capablanca | Posicional y técnico | 2725 |
| Anatoly Karpov | Profilaxis extrema | 2780 |
| Alexander Alekhine | Combinaciones profundas | 2690 |
| Tigran Petrosian | Defensa impenetrable | 2645 |
| Magnus Carlsen | Maestro de finales | 2882 |

**Características:**
- 🎯 **3 niveles de dificultad** — Fácil (prof. 3), Normal (8), Difícil (15)
- 🙈 **Modo Blindfold** — tablero oculto, juegas en notación SAN
- 💬 **Partida comentada** — Stockfish explica la posición en tiempo real
- 🔍 **Análisis post-partida** — clasifica cada jugada (Excelente / Bueno / Imprecisión / Error / Blunder)
- 📥 **Exportar PGN** para analizar en Chess.com o Lichess

---

### 📖 Modos de Entrenamiento de Aperturas

> **13 modos distintos** accesibles desde la tab de Aperturas

| Modo | Descripción |
|------|-------------|
| 📖 **Aprender** | Teoría movimiento a movimiento con repetición espaciada |
| ⏱️ **Contrarreloj** | 10 segundos por movimiento |
| 🤔 **Adivina la Apertura** | 5 rondas, 4 opciones de respuesta |
| 🗺️ **Aprender Casillas** | Encuentra la casilla / Mueve la pieza |
| 🧩 **Puzzles Tácticos** | 8 puzzles clásicos con pistas |
| 📌 **Patrones Tácticos** | 5 categorías: Clavada, Horquilla, Descubierta, Mate, Sacrificio |
| 💎 **Brillantes Históricos** | 9 combinaciones legendarias con explicación táctica |
| 💀 **Supervivencia** | Puzzles en cadena con 3 vidas |
| ⚡ **Speed Run** | Aperturas cronometradas con récord personal |
| ♟️ **Entrenador de Finales** | Stockfish juega el bando contrario |
| 🪞 **Modo Espejo** | Juegas ambos colores, tablero gira automáticamente |
| 🌳 **Explorador de Aperturas** | Árbol interactivo en tiempo real |
| 🎭 **Partida Reconstruida** | Adivina los movimientos de un maestro en una partida real |
| 🎤 **Quiz de Maestros** | ¿Quién jugó esta posición? 4 opciones |

---

### 🏆 Modo Torneo

Juega torneos completos contra cualquier maestro con relojes reales.

- ⏰ **8 controles de tiempo** — Bala (1'), Bala (2'+1), Blitz (3', 3'+2, 5'), Rápido (10', 15'+10), Clásico (30')
- 🔢 **5 opciones de rondas** — 1, 3, 5, 7 o 10
- 🏅 **Puntuación FIDE** — 1 / 0.5 / 0
- 🔴 Relojes con alertas de color (naranja ≤30s, rojo parpadeante ≤10s)

---

## 🔬 Análisis

| Herramienta | Descripción |
|-------------|-------------|
| 🔬 **Análisis libre** | Tablero interactivo + Stockfish en tiempo real + cargar FEN |
| 🔍 **Buscador por FEN** | Busca en las 20.000+ partidas históricas |
| ⚔️ **Comparador de maestros** | Radar chart + aperturas + evolución temporal |
| 🔥 **Mapa de calor** | Qué casillas ocupa más cada maestro, filtrable por pieza |

---

## 👤 Perfil

### Sistema de niveles XP

```
♟️ Peón → 🏃 Alfil → 🐴 Caballo → 🏰 Torre → 👸 Dama
→ 👑 Rey → 🎯 Candidato → 🏅 Maestro FIDE → 🥈 MI → 🏆 Gran Maestro
```

### Logros (24)

<details>
<summary>Ver todos los logros</summary>

**Entrenamiento**
- 🎓 Primera Apertura · 💯 Perfección · 📚 Estudioso · 🎯 Buen Estudiante
- 🏅 Experto · 👑 Gran Maestro · ⚡ Sin Tiempo · 🔥 Constante · ⭐ Dedicado · 🤔 Reconocedor

**Torneo**
- 🎪 Debutante · 🏆 Campeón · 🎖️ Veterano · 👑 Invicto · ⚔️ Conquistador · ⚡ Rayo

**Especiales**
- 🙈 Ciego · 💀 Superviviente · ⚡ Speed Runner · 📅 Semana Completa · 🗺️ Geógrafo · 🔍 Analista · 🧩 Patrón Maestro

</details>

### Otras funcionalidades del perfil

- 📅 **Calendario de actividad** — estilo GitHub contributions (365 días)
- 🏆 **Tabla de clasificación** — ranking global de usuarios por XP
- 📊 **Estadísticas de juego** — winrate por maestro, partidas por mes
- 📈 **Gráfico de evolución XP** — últimas 12 semanas
- 📸 **Foto de perfil** — subida desde el dispositivo
- 📄 **Exportar PDF** — estadísticas completas en PDF
- ⚔️ **Historial vs Maestros** — con exportar PGN individual

---

## 🎨 Personalización

> Toda la app responde al cambio de tema instantáneamente gracias a CSS custom properties

| Categoría | Opciones |
|-----------|----------|
| 🎨 **Temas de color** | Oscuro · Claro · Esmeralda · Púrpura · Rojo · Océano · Sepia · Hielo |
| 🔤 **Tipografías** | Sistema · Georgia · Monospace · Redondeada |
| 📏 **Tamaño de fuente** | Pequeño · Normal · Grande |
| ⬜ **Bordes** | Cuadrado · Normal · Redondeado |
| ♟️ **Temas de tablero** | Clásico · Verde · Azul · Púrpura · Noche · Nogal |
| 🎭 **Sets de piezas** | Estándar · Neo · Flat |

---

## 📚 Aperturas disponibles

> **200+ variantes** con líneas teóricas de 20-30 jugadas

<details>
<summary>Ver todas las aperturas</summary>

| Apertura | Variantes destacadas |
|----------|---------------------|
| **Ruy Lopez** | Cerrada, Abierta, Berlinesa, Noruega, Arcángel, Möller, Keres, Adam, Schliemann... |
| **Italiana** | Giuoco Piano, Greco, Møller, Pianissimo, Canal, Evans, Dos Caballos, Traxler, Fegatello... |
| **Siciliana** | Najdorf, Dragon, Sveshnikov, Scheveningen, Pelikán, Boleslavski, Richter-Rauzer, Taimánov, Kan... |
| **Francesa** | Winawer, Tarrasch, Paulsen, MacCutcheon, Avance, Cambio, Rubinstein, Guimard... |
| **Caro-Kann** | Clásica, Avance, Panov, Fantasía, Edinburgo, Smyslov, Dos Caballos... |
| **Escocesa** | Clásica, Horwitz A/B/C, Mieses, Tartakóver, Blackburne, Paulsen, Blumenfeld... |
| **Gambito de Dama** | Aceptado, Rechazado, Eslava, Semi-Eslava, Tarrasch, Chigorin, Albin, Báltica... |
| **Alekhine** | Four Pawns, Exchange, Voronezh, Moderna, Balogh, Dos Caballos... |
| **Petrov** | Clásica, Nimzowitsch, Lasker, Cochrane, Stafford, Steinitz, Italiana... |
| **Escandinava** | Qa5, Qd6, Valenciana, Patzer, Marshall, Portuguesa, Gambito Islandés... |
| **Vienesa** | Gambito Vienés, Falkbeer, Boden-Kieseritzky, Zhuravlev, Jobava... |
| **Sistema Londres** | Clásica, Jobava, vs Fianchetto, vs India de Rey, Agresiva, h3 Bh2... |
| **Catalan** | Abierta, Cerrada (múltiples líneas) |
| + India de Rey, Nimzoindia, Grünfeld, Benoni, Holandesa, Inglesa, Reti, Bird, Budapest, Benko... | |

</details>

---

## 📡 API Reference

<details>
<summary>Ver endpoints</summary>

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
```

### Partidas
```
GET  /api/partidas                    # Lista con filtros
GET  /api/partidas/{id}
GET  /api/partidas/del-dia            # Seed por fecha
GET  /api/partidas/buscar-fen?fen=... # Busca por posición
```

### Análisis
```
POST /api/analisis/evaluar
     Body: { "fen": "...", "maestro": "Tal", "profundidad": 10 }
     Response: { "evaluacion": 34, "mejorMovimiento": "e2e4" }
```

### Aperturas
```
GET /api/aperturas
GET /api/aperturas/{nombre}/variantes
GET /api/aperturas/aprendizaje?apertura=Siciliana&variante=Najdorf
GET /api/aperturas/aprendizaje/random
GET /api/aperturas/aprendizaje/random-espaciado   # JWT requerido
```

### Progreso (JWT requerido)
```
GET  /api/progreso
POST /api/progreso/sesion
POST /api/progreso/torneo
POST /api/progreso/partida
GET  /api/progreso/partidas
GET  /api/progreso/calendario
POST /api/progreso/foto
POST /api/progreso/logro
GET  /api/clasificacion               # Público
```

</details>

---

## 🗃️ Base de datos

| Tabla | Descripción |
|-------|-------------|
| `Usuarios` | Username, PasswordHash, XP, Racha, Foto |
| `ProgresoApertura` | Progreso por apertura/variante/color |
| `LogroUsuario` | Logros desbloqueados |
| `ActividadDiaria` | Días activos (calendario) |
| `PartidasJugadas` | Historial vs maestros (PGN, resultado) |
| `Jugadores` | 8 maestros históricos |
| `Partidas` | 20.550+ partidas históricas |
| `Movimientos` | Movimientos de cada partida |
| `Aperturas` | Catálogo ECO |

---

## 🛠️ Tecnologías

<div align="center">

| Backend | Frontend |
|---------|----------|
| ASP.NET Core 10.0 | React 18 + Vite |
| Entity Framework Core | react-chessboard 4.7.1 |
| SQLite | chess.js |
| JWT + BCrypt | recharts |
| Stockfish Engine | jsPDF |
| | Web Audio API |

</div>

---

## 🐛 Troubleshooting

<details>
<summary>Backend no inicia</summary>

```bash
dotnet --version   # Verificar .NET SDK 10+
dotnet clean && dotnet build
```
</details>

<details>
<summary>Frontend no carga</summary>

```bash
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary>Stockfish no funciona</summary>

Verificar que existe: `backend/ChessLegacy.API/stockfish/stockfish.exe`

Descargar desde: https://stockfishchess.org/download/
</details>

<details>
<summary>Base de datos corrupta</summary>

```bash
rm ChessLegacy.db
dotnet ef database update --context ChessLegacyContext
```
</details>

---

## 🚀 Despliegue

```bash
# Backend
dotnet publish -c Release -o ./publish

# Frontend
npm run build   # → dist/
```

> Para despliegue gratuito: **Vercel** (frontend) + **Railway** (backend + PostgreSQL)
> Requiere migrar SQLite → PostgreSQL y adaptar Stockfish para Linux.

---

<div align="center">

## 📝 Licencia

MIT License — libre para uso personal y educativo

---

*Desarrollado para la asignatura de Desarrollo de Servicios Web* 😁

**[⬆ Volver arriba](#️-chess-legacy)**

</div>
