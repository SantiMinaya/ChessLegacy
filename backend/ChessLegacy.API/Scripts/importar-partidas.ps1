Write-Host "🚀 Iniciando importación de partidas PGN..." -ForegroundColor Cyan

# Parámetro: cantidad de partidas por maestro (default: 0 = todas)
param(
    [int]$Limite = 0
)

$apiUrl = "http://localhost:5000/api/import/importar-todos?limite=$Limite"

if ($Limite -eq 0) {
    Write-Host "📊 Importando TODAS las partidas disponibles..." -ForegroundColor Yellow
} else {
    Write-Host "📊 Importando hasta $Limite partidas por maestro..." -ForegroundColor Yellow
}
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -ContentType "application/json"
    
    Write-Host "✅ $($response.mensaje)" -ForegroundColor Green
    Write-Host "📈 Total de partidas importadas: $($response.totalPartidas)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Detalle por maestro:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    
    foreach ($resultado in $response.resultados) {
        $color = if ($resultado.status -eq "Importado") { "Green" } else { "Red" }
        Write-Host "  $($resultado.maestro): $($resultado.status)" -ForegroundColor $color
        if ($resultado.partidas) {
            Write-Host "    → $($resultado.partidas) partidas" -ForegroundColor Gray
        }
        if ($resultado.error) {
            Write-Host "    → Error: $($resultado.error)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "🎉 Importación completada exitosamente!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al importar partidas:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Asegúrate de que el backend esté ejecutándose:" -ForegroundColor Yellow
    Write-Host "   cd backend\ChessLegacy.API" -ForegroundColor Gray
    Write-Host "   dotnet run" -ForegroundColor Gray
}
