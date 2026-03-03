# 🗺️ Chess Legacy - Roadmap

## ✅ Completado

### Infraestructura Base
- [x] Configuración del proyecto backend (.NET 10 + SQLite)
- [x] Configuración del proyecto frontend (React 18 + Vite)
- [x] Base de datos con Entity Framework Core
- [x] Integración de Stockfish
- [x] API REST con endpoints básicos

### Modelos y Datos
- [x] Modelo de datos (Jugadores, Partidas, Posiciones, Intentos, Movimientos, Aperturas)
- [x] Seeder con 8 maestros históricos (Tal, Capablanca, Kasparov, Fischer, Karpov, Alekhine, Petrosian, Carlsen)
- [x] Sistema de importación PGN personalizado (sin dependencias externas)
- [x] Importación de 20,550 partidas históricas

### Frontend Base
- [x] Galería de maestros con cards interactivas
- [x] Página de detalle de cada maestro
- [x] Integración de react-chessboard (compatible con React 18)
- [x] Visor de partidas famosas con navegación de movimientos
- [x] Componentes base: PlayMaster, StyleTraining, Biography

### API Endpoints
- [x] `GET /api/jugadores` - Lista de jugadores
- [x] `GET /api/jugadores/{id}` - Detalle de jugador
- [x] `GET /api/partidas` - Lista de partidas con filtros
- [x] `GET /api/partidas/{id}` - Detalle de partida
- [x] `POST /api/import/importar-todos` - Importación masiva de PGN

### Visor de Partidas
- [x] Añadir filtros por año, oponente, evento, apertura, variante
- [x] Mostrar información completa de la partida (resultado, ECO, fecha)
- [x] Mejorar controles de navegación (ir a movimiento específico)
- [x] Añadir notación algebraica junto al tablero
- [x] Orientación del tablero según color del jugador
- [x] Mostrar nombres de jugadores en ambos lados del tablero
- [x] Barra de evaluación invertida según perspectiva del jugador

### Sistema de Análisis con Stockfish
- [x] Crear endpoint `POST /api/analisis/evaluar`
- [x] Integrar Stockfish para evaluar posiciones FEN
- [x] Calcular evaluación en centipawns
- [x] Mostrar evaluación en tiempo real en el visor de partidas
- [x] Barra de evaluación visual con colores

---

## 🚧 En Progreso

_Ninguna tarea en progreso actualmente_

---

## 📋 Próximos Pasos

### 1. Modo "Jugar Contra el Maestro"
- [ ] Cargar posiciones históricas del maestro seleccionado
- [ ] Permitir al usuario hacer movimientos en el tablero
- [ ] Evaluar precisión objetiva (Stockfish)
- [ ] Evaluar fidelidad al estilo (heurísticas basadas en pesos)
- [ ] Calcular score final ponderado: `(Precisión × 0.6) + (Estilo × 0.4)`
- [ ] Mostrar feedback visual con explicación
- [ ] Sistema de puntuación y progreso

### 2. Sistema de Entrenamiento de Estilo
- [ ] Seleccionar posiciones críticas del maestro
- [ ] Presentar posición sin mostrar el movimiento
- [ ] Usuario intenta adivinar el movimiento histórico
- [ ] Evaluar similitud con el estilo del maestro
- [ ] Mostrar explicación del movimiento histórico
- [ ] Estadísticas de aciertos por tipo de posición

### 3. Estadísticas y Analytics
- [x] Dashboard de estadísticas por maestro
- [x] Gráficos de aperturas más usadas
- [ ] Análisis de patrones de juego (sacrificios, finales, etc.)
- [ ] Comparativa entre maestros
- [x] Evolución histórica (por año)
- [x] Estadísticas de oponentes más frecuentes

### 4. Sistema de Favoritos
- [x] Marcar partidas como favoritas con estrella
- [x] Guardar favoritos en localStorage por jugador
- [x] Filtro para ver solo partidas favoritas
- [x] Botón de favorito en banner de partida
- [x] Contador de favoritos en header

### 5. Diseño y UX
- [x] Tema oscuro elegante con degradados
- [x] Paleta de colores dorados (#d4af37)
- [x] Tipografía Georgia serif para títulos
- [x] Efectos glassmorphism en cards
- [x] Hover effects y transiciones suaves
- [x] Diseño consistente en todas las páginas
- [x] Imágenes locales de maestros

### 6. Mejoras de UX/UI
- [ ] Loading states y spinners
- [ ] Paginación mejorada con infinite scroll
- [ ] Búsqueda de partidas por texto
- [ ] Modo claro (ya tiene modo oscuro)
- [ ] Responsive design para móviles
- [ ] Tooltips informativos

### 7. Optimizaciones
- [ ] Caché de evaluaciones de Stockfish
- [ ] Índices de base de datos optimizados
- [ ] Lazy loading de partidas
- [ ] Compresión de PGN en base de datos
- [ ] API pagination mejorada

### 8. Features Avanzadas
- [ ] Exportar partidas a PGN
- [ ] Compartir posiciones específicas (URL con FEN)
- [x] Sistema de favoritos
- [ ] Notas personales en partidas
- [ ] Comparar dos maestros lado a lado
- [ ] Modo de estudio con análisis profundo

---

## 🎯 Prioridad Inmediata

1. **Modo "Jugar Contra el Maestro"** - Feature principal
2. **Sistema de Entrenamiento de Estilo** - Aprendizaje interactivo
3. **Responsive Design** - Adaptación móvil

---

## 📊 Progreso General

**Completado:** ~60%  
**En Progreso:** ~0%  
**Pendiente:** ~40%

---

## 🔧 Deuda Técnica

- [ ] Remover dependencia `pgn.net` (no compatible con .NET 10)
- [ ] Añadir tests unitarios
- [ ] Añadir tests de integración
- [ ] Documentación de API con Swagger/Scalar
- [ ] Manejo de errores consistente
- [ ] Logging estructurado
- [ ] Variables de entorno para configuración
