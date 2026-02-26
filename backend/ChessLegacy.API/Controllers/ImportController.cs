using ChessLegacy.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportController : ControllerBase
{
    private readonly PgnImporter _importer;

    public ImportController(PgnImporter importer)
    {
        _importer = importer;
    }

    [HttpPost("pgn")]
    public async Task<ActionResult> ImportarPgn([FromForm] IFormFile archivo, [FromForm] int jugadorId)
    {
        try
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest(new { error = "Archivo vacío" });

            var tempPath = Path.GetTempFileName();
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await archivo.CopyToAsync(stream);
            }

            var importadas = await _importer.ImportarPgn(tempPath, jugadorId);
            
            if (System.IO.File.Exists(tempPath))
                System.IO.File.Delete(tempPath);
                
            return Ok(new { mensaje = $"{importadas} partidas importadas correctamente" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message, stack = ex.StackTrace });
        }
    }
}
