# 📥 Importación de Partidas PGN

## Método 1: Usando PowerShell (Recomendado)

### Paso 1: Ejecutar el backend
```bash
cd backend\ChessLegacy.API
dotnet run
```

### Paso 2: En otra terminal, ejecutar el script de importación
```powershell
cd backend\ChessLegacy.API\Scripts
.\importar-partidas.ps1
```

Por defecto importa 50 partidas por maestro. Para cambiar el límite:
```powershell
.\importar-partidas.ps1 -Limite 100
```

## Método 2: Usando curl

Con el backend ejecutándose:
```bash
curl -X POST http://localhost:5000/api/import/importar-todos?limite=50
```

## Método 3: Desde el navegador

1. Ejecuta el backend: `dotnet run`
2. Abre: http://localhost:5000/api/import/importar-todos?limite=50

## Maestros incluidos

- Mikhail Tal (id: 1)
- José Raúl Capablanca (id: 2)
- Garry Kasparov (id: 3)
- Bobby Fischer (id: 4)
- Anatoly Karpov (id: 5)
- Alexander Alekhine (id: 6)
- Tigran Petrosian (id: 7)
- Magnus Carlsen (id: 8)

## Verificar importación

```bash
# Ver total de partidas
curl http://localhost:5000/api/partidas

# Ver partidas de un maestro específico
curl http://localhost:5000/api/partidas?jugadorId=1
```

## Notas

- La importación puede tardar varios minutos dependiendo del límite
- Se crean automáticamente las aperturas (ECO) si no existen
- Los movimientos se guardan en formato SAN
- El FEN se generará en una fase posterior
