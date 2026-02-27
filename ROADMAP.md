# 🚀 Chess Legacy - Roadmap & Vision

## 📋 Visión del Proyecto

Chess Legacy es una plataforma de entrenamiento de ajedrez que permite a los usuarios:
- **Jugar contra IA con personalidad** de grandes maestros históricos
- **Aprender estilos de juego** mediante gamificación y análisis comparativo
- **Explorar partidas históricas** con filtros avanzados por apertura, jugador y estilo
- **Entrenar posiciones específicas** al estilo de jugadores legendarios

---

## 🎯 Características Principales

### 1. Motor de Juego con Personalidad
- Stockfish adaptado con parámetros de estilo por jugador
- Usuarios pueden ajustar agresividad, complejidad, materialismo
- IA juega "como Tal" (sacrificios) o "como Karpov" (posicional)

### 2. Base de Datos Masiva de Partidas
- Importación de PGN de grandes maestros (~50k partidas/jugador)
- Análisis pre-procesado con Stockfish
- Clasificación automática de movimientos (táctico, posicional, sacrificio)

### 3. Sistema de Gamificación
- Logros por estilo: "Sacrificio a lo Tal", "Asfixia Karpoviana"
- Métricas de similitud con el estilo del maestro
- Ranking de usuarios por precisión y fidelidad de estilo

### 4. Búsqueda y Filtros Avanzados
- Filtrar por jugador, apertura (ECO), variante específica
- Ejemplo: "Najdorf de Kasparov en los 90s"
- Fase del juego (apertura, medio juego, final)

### 5. Modos de Entrenamiento
- **Adivina el movimiento**: ¿Qué jugó el maestro?
- **Juega la partida**: Reproduce partida histórica
- **Desafío de estilo**: Juega una posición "como X"
- **Análisis comparativo**: Tu movimiento vs el del maestro

### 6. Análisis en Tiempo Real
- Barra de evaluación dinámica (estilo Chess.com)
- Clasificación de movimientos (Excelente/Bueno/Impreciso/Error/Blunder)
- Gráfico de evaluación a lo largo de la partida
- Sugerencias de mejor movimiento

---

## 🗄️ Arquitectura de Base de Datos

### Tablas Principales

#### **Jugadores**
```sql
- Id (PK)
- Nombre
- Pais
- FechaNacimiento
- Biografia
- FotoUrl
- PerfilEstilo (JSON)
  {
    "agresividad": 0.9,
    "complejidad": 0.8,
    "iniciativa": 0.85,
    "materialismo": 0.3
  }
```

#### **Partidas**
```sql
- Id (PK)
- JugadorId (FK)
- Evento
- Fecha
- Resultado (1-0, 0-1, 1/2-1/2)
- ColorJugador (Blancas/Negras)
- Oponente
- EloJugador
- EloOponente
- ECO (código apertura: B90, E15, etc)
- AperturaNombre
- VarianteNombre
- PGN_Completo (texto)
```

#### **Movimientos** (tabla clave)
```sql
- Id (PK)
- PartidaId (FK)
- NumeroMovimiento
- FEN_Antes
- FEN_Despues
- Movimiento (notación: e4, Nf3, O-O)
- EvaluacionStockfish (centipawns)
- TipoMovimiento (Sacrificio, Posicional, Tactico, Defensivo)
- FaseJuego (Apertura, MedioJuego, Final)
- CaracteristicasEstilo (JSON)
  {
    "complejidad": 0.7,
    "agresividad": 0.8,
    "riesgo": 0.6
  }
```

#### **Aperturas**
```sql
- ECO (PK: B90, C95, E15)
- Nombre (Siciliana Najdorf, Ruy Lopez, Nimzo-India)
- Variante (Poisoned Pawn, Marshall Attack)
- MovimientosIniciales (e4 c5 Nf3 d6...)
```

#### **UsuarioProgreso**
```sql
- Id (PK)
- UsuarioId (FK)
- JugadorEstiloId (FK)
- PuntosEstilo
- PartidasJugadas
- PrecisionPromedio
- SimilitudEstilo (0-100%)
- Logros (JSON array)
- FechaUltimaPartida
```

