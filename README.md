# ♟️ Chess Legacy

Sistema de análisis histórico de ajedrez con evaluación híbrida (objetiva + estilo).

## 🚀 Instalación

### 0. Clonar repositorio

```bash
git clone https://github.com/TU_USUARIO/chess-legacy.git
cd chess-legacy
```

### 1. MySQL
Instala MySQL y configura:
- Usuario: `root`
- Contraseña: `minaya13`

### 2. Backend

```bash
cd backend/ChessLegacy.API

# Descargar Stockfish
download-stockfish.bat

# Restaurar paquetes
dotnet restore

# Crear base de datos
dotnet ef database update --context ChessLegacyContext

# Ejecutar
dotnet run
```

### 3. Frontend

```bash
cd frontend/chess-legacy-ui

# Instalar dependencias
npm install

# Ejecutar
npm run dev
```

## 📡 API Endpoints

- `GET /api/jugadores` - Lista jugadores
- `GET /api/jugadores/{id}` - Obtiene jugador
- `GET /api/jugadores/{id}/posiciones` - Posiciones del jugador
- `GET /api/posiciones/{id}` - Obtiene posición
- `POST /api/analisis` - Analiza movimiento

## 🎯 Uso

1. Selecciona un jugador (Tal, Capablanca, Kasparov)
2. Elige una posición
3. Mueve una pieza en el tablero
4. Recibe evaluación con:
   - Precisión objetiva (Stockfish)
   - Fidelidad al estilo histórico
   - Score final ponderado

## 🏗️ Arquitectura

```
Backend (ASP.NET Web API)
├── Controllers
├── Services (Lógica de negocio)
├── Repositories (Acceso a datos)
├── Engine (Stockfish wrapper)
├── Models (Entidades)
└── DTOs

Frontend (React + Vite)
└── Tablero interactivo con react-chessboard

Base de Datos (MySQL)
├── Jugadores
├── Partidas
├── Posiciones
└── Intentos
```

## 📊 Sistema de Evaluación

**Score Final = (Precisión × 0.6) + (Estilo × 0.4)**

- **Precisión**: Diferencia en centipawns vs mejor jugada
- **Estilo**: Heurísticas basadas en pesos del jugador
