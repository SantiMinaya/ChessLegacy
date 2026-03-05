# ♟️ Chess Legacy

Sistema de análisis histórico de ajedrez con evaluación híbrida, juego contra maestros legendarios y entrenamiento de aperturas.

## 📋 Requisitos Previos

- **Node.js** 18+ y npm
- **.NET SDK** 10.0 o superior
- **Stockfish** (ejecutable en `backend/ChessLegacy.API/stockfish/stockfish.exe`)
- **Git**

## 🚀 Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/TU_USUARIO/chess-legacy.git
cd chess-legacy
```

### 2. Backend (.NET)

```bash
cd backend/ChessLegacy.API

dotnet restore
dotnet ef database update --context ChessLegacyContext

# Ejecutar API (puerto 5000)
dotnet run
```

### 3. Frontend (React)

```bash
cd frontend/chess-legacy-ui
npm install
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### 4. Importar Partidas Históricas

```bash
# Coloca archivos PGN en: backend/ChessLegacy.API/Scripts/pgn_files/
curl -X POST http://localhost:5000/api/import/importar-todos
```

## 📁 Estructura del Proyecto

```
chess-legacy/
├── backend/
│   └── ChessLegacy.API/
│       ├── Controllers/          # Endpoints de la API
│       ├── Services/             # Lógica de negocio + detección de aperturas
│       ├── Repositories/         # Acceso a datos
│       ├── Models/               # Entidades del dominio
│       ├── Data/                 # Contexto y configuración DB
│       ├── Engine/               # Integración Stockfish
│       ├── Scripts/pgn_files/    # Archivos PGN para importar
│       └── stockfish/            # Motor de ajedrez
│
├── frontend/
│   └── chess-legacy-ui/
│       ├── src/
│       │   ├── components/       # Componentes React
│       │   ├── pages/            # Páginas principales
│       │   ├── data/             # Datos estáticos y estilos
│       │   ├── services/         # Llamadas a API
│       │   └── public/images/    # Imágenes de maestros
│       └── package.json
│
├── README.md
└── ROADMAP.md
```

## 🎮 Características

### ✅ Implementadas

#### 1. Navegación principal con tabs
- **Tab "Grandes Maestros"** — Galería con 8 maestros históricos, ordenable por año o rating
- **Tab "Aprender Aperturas"** — Sistema completo de entrenamiento de aperturas

#### 2. Galería de Maestros
- 8 grandes maestros históricos con perfiles detallados
- Biografías completas, estadísticas y frases célebres
- Partidas imprescindibles con enlace directo al visor

#### 3. Visor de Partidas
- 20.550+ partidas históricas importadas desde PGN
- Navegación movimiento por movimiento
- Filtros por año, oponente, evento, apertura y variante
- Sistema de favoritos con localStorage
- Evaluación en tiempo real con Stockfish
- Barra de evaluación visual

#### 4. Jugar Contra el Maestro
- IA personalizada por maestro con estilos históricos:
  - **Tal**: Agresivo y táctico (90% ataque)
  - **Capablanca**: Posicional y preciso (90% posicional)
  - **Kasparov**: Universal y dinámico
  - **Fischer**: Preciso y perfeccionista
  - **Karpov**: Profilaxis extrema
  - **Alekhine**: Combinaciones profundas
  - **Petrosian**: Defensa impenetrable
  - **Carlsen**: Maestro de finales
- Visualización de barras de estilo en tiempo real

#### 5. Estadísticas y Analytics
- Dashboard por maestro
- Gráficos de aperturas más usadas
- Evolución histórica por año
- Oponentes más frecuentes

#### 6. 📖 Aprender Aperturas (tab dedicada)

La tab de aperturas contiene tres modos de entrenamiento:

##### Modo Aprender
- Selecciona apertura, variante y color (blancas/negras)
- El oponente juega automáticamente sus movimientos teóricos
- Si fallas: muestra el movimiento correcto 1.5s y te deja reintentar
- Botón para revelar/ocultar la línea teórica
- Los movimientos ya jugados siempre se muestran
- Apertura aleatoria con un clic
- Resumen final con precisión y aciertos/errores
- **25+ aperturas** con variantes de **20-30 jugadas** cada una

##### Modo Contrarreloj ⏱️
- 10 segundos por movimiento
- Barra de tiempo visual: verde → naranja → rojo
- Si se agota el tiempo cuenta como error y muestra el movimiento
- Siempre arranca con apertura aleatoria
- Contador separado de tiempos agotados en el resultado