#### **Logros**
```sql
- Id (PK)
- Nombre
- Descripcion
- Icono
- Criterio (JSON)
  {
    "tipo": "sacrificio_exitoso",
    "jugador": "Tal",
    "cantidad": 10
  }
```

---

## 🛠️ Sistema de Importación PGN

### Herramienta CLI
```bash
# Importar partidas de un jugador
dotnet run import-pgn --jugador "Kasparov" --file "kasparov_complete.pgn"

# Analizar con Stockfish (batch)
dotnet run analyze-games --jugador-id 3 --depth 20

# Clasificar movimientos por estilo
dotnet run classify-moves --partida-id 1234
```

### Proceso de Importación
1. **Parse PGN** → Extraer metadata (evento, fecha, resultado, ECO)
2. **Generar FEN** por cada movimiento de la partida
3. **Análisis Stockfish** (batch, no en tiempo real)
   - Top 5 mejores movimientos
   - Evaluación en centipawns
4. **Clasificación de movimientos**
   - Sacrificio: pierde material pero gana iniciativa
   - Posicional: mejora estructura, sin táctica inmediata
   - Táctico: amenaza concreta, combinación
   - Defensivo: neutraliza amenaza rival
5. **Guardar en BD** con índices optimizados

### Fuentes de PGN
- **PGNMentor**: Colección de partidas de maestros
- **ChessGames.com**: API/scraping
- **Lichess Database**: Partidas de élite
- **TWIC (The Week in Chess)**: Actualizaciones semanales

**Objetivo**: ~50,000 partidas por jugador top

---

## ⚙️ Motor de Personalidad Stockfish

### Parámetros Ajustables por Usuario

```json
{
  "jugador": "Tal",
  "agresividad": 0.9,        // 0-1: Prefiere sacrificios
  "complejidad": 0.8,        // Evita simplificaciones
  "iniciativa": 0.85,        // Prefiere ataque vs defensa
  "materialismo": 0.3,       // Bajo = acepta sacrificios
  "profundidad": 20,         // Nivel Stockfish (15-25)
  "apertura_libro": true     // Usa libro de aperturas del jugador
}
```

### Algoritmo de Selección de Movimiento

1. **Stockfish evalúa** top 5 movimientos
2. **Filtro por personalidad**:
   - Si `agresividad > 0.7`: descarta movimientos muy posicionales
   - Si `materialismo < 0.4`: acepta sacrificios con compensación
   - Si `complejidad > 0.7`: evita simplificaciones (cambios de piezas)
3. **Scoring ponderado**:
   ```
   Score = (EvaluacionStockfish × 0.6) + (SimilitudEstilo × 0.4)
   ```
4. **Añadir ruido controlado** para humanizar (±50 centipawns)
5. **Seleccionar movimiento** con mejor score ajustado

### Ejemplo: Tal vs Karpov

**Posición**: Medio juego con oportunidad de sacrificio de calidad

**Stockfish Top 3**:
1. Rxe6 (sacrificio, +0.5)
2. Nd5 (posicional, +1.2)
3. h4 (expansión, +0.8)

**Tal (agresividad=0.9, materialismo=0.3)**:
- Rxe6: Score = (0.5 × 0.6) + (0.95 × 0.4) = **0.68** ✅ Elegido
- Nd5: Score = (1.2 × 0.6) + (0.3 × 0.4) = 0.84
- h4: Score = (0.8 × 0.6) + (0.5 × 0.4) = 0.68

**Karpov (agresividad=0.3, materialismo=0.8)**:
- Rxe6: Score = (0.5 × 0.6) + (0.2 × 0.4) = 0.38
- Nd5: Score = (1.2 × 0.6) + (0.9 × 0.4) = **1.08** ✅ Elegido
- h4: Score = (0.8 × 0.6) + (0.6 × 0.4) = 0.72

---

## 🎮 Sistema de Gamificación

### Logros por Estilo

