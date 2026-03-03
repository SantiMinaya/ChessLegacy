# 🚀 Guía de Configuración Rápida

## Para Desarrolladores Nuevos

### 1. Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado:

- [ ] **Node.js 18+** - [Descargar](https://nodejs.org/)
- [ ] **.NET SDK 8.0+** - [Descargar](https://dotnet.microsoft.com/download)
- [ ] **Git** - [Descargar](https://git-scm.com/)
- [ ] **Editor de código** (VS Code recomendado)

### 2. Verificar Instalaciones

```bash
# Verificar Node.js
node --version  # Debe ser v18 o superior

# Verificar npm
npm --version

# Verificar .NET
dotnet --version  # Debe ser 8.0 o superior

# Verificar Git
git --version
```

### 3. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/chess-legacy.git
cd chess-legacy

# Configurar Backend
cd backend/ChessLegacy.API
dotnet restore
dotnet ef database update

# Configurar Frontend
cd ../../frontend/chess-legacy-ui
npm install
```

### 4. Descargar Stockfish

**Windows:**
1. Descargar desde: https://stockfishchess.org/download/
2. Extraer `stockfish.exe`
3. Colocar en: `backend/ChessLegacy.API/stockfish/stockfish.exe`

**Linux/Mac:**
```bash
# Instalar via package manager
sudo apt install stockfish  # Ubuntu/Debian
brew install stockfish      # macOS
```

### 5. Preparar Datos (Opcional)

Si quieres importar partidas históricas:

1. Descargar archivos PGN de:
   - https://www.pgnmentor.com/files.html
   - https://www.chessgames.com/

2. Colocar en: `backend/ChessLegacy.API/Scripts/pgn_files/`
   - `tal.pgn`
   - `capablanca.pgn`
   - `kasparov.pgn`
   - `fischer.pgn`
   - `karpov.pgn`
   - `alekhine.pgn`
   - `petrosian.pgn`
   - `carlsen.pgn`

3. Importar:
```bash
curl -X POST http://localhost:5000/api/import/importar-todos
```

### 6. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend/ChessLegacy.API
dotnet run
```
Espera a ver: `Now listening on: http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend/chess-legacy-ui
npm run dev
```
Abre: `http://localhost:5173`

### 7. Verificar que Funciona

1. ✅ Deberías ver la galería de 8 maestros
2. ✅ Click en un maestro → Ver su perfil
3. ✅ Click en "Jugar Contra [Maestro]" → Tablero funcional
4. ✅ Click en "Ver Partidas" → Lista de partidas (si importaste)

## 🐛 Problemas Comunes

### Error: "Cannot find module"
```bash
cd frontend/chess-legacy-ui
rm -rf node_modules package-lock.json
npm install
```

### Error: "Database not found"
```bash
cd backend/ChessLegacy.API
dotnet ef database update --context ChessLegacyContext
```

### Error: "Stockfish not found"
- Verifica que `stockfish.exe` existe en `backend/ChessLegacy.API/stockfish/`
- Verifica permisos de ejecución

### Puerto 5000 ocupado
Edita `backend/ChessLegacy.API/Properties/launchSettings.json`:
```json
"applicationUrl": "http://localhost:5001"
```

Y actualiza `frontend/chess-legacy-ui/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5001';
```

## 📝 Estructura de Archivos Importantes

```
chess-legacy/
├── backend/ChessLegacy.API/
│   ├── appsettings.json          # Configuración
│   ├── ChessLegacy.db            # Base de datos SQLite
│   ├── stockfish/
│   │   └── stockfish.exe         # Motor de ajedrez
│   └── Scripts/pgn_files/        # Archivos PGN
│
├── frontend/chess-legacy-ui/
│   ├── src/
│   │   ├── services/api.js       # Configuración API
│   │   ├── data/masters.js       # Datos de maestros
│   │   └── data/masterStyles.js  # Estilos de juego
│   └── public/images/masters/    # Fotos de maestros
│
├── README.md                      # Documentación principal
├── ROADMAP.md                     # Plan de desarrollo
└── SETUP.md                       # Esta guía
```

## 🎯 Próximos Pasos

1. Lee el [README.md](README.md) completo
2. Revisa el [ROADMAP.md](ROADMAP.md) para ver features pendientes
3. Explora el código en `src/components/` y `Controllers/`
4. ¡Empieza a desarrollar!

## 💡 Tips para Desarrollo

- **Hot Reload**: Ambos (frontend y backend) tienen hot reload automático
- **Debug Backend**: Usa VS Code o Visual Studio con breakpoints
- **Debug Frontend**: Usa React DevTools en el navegador
- **Base de datos**: Usa DB Browser for SQLite para ver los datos

## 📚 Recursos Útiles

- [React Docs](https://react.dev/)
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [Chess.js Docs](https://github.com/jhlywa/chess.js)
- [Stockfish Docs](https://stockfishchess.org/)

---

¿Problemas? Abre un issue en GitHub o contacta al equipo.
