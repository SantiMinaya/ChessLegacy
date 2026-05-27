# 🐳 Guía de Docker — Chess Legacy

Esta guía documenta la arquitectura de contenedores de **Chess Legacy** y cómo ponerla en marcha de forma inmediata para tu práctica universitaria utilizando **Docker** y **Docker Compose**.

---

## 🏗️ Arquitectura de Contenedores

La aplicación se compone de **dos servicios principal** que se ejecutan de forma independiente y aislada, pero interconectados en la misma red interna:

```
                  ┌──────────────────────────────┐
                  │      Navegador Web           │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────┴───────────────┐
                  │      Vite / React (Puerto 80)│
                  │      Servido por Nginx       │
                  └──────────────┬───────────────┘
                                 │ (Llamadas API REST)
                  ┌──────────────┴───────────────┐
                  │   ASP.NET Core (Puerto 5000) │
                  │   Engine: Stockfish Linux    │
                  │   DB: SQLite (Persistente)   │
                  └──────────────────────────────┘
```

1.  **`chess-legacy-backend` (ASP.NET Core 10.0 + Stockfish)**:
    *   Ejecuta el servidor web de C# en modo `Production`.
    *   **Stockfish Integrado:** Descarga e instala automáticamente el binario nativo de **Stockfish para Linux** mediante `apt-get` en la construcción de la imagen, garantizando que el análisis táctico funcione al 100% de forma nativa en cualquier sistema operativo host.
    *   **Persistencia (SQLite):** Mapea de forma bidireccional tu base de datos local `chesslegacy.db` para que no pierdas tus usuarios creados, progreso, XP ni tus **40,509 partidas importadas**.
2.  **`chess-legacy-frontend` (React + Vite + Nginx)**:
    *   Construye los recursos estáticos de React de forma optimizada.
    *   **Nginx Reversible:** Servido a través de un servidor ligero Nginx con soporte para Single Page Application (SPA), previniendo los errores 404 al refrescar rutas del navegador.

---

## 🚀 Cómo Iniciar la Aplicación

Para construir las imágenes e iniciar ambos contenedores con un único comando, abre tu terminal en la raíz del proyecto y ejecuta:

```bash
docker compose up --build
```

Una vez que termine la construcción e inicialización, podrás acceder a la aplicación inmediatamente desde tu navegador:

🔗 **Frontend (Interfaz de usuario):** [http://localhost](http://localhost)  
🔗 **Backend (Salud del API):** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🛠️ Comandos Útiles

### Detener los Contenedores
Para detener y apagar de forma limpia todos los servicios:
```bash
docker compose down
```

### Ver Logs en Tiempo Real
Si deseas auditar qué está sucediendo en el API o en Nginx en tiempo real:
```bash
docker compose logs -f
```

### Ejecutar en Segundo Plano (Modo Detached)
Si prefieres liberar tu consola y ejecutar la app en segundo plano:
```bash
docker compose up -d
```
