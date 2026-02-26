using ChessLegacy.API.Models;
using ChessLegacy.API.Repositories;
using ChessLegacy.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using ChessLegacy.API.Data;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JugadoresController : ControllerBase
{
    private readonly JugadorRepository _repository;
    private readonly ChessLegacyContext _context;

    public JugadoresController(JugadorRepository repository, ChessLegacyContext context)
    {
        _repository = repository;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Jugador>>> GetAll() => 
        await _repository.GetAllAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Jugador>> GetById(int id)
    {
        var jugador = await _repository.GetByIdAsync(id);
        return jugador == null ? NotFound() : Ok(jugador);
    }

    [HttpGet("{id}/posiciones")]
    public async Task<ActionResult<List<Posicion>>> GetPosiciones(int id, [FromServices] PosicionRepository posicionRepo)
    {
        var jugador = await _repository.GetByIdAsync(id);
        if (jugador == null) return NotFound();
        return await posicionRepo.GetByJugadorIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<Jugador>> Create(Jugador jugador)
    {
        var created = await _repository.CreateAsync(jugador);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id}/aperturas")]
    public async Task<ActionResult<List<AperturaDTO>>> GetAperturas(int id)
    {
        var aperturas = await _context.Partidas
            .Where(p => p.JugadorId == id && !string.IsNullOrEmpty(p.CodigoECO))
            .GroupBy(p => p.CodigoECO)
            .Select(g => new AperturaDTO
            {
                CodigoECO = g.Key,
                NombreApertura = ObtenerNombreApertura(g.Key),
                CantidadPartidas = g.Count()
            })
            .OrderByDescending(a => a.CantidadPartidas)
            .ToListAsync();

        return Ok(aperturas);
    }

    [HttpGet("{id}/partidas/{codigoECO}")]
    public async Task<ActionResult<object>> GetPartidasPorApertura(int id, string codigoECO, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Partidas
            .Where(p => p.JugadorId == id && p.CodigoECO == codigoECO);

        var total = await query.CountAsync();
        var partidas = await query
            .OrderBy(p => p.Anio)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            partidas,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    private string ObtenerNombreApertura(string eco)
    {
        return eco[0] switch
        {
            'A' => "Aperturas de Flanco",
            'B' => "Defensas Semiabiertas",
            'C' => "Aperturas Abiertas",
            'D' => "Gambito de Dama",
            'E' => "Defensas Indias",
            _ => "Otra Apertura"
        };
    }
}
