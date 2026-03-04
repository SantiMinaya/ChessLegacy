# 🛠️ Chess Legacy — Tecnologías y Descripción

## ¿Qué es Chess Legacy?

Chess Legacy es una aplicación web de ajedrez orientada al aprendizaje y la historia. Permite explorar las partidas de los 8 grandes maestros más influyentes de todos los tiempos, jugar contra ellos con IA que imita su estilo real, y entrenar aperturas de forma interactiva.

No es un simple visor de partidas: es una plataforma de estudio donde puedes aprender teoría de aperturas jugando, poner a prueba tus conocimientos contra el reloj, y descubrir qué apertura se está jugando solo con ver la posición.

---

## 🎯 Qué puedes hacer

| Funcionalidad | Descripción |
|---|---|
| **Galería de Maestros** | Explora los perfiles de Tal, Capablanca, Kasparov, Fischer, Karpov, Alekhine, Petrosian y Carlsen |
| **Visor de Partidas** | Navega 20.550+ partidas históricas con evaluación Stockfish en tiempo real |
| **Jugar contra el Maestro** | Enfrenta a una IA que imita el estilo histórico de cada maestro |
| **Aprender Aperturas** | Aprende líneas teóricas jugándolas tú mismo, movimiento a movimiento |
| **Contrarreloj** | Practica aperturas con 10 segundos por movimiento |
| **Adivina la Apertura** | Quiz de 5 rondas: identifica la apertura por la posición |
| **Estadísticas** | Dashboards con gráficos de aperturas, rivales y evolución histórica |

---

## 🧱 Stack Tecnológico

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| **ASP.NET Core** | 10.0 | Framework principal de la API REST |
| **Entity Framework Core** | 10.x | ORM para acceso a base de datos |
| **SQLite** | — | Base de datos embebida |
| **Stockfish** | 17 | Motor de ajedrez para evaluación de posiciones |
| **C#** | 13 | Lenguaje principal del backend |

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 18 | Framework UI principal |
| **Vite** | 6.x | Bundler y servidor de desarrollo |
| **react-chessboard** | 4.7.1 | Componente de tablero de ajedrez |
| **chess.js** | 1.x | Lógica de ajedrez (validación de movimientos, FEN) |
| **recharts** | 2.x | Gráficos y visualizaciones estadísticas |
| **axios** | 1.x | Cliente HTTP para llamadas a la API |
| **react-router-dom** | 6.x | Enrutamiento entre páginas |

### Infraestructura

| Elemento | Detalle |
|---|---|
| **Base de datos** | SQLite — archivo único `ChessLegacy.db` |
| **API** | REST en `http://localhost:5000` |
| **Frontend** | SPA en `http://localhost:5173` |
| **Formato de partidas** | PGN (Portable Game Notation) |
| **Evaluación** | Stockfish vía proceso local, profundidad 10 |

---

## 🏗️ Arquitectura

```
Browser (React SPA)
       │
       │ HTTP / REST
       ▼
ASP.NET Core API  ──►  SQLite DB
       │
       │ stdin/stdout
       ▼
  Stockfish.exe
```

El frontend es una SPA que consume la API REST. El backend expone endpoints para jugadores, partidas, aperturas, análisis y estadísticas. Stockfish corre como proceso hijo y se comunica por stdin/stdout con el protocolo UCI.

---

## 📂 Componentes Frontend principales

| Componente | Descripción |
|---|---|
| `Home.jsx` | Página principal con tabs: Grandes Maestros / Aprender Aperturas |
| `MasterDetail.jsx` | Perfil completo de un maestro con todas sus acciones |
| `PlayMaster.jsx` | Modo jugar contra el maestro con IA estilizada |
| `AperturaTraining.jsx` | Contenedor del sistema de entrenamiento de aperturas |
| `ContrarrelojMode.jsx` | Modo contrarreloj de aperturas |
| `AdivinarApertura.jsx` | Quiz de identificación de aperturas |
| `PartidasFamosas.jsx` | Visor de partidas históricas con filtros |
| `Estadisticas.jsx` | Dashboard de estadísticas por maestro |

---

## 📂 Servicios Backend principales

| Servicio | Descripción |
|---|---|
| `AperturaDetectorExtendido.cs` | 25+ aperturas con variantes y líneas teóricas de 20-30 jugadas |
| `StockfishEngine.cs` | Comunicación con Stockfish vía UCI |
| `PgnImporterAdvanced.cs` | Importación masiva de archivos PGN |
| `AnalisisService.cs` | Evaluación de posiciones FEN |
