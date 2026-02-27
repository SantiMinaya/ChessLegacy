# Script para descargar partidas PGN de grandes maestros
# Fuente: pgnmentor.com (base de datos gratuita con miles de partidas históricas)

$maestros = @{
    "Tal" = "https://www.pgnmentor.com/players/Tal.zip"
    "Capablanca" = "https://www.pgnmentor.com/players/Capablanca.zip"
    "Kasparov" = "https://www.pgnmentor.com/players/Kasparov.zip"
    "Fischer" = "https://www.pgnmentor.com/players/Fischer.zip"
    "Karpov" = "https://www.pgnmentor.com/players/Karpov.zip"
    "Alekhine" = "https://www.pgnmentor.com/players/Alekhine.zip"
    "Petrosian" = "https://www.pgnmentor.com/players/Petrosian.zip"
    "Spassky" = "https://www.pgnmentor.com/players/Spassky.zip"
    "Botvinnik" = "https://www.pgnmentor.com/players/Botvinnik.zip"
    "Smyslov" = "https://www.pgnmentor.com/players/Smyslov.zip"
    "Lasker" = "https://www.pgnmentor.com/players/Lasker.zip"
    "Steinitz" = "https://www.pgnmentor.com/players/Steinitz.zip"
    "Morphy" = "https://www.pgnmentor.com/players/Morphy.zip"
    "Anand" = "https://www.pgnmentor.com/players/Anand.zip"
    "Kramnik" = "https://www.pgnmentor.com/players/Kramnik.zip"
    "Carlsen" = "https://www.pgnmentor.com/players/Carlsen.zip"
    "Bronstein" = "https://www.pgnmentor.com/players/Bronstein.zip"
    "Nimzowitsch" = "https://www.pgnmentor.com/players/Nimzowitsch.zip"
    "Rubinstein" = "https://www.pgnmentor.com/players/Rubinstein.zip"
    "Tarrasch" = "https://www.pgnmentor.com/players/Tarrasch.zip"
}

New-Item -ItemType Directory -Force -Path "pgn_files" | Out-Null

foreach ($maestro in $maestros.Keys) {
    $url = $maestros[$maestro]
    $output = "pgn_files\$maestro.zip"
    
    Write-Host "Descargando partidas de $maestro..." -ForegroundColor Cyan
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "✓ $maestro descargado" -ForegroundColor Green
        
        # Descomprimir
        Expand-Archive -Path $output -DestinationPath "pgn_files\$maestro" -Force
        Write-Host "✓ $maestro descomprimido" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Error con $maestro : $_" -ForegroundColor Red
    }
}

Write-Host "`nArchivos PGN listos en pgn_files/" -ForegroundColor Yellow
Write-Host "Usa el endpoint POST /api/import/pgn para importarlos a la base de datos" -ForegroundColor Yellow
