# 📋 Chess Legacy — Tareas Pendientes

> Este documento recoge todo lo que queda por hacer: nuevas funcionalidades de entrenamiento, mejoras técnicas y documentación necesaria para la asignatura.

---

## 🎯 Nuevos Modos de Entrenamiento (para mejorar jugando)

### 🔀 Líneas de Transposición
**Qué es:** En el Explorador de Aperturas, cuando juegas una secuencia de movimientos que puede llegar a otra apertura por transposición, la app te avisa.

**Ejemplo:** Si juegas `1.d4 Nf6 2.c4 e6 3.Nf3` puedes llegar a la Nimzoindia, Catalan o India de Dama según cómo continúe. El explorador debería mostrarte todas las posibilidades.

**Cómo implementarlo:**
- En `ExploradorAperturas.jsx`, cuando la posición coincide con el inicio de varias aperturas distintas, mostrar un aviso de transposición
- Comparar los FENs actuales contra los FENs iniciales de todas las variantes registradas

---

### 🃏 Flashcards de Variantes
**Qué es:** Modo tipo tarjetas de memoria. Ves la posición y tienes que escribir (o elegir) los siguientes N movimientos de la línea teórica de memoria, sin ver la teoría.

**Mecánica:**
- Se muestra una posición de apertura
- Tienes que escribir los siguientes 5 movimientos en notación SAN
- Si aciertas todos: la tarjeta se "domina" y aparece menos
- Si fallas: vuelve a aparecer pronto (repetición espaciada real)
- Progreso guardado en BD por variante

**Diferencia con el Modo Aprender actual:** Aquí no hay tablero interactivo, solo input de texto. Más exigente, entrena la memoria pura.

---

### 🎲 Respuestas a Jugadas Raras
**Qué es:** El oponente juega jugadas poco teóricas o incorrectas y tú tienes que encontrar la mejor respuesta.

**Mecánica:**
- Se carga una apertura conocida
- En algún momento el oponente se desvía de la teoría con una jugada mala o rara
- Tú tienes que identificar que es una desviación y encontrar la refutación
- Stockfish evalúa si tu respuesta es buena

**Por qué es útil:** En partidas reales nadie juega la teoría perfecta. Prepararte para lo inesperado es fundamental.

---

### 👁️ Visualización Sin Tablero
**Qué es:** Te dicen una secuencia de movimientos en notación y tienes que responder preguntas sobre la posición resultante sin ver el tablero.

**Ejemplos de preguntas:**
- "Tras 1.e4 e5 2.Nf3 Nc6 3.Bb5 — ¿qué pieza blanca está en b5?"
- "Tras esta secuencia — ¿puede enrocar el rey blanco?"
- "¿Cuántos peones negros hay en el flanco de rey?"

**Niveles de dificultad:**
- Fácil: 3-5 movimientos, preguntas simples
- Normal: 8-10 movimientos
- Difícil: 15+ movimientos, preguntas sobre casillas específicas

**Cómo implementarlo:** chess.js calcula la posición, se generan preguntas automáticamente a partir del estado del tablero.

---

### 🧮 Cálculo de Variantes
**Qué es:** Se muestra una posición táctica y tienes que calcular la línea correcta en tu cabeza antes de mover. Si mueves sin haber calculado correctamente, penalización.

**Mecánica:**
- Se muestra la posición
- Tienes un campo de texto donde escribes la línea que calculas: `Nxf7 Rxf7 Qh5+`
- Luego ejecutas los movimientos en el tablero
- Si coincide con lo que escribiste: puntos extra
- Si mueves algo diferente a lo que calculaste: penalización

**Por qué es útil:** Fuerza el hábito de calcular antes de actuar, el error más común en ajedrez amateur.

---

### 🏗️ Reconocimiento de Estructuras de Peones
**Qué es:** Se muestra una posición y tienes que identificar la estructura de peones entre 4 opciones.

**Estructuras a reconocer:**
- Carlsbad (peones en c6/d5 vs c4/d4)
- Isolani (peón aislado de dama)
- Hedgehog (erizo: peones en a6/b6/d6/e6)
- Maróczy (peones en c4/e4 vs g6/c5)
- Scheveningen (peones en d6/e6)
- Dragón (peones en g6/d6)
- Stonewall (peones en c6/d5/e6/f5)
- Peones doblados, colgantes, pasados...

**Por qué es útil:** Reconocer la estructura determina el plan. Es la base del pensamiento estratégico.

---

## 🔧 Mejoras Técnicas Pendientes

### Variables de Entorno (URGENTE para despliegue)
- [ ] Cambiar `http://localhost:5000` por `import.meta.env.VITE_API_URL` en `api.js`
- [ ] Mismo cambio en `PlayMaster.jsx` y `AnalisisPartida.jsx`
- [ ] Crear `.env` y `.env.production`

### Despliegue
- [ ] Dockerfile para Railway/Fly.io
- [ ] Migrar SQLite → PostgreSQL
- [ ] Stockfish para Linux (detectar OS en `StockfishEngine.cs`)
- [ ] Configurar CORS para el dominio de producción

