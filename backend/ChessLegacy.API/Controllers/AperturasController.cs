using ChessLegacy.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AperturasController : ControllerBase
{
    [HttpGet]
    public ActionResult GetAperturas()
    {
        var aperturas = AperturaDetectorExtendido.ObtenerAperturas();
        return Ok(aperturas);
    }

    [HttpGet("{apertura}/variantes")]
    public ActionResult GetVariantes(string apertura)
    {
        var variantes = AperturaDetectorExtendido.ObtenerVariantes(apertura);
        return Ok(variantes);
    }

    [HttpGet("aprendizaje")]
    public ActionResult GetAprendizaje([FromQuery] string apertura, [FromQuery] string? variante)
    {
        var datos = AperturaDetectorExtendido.ObtenerParaAprendizaje(apertura, variante);
        if (datos == null) return NotFound();
        return Ok(datos);
    }
}
