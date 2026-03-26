# 🚀 Guía de Despliegue — Chess Legacy

> Cómo subir Chess Legacy a internet gratis usando **Vercel** (frontend) + **Render** (backend).
> Sin tarjeta de crédito. Sin coste.

---

## Resumen

```
Tu código (GitHub)
       ↓
Frontend → Vercel   → chess-legacy.vercel.app
Backend  → Render   → chess-legacy-api.onrender.com
Base de datos → Render PostgreSQL
```

---

## Antes de empezar — Cambios en el código

Hay **6 cambios** que hacer antes de subir nada. Hazlos en orden.

---

### Cambio 1 — Variable de entorno en el frontend

Abre `frontend/chess-legacy-ui/src/services/api.js` y cambia la primera línea:

```javascript
// ANTES
const API_URL = 'http://localhost:5000/api';

// DESPUÉS
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

Crea el archivo `frontend/chess-legacy-ui/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Crea el archivo `frontend/chess-legacy-ui/.env.production`:
```
VITE_API_URL=https://TU-BACKEND.onrender.com/api
```
> ⚠️ La URL del backend la tendrás después de crear el servicio en Render. Vuelve aquí a actualizarla.

---

### Cambio 2 — Instalar PostgreSQL en el backend

Abre una terminal en `backend/ChessLegacy.API` y ejecuta:

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

---

### Cambio 3 — Cambiar SQLite por PostgreSQL en Program.cs

Abre `backend/ChessLegacy.API/Program.cs` y busca la línea que dice `UseSqlite`. Reemplázala:

```csharp
// ANTES
builder.Services.AddDbContext<ChessLegacyContext>(options =>
    options.UseSqlite(connectionString));

// DESPUÉS
var dbUrl = Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ChessLegacyContext>(options =>
    options.UseNpgsql(dbUrl));
```

---

### Cambio 4 — Puerto dinámico

Render asigna el puerto por variable de entorno. En `Program.cs` añade al principio:

```csharp
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
```

---

### Cambio 5 — CORS para Vercel

En `Program.cs` busca donde configuras CORS y añade el dominio de Vercel:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://chess-legacy.vercel.app",      // tu dominio de Vercel
            "https://TU-PROYECTO.vercel.app"         // por si cambia
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

---

### Cambio 6 — Stockfish para Linux

Descarga el binario de Stockfish para Linux desde https://stockfishchess.org/download/ y colócalo en:
```
backend/ChessLegacy.API/stockfish/stockfish-linux
```

Abre `backend/ChessLegacy.API/Engine/StockfishEngine.cs` y cambia la ruta del ejecutable:

```csharp
using System.Runtime.InteropServices;

// ANTES
var stockfishPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "stockfish", "stockfish.exe");

// DESPUÉS
var isLinux = RuntimeInformation.IsOSPlatform(OSPlatform.Linux);
var stockfishFile = isLinux ? "stockfish-linux" : "stockfish.exe";
var stockfishPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "stockfish", stockfishFile);
```

---

### Cambio 7 — Dockerfile

Crea el archivo `backend/ChessLegacy.API/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app
COPY . .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .
COPY stockfish/stockfish-linux ./stockfish/stockfish-linux
RUN chmod +x ./stockfish/stockfish-linux
EXPOSE 8080
ENTRYPOINT ["dotnet", "ChessLegacy.API.dll"]
```

---

### Cambio 8 — .gitignore

Asegúrate de que `.gitignore` en la raíz incluye:

```
# Base de datos local
*.db
*.db-shm
*.db-wal

# Build
bin/
obj/
out/

# Node
node_modules/
dist/

# Entorno
.env.local
```

---

### Commit de todos los cambios

```bash
git add .
git commit -m "feat: preparar para despliegue en Render + Vercel"
git push origin main
```

---

## Parte 1 — Base de datos en Render