### Performance
- [ ] Caché de evaluaciones Stockfish en BD (tabla `EvaluacionCache`)
- [ ] El `ExploradorAperturas` carga todas las variantes al montar — cargar bajo demanda
- [ ] Índices en BD para los campos de filtro de partidas

### UX
- [ ] Responsive / móvil — el hueco más grande
- [ ] Confeti al ganar (`canvas-confetti`, 3kb)
- [ ] Onboarding para usuarios nuevos (3-4 pasos)
- [ ] Swagger en el backend

### Tests
- [ ] Tests unitarios del `AperturaDetectorExtendido` (verificar FENs válidos)
- [ ] Tests de integración de los endpoints principales
- [ ] Tests del sistema de XP y logros

---

## 📚 Documentación para la Asignatura

> Todo lo que normalmente se pide en Desarrollo de Servicios Web. Marca lo que ya tengas hecho.

---

### 1. Memoria del Proyecto

- [ ] **Portada** — nombre, asignatura, curso, fecha, autor
- [ ] **Índice** con numeración de secciones
- [ ] **Introducción** — qué es el proyecto, motivación, objetivos
- [ ] **Descripción general** — resumen de funcionalidades
- [ ] **Tecnologías utilizadas** — justificación de cada elección
- [ ] **Conclusiones** — qué has aprendido, dificultades encontradas
- [ ] **Bibliografía / Referencias** — librerías, documentación consultada

---

### 2. Análisis de Requisitos

#### Requisitos Funcionales
Lista de todo lo que el sistema hace. Ejemplos para tu proyecto:

- [ ] **RF-01** El sistema permite registrar usuarios con username y contraseña
- [ ] **RF-02** El sistema permite autenticar usuarios mediante JWT
- [ ] **RF-03** El usuario puede jugar partidas contra 8 maestros históricos con IA personalizada
- [ ] **RF-04** El sistema evalúa posiciones de ajedrez usando el motor Stockfish
- [ ] **RF-05** El usuario puede entrenar aperturas en 13 modos distintos
- [ ] **RF-06** El sistema registra el progreso del usuario por apertura y variante
- [ ] **RF-07** El sistema otorga XP y logros según las actividades completadas
- [ ] **RF-08** El usuario puede ver y navegar 20.550+ partidas históricas
- [ ] **RF-09** El sistema genera una partida del día diferente cada día
- [ ] **RF-10** El usuario puede exportar partidas en formato PGN
- [ ] *(añadir todos los que correspondan)*

#### Requisitos No Funcionales
- [ ] **RNF-01** El sistema debe responder en menos de 2 segundos para operaciones normales
- [ ] **RNF-02** Las contraseñas se almacenan hasheadas con BCrypt
- [ ] **RNF-03** La autenticación usa tokens JWT con expiración
- [ ] **RNF-04** La interfaz debe ser usable en navegadores modernos
- [ ] **RNF-05** El sistema debe soportar múltiples usuarios simultáneos
- [ ] *(añadir los que correspondan)*

---

### 3. Casos de Uso

Los casos de uso describen **quién hace qué** en el sistema. Para tu proyecto los actores son:

- **Usuario no autenticado** — puede ver la galería de maestros y partidas históricas
- **Usuario autenticado** — puede entrenar, jugar, ver su perfil, etc.
- **Sistema** — procesos automáticos (importar PGNs, calcular racha, etc.)

#### Casos de uso principales a documentar:

**Autenticación:**
- [ ] CU-01: Registrar usuario
- [ ] CU-02: Iniciar sesión
- [ ] CU-03: Cerrar sesión

**Juego:**
- [ ] CU-04: Jugar partida contra maestro
- [ ] CU-05: Seleccionar dificultad
- [ ] CU-06: Activar modo Blindfold
- [ ] CU-07: Analizar partida post-partida
- [ ] CU-08: Exportar PGN

**Entrenamiento:**
- [ ] CU-09: Entrenar apertura (modo aprender)
- [ ] CU-10: Practicar contrarreloj
- [ ] CU-11: Resolver puzzle táctico
- [ ] CU-12: Completar reto del día
- [ ] CU-13: Completar misión semanal

**Perfil:**
- [ ] CU-14: Ver estadísticas personales
- [ ] CU-15: Ver tabla de clasificación
- [ ] CU-16: Subir foto de perfil
- [ ] CU-17: Exportar estadísticas a PDF
- [ ] CU-18: Cambiar tema de la aplicación

**Análisis:**
- [ ] CU-19: Analizar posición libre con Stockfish
- [ ] CU-20: Buscar partida por FEN
- [ ] CU-21: Comparar dos maestros

#### Formato de cada caso de uso:

```
ID: CU-04
Nombre: Jugar partida contra maestro
Actor: Usuario autenticado
Precondición: El usuario ha iniciado sesión
Flujo principal:
  1. El usuario selecciona un maestro
  2. El usuario elige la dificultad (Fácil/Normal/Difícil)
  3. El sistema inicia una partida con el tablero en posición inicial
  4. El usuario realiza un movimiento
  5. El sistema envía la posición a Stockfish con la personalidad del maestro
  6. Stockfish devuelve el mejor movimiento según el estilo
  7. El sistema ejecuta el movimiento del maestro
  8. Se repite desde el paso 4 hasta que la partida termina
Flujo alternativo:
  4a. El usuario activa el modo Blindfold → el tablero se oculta
  8a. La partida termina por jaque mate, tablas o abandono
Postcondición: La partida se guarda en BD con PGN y resultado
```

