# ♟️ Chess Legacy

Sistema de análisis histórico de ajedrez con evaluación híbrida y juego contra maestros legendarios.

## 📋 Requisitos Previos

- **Node.js** 18+ y npm
- **.NET SDK** 8.0 o superior
- **Stockfish** (se descarga automáticamente)
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

# Restaurar paquetes NuGet
dotnet restore

# Crear base de datos SQLite
dotnet ef database update --context ChessLegacyContext

# Descargar Stockfish (Windows)
# El ejecutable debe estar en: backend/ChessLegacy.API/stockfish/stockfish.exe

# Ejecutar API (puerto 5000)
dotnet run
```

La API estará disponible en: `http://localhost:5000`

### 3. Frontend (React)

```bash
cd frontend/chess-legacy-ui

# Instalar dependencias
npm install

# Ejecutar en desarrollo (puerto 5173)
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### 4. Importar Partidas Históricas

```bash
# Coloca archivos PGN en: backend/ChessLegacy.API/Scripts/pgn_files/
# Nombrados como: tal.pgn, capablanca.pgn, kasparov.pgn, etc.

# Importar todas las partidas
curl -X POST http://localhost:5000/api/import/importar-todos
```

## 📁 Estructura del Proyecto

```
chess-legacy/
├── backend/
│   └── ChessLegacy.API/
│       ├── Controllers/          # Endpoints de la API
│       ├── Services/             # Lógica de negocio
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

1. **Galería de Maestros**
   - 8 grandes maestros históricos
   - Perfiles detallados con biografías
   - Imágenes y estadísticas

2. **Visor de Partidas**
   - 20,550+ partidas históricas
   - Navegación movimiento por movimiento
   - Filtros por año, oponente, evento, apertura
   - Sistema de favoritos con localStorage
   - Evaluación en tiempo real con Stockfish
   - Barra de evaluación visual

3. **Jugar Contra el Maestro**
   - IA personalizada por maestro
   - Estilos de juego históricos:
     - Tal: Agresivo y táctico (90% ataque)
     - Capablanca: Posicional y preciso (90% posicional)
     - Kasparov: Universal y dinámico
     - Fischer: Preciso y perfeccionista
     - Karpov: Profilaxis extrema
     - Alekhine: Combinaciones profundas
     - Petrosian: Defensa impenetrable
     - Carlsen: Maestro de finales
   - Visualización de preferencias de estilo

4. **Estadísticas y Analytics**
   - Dashboard por maestro
   - Gráficos de aperturas más usadas
   - Evolución histórica
   - Oponentes frecuentes
   - Análisis de variantes

5. **Diseño Moderno**
   - Tema oscuro elegante
   - Paleta dorada (#d4af37)
   - Efectos glassmorphism
   - Responsive (desktop)

## 📡 API Endpoints

### Jugadores
- `GET /api/jugadores` - Lista todos los jugadores
- `GET /api/jugadores/{id}` - Detalle de un jugador

### Partidas
- `GET /api/partidas` - Lista partidas con filtros
  - Query params: `jugadorId`, `anioDesde`, `anioHasta`, `oponente`, `evento`, `nombreApertura`, `variante`
- `GET /api/partidas/{id}` - Detalle de una partida

### Análisis
- `POST /api/analisis/evaluar` - Evalúa una posición FEN
  - Body: `{ "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }`
  - Response: `{ "evaluacion": 0, "mejorMovimiento": "e2e4" }`

### Aperturas
- `GET /api/aperturas` - Lista todas las aperturas
- `GET /api/aperturas/{nombre}/variantes` - Variantes de una apertura

### Estadísticas
- `GET /api/estadisticas/jugador/{id}` - Estadísticas completas del jugador

### Importación
- `POST /api/import/importar-todos` - Importa todos los archivos PGN

## 🎯 Uso

### 1. Explorar Maestros
- Navega por la galería de maestros
- Click en un maestro para ver su perfil completo

### 2. Ver Partidas Históricas
- Selecciona "Ver Partidas"
- Usa filtros para encontrar partidas específicas
- Click en una partida para visualizarla
- Navega movimiento por movimiento
- Marca favoritos con la estrella ⭐

### 3. Jugar Contra un Maestro
- Selecciona "Jugar Contra [Maestro]"
- Mueve las piezas blancas
- El maestro responderá con su estilo característico
- Observa las barras de estilo para entender sus preferencias

### 4. Ver Estadísticas
- Selecciona "Estadísticas y Analytics"
- Explora gráficos de aperturas, oponentes y evolución histórica

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
# Verificar .NET SDK
dotnet --version

# Limpiar y reconstruir
dotnet clean
dotnet build
```

### Frontend no carga
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Stockfish no funciona
- Verificar que existe: `backend/ChessLegacy.API/stockfish/stockfish.exe`
- Descargar desde: https://stockfishchess.org/download/

### Base de datos corrupta
```bash
# Eliminar y recrear
rm ChessLegacy.db
dotnet ef database update
```

## 🚀 Producción

### Backend
```bash
dotnet publish -c Release -o ./publish
# Ejecutar: ./publish/ChessLegacy.API.exe
```

### Frontend
```bash
npm run build
# Archivos en: dist/
# Servir con nginx, Apache, o cualquier servidor estático
```

## 📚 Tecnologías

### Backend
- ASP.NET Core 8.0
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

1. **Mikhail Tal** (1936-1992) - El Mago de Riga
2. **José Raúl Capablanca** (1888-1942) - La Máquina de Ajedrez
3. **Garry Kasparov** (1963-presente) - El Ogro de Bakú
4. **Bobby Fischer** (1943-2008) - El Genio Americano
5. **Anatoly Karpov** (1951-presente) - La Boa Constrictora
6. **Alexander Alekhine** (1892-1946) - El Poeta del Ajedrez
7. **Tigran Petrosian** (1929-1984) - Tigran de Hierro
8. **Magnus Carlsen** (1990-presente) - El Mozart del Ajedrez

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Proyecto: [https://github.com/TU_USUARIO/chess-legacy](https://github.com/TU_USUARIO/chess-legacy)

---

Hecho con ♟️ y ☕