| Logro | Descripción | Criterio |
|-------|-------------|----------|
| 🔥 **Sacrificio a lo Tal** | Sacrifica pieza y gana | Sacrificio exitoso × 10 |
| 🐍 **Asfixia Karpoviana** | Gana sin dar contrajuego | Ventaja posicional sostenida |
| 💎 **Precisión Capablanca** | Juega con 95%+ accuracy | Accuracy ≥ 95% en 20 partidas |
| 🏰 **Najdorf Master** | Domina la Najdorf | 50 partidas en Najdorf |
| ⚡ **Ataque Relámpago** | Mate en <25 movimientos | Mate rápido × 5 |
| 🧠 **Estratega Petrosian** | Juego profiláctico perfecto | Neutraliza amenazas × 20 |
| 🎯 **Francotirador Fischer** | Precisión táctica | Encuentra táctica crítica × 15 |

### Métricas por Partida

```json
{
  "similitudEstilo": 87,        // 0-100%
  "precisionStockfish": 92,     // Accuracy
  "movimientosCaracteristicos": [
    {
      "movimiento": "Rxf7",
      "tipo": "Sacrificio típico de Tal",
      "evaluacion": "+2.3"
    }
  ],
  "fasesMejorJugadas": {
    "apertura": 95,
    "medioJuego": 88,
    "final": 91
  },
  "comparacionHistorica": {
    "partidaSimilar": "Tal vs Smyslov, 1959",
    "similitud": 78
  }
}
```

### Sistema de Puntos

- **Ganar partida**: 100 pts base
- **Bonus por estilo**: +50 pts si similitud > 80%
- **Movimiento característico**: +10 pts cada uno
- **Precisión**: +20 pts si accuracy > 90%
- **Racha**: ×1.5 multiplicador por 5 victorias seguidas

---

## 🔍 Filtros y Búsqueda Avanzada

### UI Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Explorador de Partidas                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Jugador:     [Kasparov ▼]                                  │
│  Apertura:    [Siciliana Najdorf ▼]                         │
│  Variante:    [Poisoned Pawn ▼]                             │
│  Fase:        [Todas ▼]  Resultado: [Todas ▼]               │
│  Año:         [1985] ━━━━━━━━━━━━━━━━━━━━━━━ [2005]        │
│  Tipo:        [☑ Táctica] [☑ Posicional] [☐ Final]         │
│                                                              │
│  [🔍 Buscar]  [🔄 Limpiar]                                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ 📊 Resultados: 247 partidas encontradas                     │
│                                                              │
│  1. Kasparov vs Anand (1995) - Linares                      │
│     Najdorf Poisoned Pawn • 1-0 • Táctica brillante         │
│                                                              │
│  2. Kasparov vs Shirov (1994) - Horgen                      │
│     Najdorf Poisoned Pawn • 1-0 • Ataque demoledor          │
│                                                              │
│  [Ver más...]                                                │
└─────────────────────────────────────────────────────────────┘
```

### Endpoints API

```csharp
// Búsqueda avanzada
GET /api/partidas/buscar?jugadorId=3&eco=B90&variante=Poisoned&fase=medio&desde=1985&hasta=2005

// Estadísticas por apertura
GET /api/jugadores/3/estadisticas/apertura/B90

// Partidas similares a posición FEN
POST /api/partidas/similares
Body: { "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R" }
```

---

## 🎓 Modos de Entrenamiento

### 1. Adivina el Movimiento
- Muestra posición de partida histórica
- Usuario intenta adivinar qué jugó el maestro
- Feedback: movimiento real + evaluación comparativa

### 2. Juega la Partida Completa
- Reproduce partida histórica paso a paso
- Usuario juega como el maestro
- Puede "desviarse" y ver análisis alternativo

### 3. Desafío de Estilo
- Posición aleatoria
- Objetivo: "Juega como Tal" (busca sacrificio)
- Puntuación por similitud con estilo del maestro

### 4. Análisis Comparativo
- Después de cada movimiento:
  - Tu movimiento vs movimiento del maestro
  - Evaluación Stockfish de ambos
  - Explicación de por qué el maestro eligió ese movimiento

### 5. Entrenamiento de Aperturas
- Practica repertorio de un jugador específico
- Ejemplo: "Aprende el repertorio de Najdorf de Kasparov"
- Sistema de repetición espaciada

---

## 📊 Análisis en Tiempo Real

### Componentes del Analizador

```
┌─────────────────────────────────────────────────────────────┐
│ ♔ ♕ ♖ ♗ ♘ ♙  TABLERO  ♟ ♞ ♝ ♜ ♛ ♚                        │
│                                                              │
│  [Tablero interactivo 8×8]                                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ 📊 Evaluación                                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Blancas +1.2                                               │
│                                                              │
│ 💡 Mejor movimiento: Nf3                                    │
│ 📈 Tu movimiento: e4 (Excelente!)                           │
│                                                              │
│ 🎯 Similitud con Kasparov: 89%                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ 📉 Gráfico de Evaluación                                    │
│                                                              │
│   +3 ┤                                    ╭─                │
│   +2 ┤                          ╭────╮    │                 │
│   +1 ┤              ╭───────────╯    ╰────╯                 │
│    0 ┼──────────────╯                                       │
│   -1 ┤                                                      │
│      └─────────────────────────────────────────────────     │
│       1   5   10  15  20  25  30  35  40                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Clasificación de Movimientos