### Paso 1
Ve a [render.com](https://render.com) y regístrate con tu cuenta de GitHub.

### Paso 2
En el dashboard pulsa **"New +"** → **"PostgreSQL"**

### Paso 3
Rellena:
- **Name:** `chess-legacy-db`
- **Region:** Frankfurt (EU) o la más cercana
- **Plan:** Free

Pulsa **"Create Database"**

### Paso 4
Espera 1-2 minutos. Cuando esté lista, ve a la sección **"Connections"** y copia la **"Internal Database URL"**. Tiene este formato:
```
postgresql://usuario:contraseña@host/chess_legacy_db
```
**Guárdala**, la necesitarás en el siguiente paso.

---

## Parte 2 — Backend en Render

### Paso 1
En el dashboard de Render pulsa **"New +"** → **"Web Service"**

### Paso 2
Selecciona **"Build and deploy from a Git repository"** → conecta tu cuenta de GitHub → selecciona el repo `chess-legacy`.

### Paso 3
Rellena la configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `chess-legacy-api` |
| **Region** | Frankfurt (EU) |
| **Branch** | `main` |
| **Root Directory** | `backend/ChessLegacy.API` |
| **Runtime** | Docker |
| **Plan** | Free |

### Paso 4
Baja hasta **"Environment Variables"** y añade estas variables:

| Clave | Valor |
|-------|-------|
| `DATABASE_URL` | La URL de PostgreSQL del paso anterior |
| `JWT_SECRET` | Una cadena larga y aleatoria, ej: `chess-legacy-super-secret-key-2024-xyz` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

### Paso 5
Pulsa **"Create Web Service"**.

Render tardará **5-10 minutos** en construir y desplegar. Puedes ver los logs en tiempo real.

### Paso 6
Cuando termine, Render te dará una URL del tipo:
```
https://chess-legacy-api.onrender.com
```
**Cópiala**. La necesitas para el frontend.

### Paso 7 — Ejecutar las migraciones
Las migraciones se ejecutan automáticamente al arrancar si tienes esto en `Program.cs`:
```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ChessLegacyContext>();
    db.Database.Migrate();
}
```
Si no lo tienes, añádelo antes de `app.Run()`.

---

## Parte 3 — Frontend en Vercel

### Paso 1
Ve a [vercel.com](https://vercel.com) y regístrate con tu cuenta de GitHub. Es gratis, sin tarjeta.

### Paso 2
Pulsa **"Add New Project"** → selecciona el repo `chess-legacy`.

### Paso 3
Vercel detecta automáticamente que es un proyecto Vite. Configura:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend/chess-legacy-ui` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Paso 4
Baja hasta **"Environment Variables"** y añade:

| Clave | Valor |
|-------|-------|
| `VITE_API_URL` | `https://chess-legacy-api.onrender.com/api` |

> Usa la URL de Render del paso anterior.

### Paso 5
Pulsa **"Deploy"**.

Vercel tardará **1-2 minutos**. Cuando termine te dará una URL del tipo:
```
https://chess-legacy.vercel.app
```

---

## Parte 4 — Conectar todo

### Actualizar CORS en el backend
Ahora que tienes la URL de Vercel, vuelve al `Program.cs` y asegúrate de que está en la lista de CORS:

```csharp
policy.WithOrigins(
    "http://localhost:5173",
    "https://chess-legacy.vercel.app"  // ← tu URL real de Vercel
)
```

Haz commit y push. Render redesplegará automáticamente.

### Actualizar .env.production en el frontend
Actualiza `frontend/chess-legacy-ui/.env.production` con la URL real de Render:
```
VITE_API_URL=https://chess-legacy-api.onrender.com/api
```

Haz commit y push. Vercel redesplegará automáticamente.

---

## Parte 5 — Evitar el sueño de Render

El plan gratuito de Render "duerme" el servicio tras 15 minutos de inactividad. La primera petición después tarda 30-60 segundos.

**Solución: UptimeRobot (gratis)**

1. Ve a [uptimerobot.com](https://uptimerobot.com) y regístrate (gratis, sin tarjeta)
2. Pulsa **"Add New Monitor"**
3. Configura:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Chess Legacy API
   - **URL:** `https://chess-legacy-api.onrender.com/api/jugadores`
   - **Monitoring Interval:** Every 5 minutes
4. Pulsa **"Create Monitor"**

UptimeRobot hará una petición cada 5 minutos, manteniendo el backend despierto.

---

## Verificar que todo funciona

Abre tu URL de Vercel y comprueba:

- [ ] La página carga correctamente
- [ ] Puedes registrar un usuario nuevo
- [ ] Puedes iniciar sesión
- [ ] Las partidas históricas cargan en el visor
- [ ] Las aperturas aparecen en el selector
- [ ] Puedes jugar contra un maestro
- [ ] El perfil muestra los datos correctamente

---

## Si Stockfish no funciona en Render

Si el juego contra maestros falla o va muy lento, es probable que Stockfish no funcione bien en el plan gratuito de Render (poca CPU/RAM).

**Solución rápida:** comentar la llamada a Stockfish en `StockfishEngine.cs` y devolver un movimiento aleatorio legal:

```csharp
public async Task<(string bestMove, int evaluation)> AnalyzePosition(string fen, string? maestro = null, int profundidad = 20)
{
    // Temporal: movimiento aleatorio si Stockfish no está disponible
    return await Task.FromResult(("e2e4", 0));
}
```

Esto mantiene todo funcionando excepto la evaluación real.

---

## Actualizaciones futuras

Cada vez que hagas cambios y los subas a GitHub:

- **Vercel** redesplega automáticamente en 1-2 minutos
- **Render** redesplega automáticamente en 5-10 minutos

No tienes que hacer nada manualmente.

---

## Resumen de URLs

| Servicio | URL |
|----------|-----|
| Frontend | `https://chess-legacy.vercel.app` |
| Backend API | `https://chess-legacy-api.onrender.com` |
| Base de datos | Interna en Render (no pública) |

---

## Coste total

| Servicio | Plan | Coste |
|----------|------|-------|
| Vercel | Hobby (gratis) | **0€** |
| Render Web Service | Free | **0€** |
| Render PostgreSQL | Free | **0€** |
| UptimeRobot | Free | **0€** |
| **Total** | | **0€** |

---

> 💡 **Si algo falla**, el error más probable está en los logs de Render.
> Ve a tu servicio → pestaña **"Logs"** y busca el error.
