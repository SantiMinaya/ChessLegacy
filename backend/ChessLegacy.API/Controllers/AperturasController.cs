using ChessLegacy.API.Data;
using ChessLegacy.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AperturasController : ControllerBase
{
    private readonly ChessLegacyContext _db;
    public AperturasController(ChessLegacyContext db) => _db = db;

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

    [HttpGet("aprendizaje/random")]
    public ActionResult GetAprendizajeRandom()
    {
        var datos = AperturaDetectorExtendido.ObtenerRandomParaAprendizaje();
        if (datos == null) return NotFound();
        return Ok(datos);
    }

    [HttpGet("aprendizaje/random-espaciado")]
    [Authorize]
    public async Task<ActionResult> GetRandomEspaciado()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var progresos = await _db.Progresos
            .Where(p => p.UsuarioId == userId)
            .ToListAsync();

        var candidatos = AperturaDetectorExtendido.ObtenerTodosConVariante();

        // Asignar peso: más peso = más probabilidad de salir
        // Sin historial: peso 3 (nunca practicada)
        // Con historial: peso según tasa de error (más errores = más peso)
        var ponderados = new List<(object datos, int peso)>();
        foreach (var c in candidatos)
        {
            var prog = progresos.FirstOrDefault(p =>
                p.Apertura == c.apertura &&
                (p.Variante ?? "") == (c.variante ?? ""));

            int peso;
            if (prog == null || prog.Intentos == 0)
                peso = 3; // nunca practicada
            else
            {
                var precision = (double)prog.Aciertos / prog.Intentos;
                peso = precision >= 0.9 ? 1
                     : precision >= 0.7 ? 2
                     : precision >= 0.5 ? 4
                     : 6; // < 50% precisión = máxima prioridad
            }

            var datos = AperturaDetectorExtendido.ObtenerParaAprendizaje(c.apertura, c.variante);
            if (datos != null) ponderados.Add((datos, peso));
        }

        // Selección ponderada
        var total = ponderados.Sum(x => x.peso);
        var rnd = new Random().Next(total);
        int acum = 0;
        foreach (var (datos, peso) in ponderados)
        {
            acum += peso;
            if (rnd < acum) return Ok(datos);
        }

        return Ok(ponderados[0].datos);
    }
}
