Write-Host "📊 Verificando partidas importadas..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/partidas" -Method Get
    
    Write-Host "✅ Total de partidas en la base de datos: $($response.Count)" -ForegroundColor Green
    Write-Host ""
    
    # Agrupar por jugador
    $porJugador = $response | Group-Object -Property jugadorId
    
    Write-Host "Partidas por maestro:" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    
    foreach ($grupo in $porJugador | Sort-Object Name) {
        $jugadorId = $grupo.Name
        $count = $grupo.Count
        Write-Host "  Jugador ID $jugadorId : $count partidas" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "💡 Para ver detalles: http://localhost:5000/api/partidas" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Error al consultar partidas:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Asegúrate de que el backend esté ejecutándose" -ForegroundColor Yellow
}
