FROM mcr.microsoft.com/dotnet/sdk:10.0
WORKDIR /app

# Instalar Stockfish
RUN apt-get update && apt-get install -y stockfish && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app/stockfish && ln -s /usr/games/stockfish /app/stockfish/stockfish

# Restaurar dependencias
COPY backend/ChessLegacy.API/ChessLegacy.API.csproj ./
RUN dotnet restore

# Copiar código fuente
COPY backend/ChessLegacy.API/ ./

# Publicar
RUN dotnet publish -c Release -o /app/out

# Copiar PGN al directorio de publicación
RUN cp -r /app/Scripts /app/out/Scripts 2>/dev/null || true

WORKDIR /app/out

EXPOSE 8080
ENV PORT=8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ChessLegacy.API.dll"]
