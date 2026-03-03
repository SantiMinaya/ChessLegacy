using ChessLegacy.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportController : ControllerBase
{
    private readonly SimplePgnImporter _importer;

    public ImportController(SimplePgnImporter importer)
    {
        _importer = importer;
    }

    [HttpGet("test")]
    public ActionResult Test()
    {
        return Ok(new { mensaje = "API funcionando correctamente" });
    }

    [HttpPost("importar-todos")]
    public async Task<ActionResult> ImportarTodos([FromQuery] int limite = 0)
    {
        var maestros = new Dictionary<string, int>
        {
            { "Tal", 1 },
            { "Capablanca", 2 },
            { "Kasparov", 3 },
            { "Fischer", 4 },
            { "Karpov", 5 },
            { "Alekhine", 6 },
            { "Petrosian", 7 },
            { "Carlsen", 8 }
        };

        var baseDir = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "pgn_files");
        var resultados = new List<object>();
        int totalImportadas = 0;

        foreach (var (nombre, jugadorId) in maestros)
        {
            var pgnPath = Path.Combine(baseDir, nombre, $"{nombre}.pgn");
            
            if (!System.IO.File.Exists(pgnPath))
            {
                resultados.Add(new { maestro = nombre, status = "No encontrado", archivo = pgnPath });
                continue;
            }

            try
            {
                var importadas = await _importer.ImportarPgn(pgnPath, jugadorId, limite);
                totalImportadas += importadas;
                resultados.Add(new { maestro = nombre, status = "Importado", partidas = importadas });
            }
            catch (Exception ex)
            {
                resultados.Add(new { maestro = nombre, status = "Error", error = ex.Message });
            }
        }

        return Ok(new { mensaje = "Importación completada", totalPartidas = totalImportadas, resultados });
    }
}
