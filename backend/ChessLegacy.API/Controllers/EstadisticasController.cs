using ChessLegacy.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstadisticasController : ControllerBase
{
    private readonly ChessLegacyContext _context;

    public EstadisticasController(ChessLegacyContext context)
    {
        _context = context;
    }

    [HttpGet("jugador/{jugadorId}")]
    public async Task<ActionResult> GetEstadisticasJugador(int jugadorId)
    {
        var partidas = await _context.Partidas
            .Where(p => p.JugadorId == jugadorId)
            .ToListAsync();

        var totalPartidas = partidas.Count;
        
        // Aperturas más usadas
        var aperturasTop = partidas
            .Where(p => !string.IsNullOrEmpty(p.AperturaNombre))
            .GroupBy(p => p.AperturaNombre)
            .Select(g => new { Apertura = g.Key, Cantidad = g.Count() })
            .OrderByDescending(x => x.Cantidad)
            .Take(10)
            .ToList();

        // Oponentes más frecuentes
        var oponentesTop = partidas
            .GroupBy(p => p.Oponente)
            .Select(g => new { Oponente = g.Key, Cantidad = g.Count() })
            .OrderByDescending(x => x.Cantidad)
            .Take(10)
            .ToList();

        // Evolución por año
        var evolucionAnual = partidas
            .Where(p => p.Anio > 0)
            .GroupBy(p => p.Anio)
            .Select(g => new { Anio = g.Key, Cantidad = g.Count() })
            .OrderBy(x => x.Anio)
            .ToList();

        // Distribución de colores
        var porBlancas = partidas.Count(p => p.ColorJugador == "Blancas");
        var porNegras = partidas.Count(p => p.ColorJugador == "Negras");

        // Variantes más usadas por apertura
        var variantesPorApertura = partidas
            .Where(p => !string.IsNullOrEmpty(p.AperturaNombre) && !string.IsNullOrEmpty(p.VarianteNombre))
            .GroupBy(p => new { p.AperturaNombre, p.VarianteNombre })
            .Select(g => new { 
                Apertura = g.Key.AperturaNombre, 
                Variante = g.Key.VarianteNombre, 
                Cantidad = g.Count() 
            })
            .OrderByDescending(x => x.Cantidad)
            .Take(15)
            .ToList();

        return Ok(new
        {
            totalPartidas,
            aperturasTop,
            oponentesTop,
            evolucionAnual,
            distribucionColores = new { blancas = porBlancas, negras = porNegras },
            variantesPorApertura
        });
    }

    [HttpGet("comparativa")]
    public async Task<ActionResult> GetComparativa()
    {
        var jugadores = await _context.Jugadores.ToListAsync();
        var comparativa = new List<object>();

        foreach (var jugador in jugadores)
        {
            var totalPartidas = await _context.Partidas.CountAsync(p => p.JugadorId == jugador.Id);
            var aperturaFavorita = await _context.Partidas
                .Where(p => p.JugadorId == jugador.Id && !string.IsNullOrEmpty(p.AperturaNombre))
                .GroupBy(p => p.AperturaNombre)
                .Select(g => new { Apertura = g.Key, Cantidad = g.Count() })
                .OrderByDescending(x => x.Cantidad)
                .FirstOrDefaultAsync();

            comparativa.Add(new
            {
                jugador = jugador.Nombre,
                totalPartidas,
                aperturaFavorita = aperturaFavorita?.Apertura ?? "N/A",
                cantidadAperturaFavorita = aperturaFavorita?.Cantidad ?? 0
            });
        }

        return Ok(comparativa);
    }
}