---

### 4. Diagrama de Casos de Uso

- [ ] Diagrama UML con todos los actores y casos de uso
- [ ] Herramientas: draw.io, Lucidchart, PlantUML o StarUML

---

### 5. Modelo de Datos

- [ ] **Diagrama Entidad-Relación (ER)** con todas las tablas:
  - Usuarios, ProgresoApertura, LogroUsuario, ActividadDiaria
  - PartidasJugadas, Jugadores, Partidas, Movimientos, Aperturas
- [ ] **Descripción de cada entidad** con sus atributos y tipos
- [ ] **Relaciones** entre entidades (1:N, N:M, etc.)

---

### 6. Arquitectura del Sistema

- [ ] **Diagrama de arquitectura** — cliente/servidor, capas
- [ ] **Descripción de capas:**
  - Presentación: React + Vite
  - Lógica de negocio: ASP.NET Core Controllers + Services
  - Acceso a datos: Entity Framework Core + Repositories
  - Motor externo: Stockfish
- [ ] **Diagrama de secuencia** para al menos 2 flujos importantes:
  - Ejemplo 1: Usuario juega un movimiento → Stockfish responde
  - Ejemplo 2: Usuario completa sesión → se calculan logros → se guarda XP

---

### 7. Documentación de la API

- [ ] **Swagger/OpenAPI** — generado automáticamente con .NET (añadir 4 líneas en `Program.cs`)
- [ ] O documentación manual de cada endpoint:
  - Método HTTP, URL, parámetros, body, respuesta, códigos de error
  - Ejemplos de petición y respuesta en JSON

---

### 8. Manual de Usuario

- [ ] Guía de instalación paso a paso
- [ ] Descripción de cada sección de la app con capturas de pantalla
- [ ] Explicación de los modos de entrenamiento
- [ ] FAQ / preguntas frecuentes

---

### 9. Manual Técnico / de Despliegue

- [ ] Requisitos del sistema
- [ ] Pasos de instalación en local
- [ ] Pasos de despliegue en producción
- [ ] Variables de entorno necesarias
- [ ] Cómo ejecutar las migraciones
- [ ] Cómo importar las partidas históricas

---

### 10. Pruebas

- [ ] **Plan de pruebas** — qué se va a probar y cómo
- [ ] **Pruebas unitarias** — al menos del backend (xUnit)
- [ ] **Pruebas de integración** — endpoints principales
- [ ] **Pruebas manuales** — tabla con caso, pasos, resultado esperado, resultado obtenido
- [ ] **Pruebas de usabilidad** — si alguien más ha probado la app

---

### 11. Control de Versiones

- [ ] Repositorio en GitHub con historial de commits limpio
- [ ] Commits con mensajes descriptivos (`feat:`, `fix:`, `docs:`, etc.)
- [ ] `.gitignore` correcto (sin `node_modules`, sin `.db`, sin `bin/obj`)
- [ ] README.md completo y bien formateado ✅ (ya lo tienes)

---

### 12. Presentación (si se requiere)

- [ ] Diapositivas con:
  - Qué es el proyecto y por qué
  - Arquitectura y tecnologías
  - Demo en vivo o vídeo
  - Dificultades encontradas
  - Trabajo futuro
- [ ] Demo preparada con datos de ejemplo (usuario de prueba, partidas cargadas)

---

## 📊 Estado general

| Área | Estado |
|------|--------|
| Funcionalidades de la app | ✅ ~97% completado |
| Nuevos modos de entrenamiento | ⬜ Pendiente |
| Variables de entorno | ⬜ Pendiente |
| Despliegue | ⬜ Pendiente |
| Memoria del proyecto | ⬜ Pendiente |
| Requisitos funcionales/no funcionales | ⬜ Pendiente |
| Casos de uso | ⬜ Pendiente |
| Diagramas (ER, arquitectura, secuencia) | ⬜ Pendiente |
| Documentación API (Swagger) | ⬜ Pendiente |
| Tests | ⬜ Pendiente |
| Manual de usuario | ⬜ Pendiente |
| Control de versiones limpio | 🟡 Parcial |

---

## 🗓️ Orden recomendado de trabajo

1. **Commit de la versión actual** — guardar todo lo que funciona
2. **Swagger** — 4 líneas de código, documentación de API gratis
3. **Variables de entorno** — desbloquea el despliegue
4. **Despliegue** — Vercel + Railway/Render
5. **Casos de uso y diagramas** — documentación para la asignatura
6. **Memoria del proyecto** — redactar con lo que ya tienes
7. **Nuevos modos de entrenamiento** — flashcards, visualización, estructuras
8. **Tests** — al menos los básicos del backend
9. **Responsive** — si da tiempo