##### Modo Adivina la Apertura 🤔
- 5 rondas por partida
- Se muestra una posición tras 6-10 movimientos
- 4 opciones de respuesta (1 correcta + 3 señuelos)
- Las opciones incorrectas se marcan en rojo, la correcta en verde
- Puntuación final con precisión

#### 7. Aperturas disponibles (25+)
Ruy Lopez, Italiana, Siciliana, Francesa, Caro-Kann, Escocesa, Gambito de Rey, Petrov, Alekhine, Pirc, Escandinava, Gambito de Dama, India de Rey, Nimzoindia, India de Dama, Grünfeld, Benoni, Holandesa, Inglesa, Reti, Bird, Vienesa, Budapest, Benko, Catalan

Cada apertura incluye sus principales variantes con líneas teóricas de 20-30 jugadas.

## 📡 API Endpoints

### Jugadores
- `GET /api/jugadores` — Lista todos los jugadores
- `GET /api/jugadores/{id}` — Detalle de un jugador

### Partidas
- `GET /api/partidas` — Lista partidas con filtros
  - Query params: `jugadorId`, `anioDesde`, `anioHasta`, `oponente`, `evento`, `nombreApertura`, `variante`
- `GET /api/partidas/{id}` — Detalle de una partida

### Análisis
- `POST /api/analisis/evaluar` — Evalúa una posición FEN
  - Body: `{ "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }`
  - Response: `{ "evaluacion": 0, "mejorMovimiento": "e2e4" }`

### Aperturas
- `GET /api/aperturas` — Lista todas las aperturas
- `GET /api/aperturas/{nombre}/variantes` — Variantes de una apertura
- `GET /api/aperturas/aprendizaje?apertura=Siciliana&variante=Najdorf` — Línea teórica completa
- `GET /api/aperturas/aprendizaje/random` — Apertura y variante aleatoria

### Estadísticas
- `GET /api/estadisticas/jugador/{id}` — Estadísticas completas del jugador

### Importación
- `POST /api/import/importar-todos` — Importa todos los archivos PGN

## 🔧 Configuración

### Base de Datos
- SQLite (archivo: `ChessLegacy.db`)
- Migraciones automáticas con Entity Framework Core

### Stockfish
- Profundidad de análisis: 10 (configurable en `StockfishEngine.cs`)
- Tiempo de análisis: ~500ms por posición

### Frontend
- Puerto: 5173 (Vite default)
- API URL: `http://localhost:5000` (configurable en `services/api.js`)

## 🐛 Troubleshooting

### Backend no inicia
```bash
dotnet --version   # Verificar .NET SDK
dotnet clean && dotnet build
```

### Frontend no carga
```bash
rm -rf node_modules package-lock.json
npm install
```

### Stockfish no funciona
- Verificar que existe: `backend/ChessLegacy.API/stockfish/stockfish.exe`
- Descargar desde: https://stockfishchess.org/download/

### Base de datos corrupta
```bash
rm ChessLegacy.db
dotnet ef database update
```

## 🚀 Producción

```bash
# Backend
dotnet publish -c Release -o ./publish

# Frontend
npm run build   # Archivos en dist/
```

## 📚 Tecnologías

### Backend
- ASP.NET Core 10.0
- Entity Framework Core
- SQLite
- Stockfish Chess Engine

### Frontend
- React 18
- Vite
- react-chessboard 4.7.1
- chess.js
- react-select
- recharts

## 👥 Maestros Incluidos

1. **Mikhail Tal** (1936-1992) — El Mago de Riga
2. **José Raúl Capablanca** (1888-1942) — La Máquina de Ajedrez
3. **Garry Kasparov** (1963-presente) — El Ogro de Bakú
4. **Bobby Fischer** (1943-2008) — El Genio Americano
5. **Anatoly Karpov** (1951-presente) — La Boa Constrictora
6. **Alexander Alekhine** (1892-1946) — El Poeta del Ajedrez
7. **Tigran Petrosian** (1929-1984) — Tigran de Hierro
8. **Magnus Carlsen** (1990-presente) — El Mozart del Ajedrez

## 📝 Licencia

MIT License

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaFeature`)
3. Commit (`git commit -m 'Add NuevaFeature'`)
4. Push (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

---

Desarrollado para la asignatura de Desarrollo de Servicios Web y para uso personal, principalmente para estudiar aperturas de ajedrez 😁
