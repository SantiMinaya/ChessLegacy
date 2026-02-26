using ChessLegacy.API.DTOs;
using ChessLegacy.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalisisController : ControllerBase
{
    private readonly AnalisisService _service;

    public AnalisisController(AnalisisService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<AnalisisResponse>> Analizar(AnalisisRequest request)
    {
        try
        {
            var resultado = await _service.AnalizarMovimiento(request);
            return Ok(resultado);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