| Símbolo | Clasificación | Criterio |
|---------|---------------|----------|
| ‼️ | Brillante | Único movimiento ganador |
| ✅ | Excelente | Top 1 de Stockfish |
| ✔️ | Bueno | Top 3, diferencia <0.3 |
| ⚠️ | Impreciso | Pierde 0.3-1.0 |
| ❌ | Error | Pierde 1.0-3.0 |
| 💥 | Blunder | Pierde >3.0 |

---

## 🗓️ Plan de Implementación

### **Fase 1: Fundación (2-3 semanas)**

#### Semana 1-2: Base de Datos
- [ ] Diseñar esquema completo de BD
- [ ] Crear migraciones Entity Framework
- [ ] Implementar modelos y DTOs
- [ ] Configurar índices para búsquedas rápidas

#### Semana 2-3: Importación PGN
- [ ] Parser PGN robusto (librería: `PgnReader` o custom)
- [ ] Script CLI para importación masiva
- [ ] Generador de FEN por movimiento
- [ ] Integración con Stockfish para análisis batch
- [ ] Clasificador de movimientos (sacrificio, posicional, etc)

#### Entregable Fase 1
- BD poblada con 3-5 jugadores (~50k partidas)
- Herramienta CLI funcional
- API básica de consulta de partidas

---

### **Fase 2: Motor de Juego (3-4 semanas)**

#### Semana 4-5: Stockfish con Personalidad
- [ ] Wrapper de Stockfish con parámetros personalizados
- [ ] Algoritmo de scoring por estilo
- [ ] Sistema de "ruido controlado" para humanizar
- [ ] Libro de aperturas por jugador

#### Semana 6-7: API de Juego
- [ ] Endpoint para iniciar partida vs IA
- [ ] Validación de movimientos
- [ ] Cálculo de evaluación en tiempo real
- [ ] Guardado de partidas de usuario

#### Entregable Fase 2
- API funcional para jugar vs IA con estilo
- Usuarios pueden elegir "jugar como Tal" o "vs Karpov"
- Evaluación básica de movimientos

---

### **Fase 3: Frontend & Análisis (3-4 semanas)**

#### Semana 8-9: Tablero Interactivo
- [ ] Integrar `react-chessboard` mejorado
- [ ] Barra de evaluación dinámica
- [ ] Gráfico de evaluación (Chart.js o Recharts)
- [ ] Clasificación visual de movimientos

#### Semana 10-11: Análisis Comparativo
- [ ] Mostrar "mejor movimiento" de Stockfish
- [ ] Comparar movimiento usuario vs maestro
- [ ] Métricas de similitud de estilo
- [ ] Resumen post-partida

#### Entregable Fase 3
- Experiencia de juego completa
- Análisis visual en tiempo real
- Feedback inmediato al usuario

---

### **Fase 4: Gamificación (2-3 semanas)**

#### Semana 12-13: Sistema de Logros
- [ ] Definir 20+ logros
- [ ] Sistema de detección automática
- [ ] Notificaciones de logros desbloqueados
- [ ] Perfil de usuario con progreso

#### Semana 14: Ranking y Estadísticas
- [ ] Tabla de clasificación global
- [ ] Estadísticas personales detalladas
- [ ] Comparación con otros usuarios

#### Entregable Fase 4
- Sistema de gamificación completo
- Usuarios motivados a mejorar
- Comunidad competitiva

