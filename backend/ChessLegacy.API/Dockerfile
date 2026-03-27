FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["ChessLegacy.API.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Instalar Stockfish desde apt
RUN apt-get update && apt-get install -y stockfish && rm -rf /var/lib/apt/lists/*

# Crear symlink para que la app lo encuentre en la ruta esperada
RUN mkdir -p /app/stockfish && ln -s /usr/games/stockfish /app/stockfish/stockfish

COPY --from=build /app/publish .

# Copiar archivos PGN
COPY Scripts ./Scripts

EXPOSE 8080
ENV PORT=8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ChessLegacy.API.dll"]
