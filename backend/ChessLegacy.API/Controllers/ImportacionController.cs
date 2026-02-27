using Microsoft.AspNetCore.Mvc;
using ChessLegacy.API.Services;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportacionController : ControllerBase
{
    private readonly PgnImporterAdvanced _importer;

    public ImportacionController(PgnImporterAdvanced importer)
    {
        _importer = importer;
    }

    [HttpPost("importar-pgn")]
    public async Task<IActionResult> ImportarPgn([FromBody] ImportarPgnRequest request)
    {
        try
        {
            var rutaCompleta = Path.Combine("pgn-data", request.NombreArchivo);
            
            if (!System.IO.File.Exists(rutaCompleta))
                return NotFound($"Archivo {request.NombreArchivo} no encontrado");

            var importadas = await _importer.ImportarPgnCompleto(
                rutaCompleta, 
                request.JugadorId, 
                request.Limite ?? 100
            );

            return Ok(new { 
                mensaje = $"Se importaron {importadas} partidas exitosamente",
                partidasImportadas = importadas
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public class ImportarPgnRequest
{
    public int JugadorId { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public int? Limite { get; set; }
}