---

### **Fase 5: Búsqueda Avanzada (1-2 semanas)**

#### Semana 15-16: Filtros y Explorador
- [ ] UI de búsqueda avanzada
- [ ] Filtros por jugador, apertura, variante, año
- [ ] Búsqueda por posición FEN
- [ ] Estadísticas por apertura

#### Entregable Fase 5
- Explorador de partidas históricas
- Usuarios pueden estudiar repertorios específicos

---

### **Fase 6: Modos de Entrenamiento (2-3 semanas)**

#### Semana 17-18: Modos Básicos
- [ ] "Adivina el movimiento"
- [ ] "Juega la partida"
- [ ] Sistema de puntuación

#### Semana 19: Modos Avanzados
- [ ] "Desafío de estilo"
- [ ] Entrenamiento de aperturas
- [ ] Repetición espaciada

#### Entregable Fase 6
- 5 modos de entrenamiento funcionales
- Sistema educativo completo

---

## 🎨 Stack Tecnológico

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **ORM**: Entity Framework Core
- **BD**: MySQL 8.0
- **Motor**: Stockfish 16
- **Parser PGN**: Custom o `PgnReader` NuGet

### Frontend
- **Framework**: React 18 + Vite
- **Tablero**: `react-chessboard` + `chess.js`
- **UI**: Tailwind CSS / Material-UI
- **Gráficos**: Recharts / Chart.js
- **Estado**: Zustand / Redux Toolkit

### DevOps
- **Hosting**: AWS / Azure / DigitalOcean
- **CI/CD**: GitHub Actions
- **Contenedores**: Docker
- **Monitoreo**: Application Insights

---

## 📈 Métricas de Éxito

### KPIs Técnicos
- Tiempo de respuesta API: <200ms
- Análisis Stockfish: <2s por movimiento
- Búsqueda de partidas: <500ms
- Uptime: >99.5%

### KPIs de Usuario
- Usuarios activos mensuales: 1,000+ (6 meses)
- Partidas jugadas/usuario: 10+ (primer mes)
- Tasa de retención: >40% (30 días)
- NPS (Net Promoter Score): >50

---

## 🚧 Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Stockfish muy lento | Alto | Pre-análisis batch, caché de posiciones |
| BD muy grande | Medio | Índices optimizados, particionamiento |
| Clasificación de estilo imprecisa | Alto | Machine Learning, validación manual |
| Usuarios no entienden métricas | Medio | Tutoriales, tooltips explicativos |

---

## 🎯 Próximos Pasos Inmediatos

### Esta Semana
1. ✅ Crear este documento de roadmap
2. [ ] Diseñar esquema de BD completo (diagrama ER)
3. [ ] Investigar librerías de parsing PGN
4. [ ] Descargar datasets de partidas (ChessGames.com)

### Próxima Semana
5. [ ] Implementar migraciones de BD
6. [ ] Crear script de importación PGN básico
7. [ ] Importar primeras 1,000 partidas de prueba
8. [ ] Validar estructura de datos

### Mes 1
9. [ ] Completar Fase 1 (Fundación)
10. [ ] Demo funcional de importación masiva
11. [ ] API de consulta de partidas

---

## 💡 Ideas Futuras (Post-MVP)

- **Modo multijugador**: Juega vs otros usuarios con estilo de maestro
- **Torneos temáticos**: "Torneo estilo Tal" (solo sacrificios válidos)
- **IA adaptativa**: Aprende de tus errores y ajusta dificultad
- **Análisis de voz**: "Alexa, ¿qué jugaría Kasparov aquí?"
- **Realidad aumentada**: Tablero físico + análisis AR
- **Integración con Lichess/Chess.com**: Importa tus partidas
- **Modo "Inmortal"**: Recrea partidas legendarias
- **Streaming**: Integración con Twitch para streamers

---

## 📞 Contacto y Contribuciones

**Desarrollador Principal**: Santiago Minaya  
**GitHub**: [SantiMinaya/ChessLegacy](https://github.com/SantiMinaya/ChessLegacy)  
**Email**: [tu_email@example.com]

---

**Última actualización**: Enero 2025  
**Versión del documento**: 1.0
