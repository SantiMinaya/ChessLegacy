using ChessLegacy.API.DTOs;
using ChessLegacy.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartidasController : ControllerBase
{
    private readonly PartidaRepository _repository;

    public PartidasController(PartidaRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult> GetPartidas([FromQuery] PartidaFiltrosRequest filtros)
    {
        var (partidas, total) = await _repository.GetPartidasConFiltros(filtros);
        
        var response = partidas.Select(p => new PartidaResponse
        {
            Id = p.Id,
            Evento = p.Evento,
            Sitio = "",
            Anio = p.Anio,
            Oponente = p.Oponente,
            Resultado = p.Resultado ?? "",
            CodigoECO = p.CodigoECO,
            NombreApertura = p.AperturaNombre ?? "",
            Pgn = p.PGN,
            ColorJugador = p.ColorJugador ?? "Blancas"
        }).ToList();

        return Ok(new
        {
            partidas = response,
            total,
            page = filtros.Page,
            pageSize = filtros.PageSize,
            totalPages = (int)Math.Ceiling(total / (double)filtros.PageSize)
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetPartida(int id)
    {
        var partida = await _repository.GetByIdAsync(id);
        if (partida == null) return NotFound();

        return Ok(new PartidaResponse
        {
            Id = partida.Id,
            Evento = partida.Evento,
            Sitio = "",
            Anio = partida.Anio,
            Oponente = partida.Oponente,
            Resultado = partida.Resultado ?? "",
            CodigoECO = partida.CodigoECO,
            NombreApertura = partida.AperturaNombre ?? "",
            Pgn = partida.PGN,
            ColorJugador = partida.ColorJugador ?? "Blancas"
        });
    }

    [HttpGet("buscar-por-pgn")]
    public async Task<ActionResult> BuscarPorPgn([FromQuery] int jugadorId, [FromQuery] string pgnStart)
    {
        var partida = await _repository.BuscarPorPgnStart(jugadorId, pgnStart);
        if (partida == null) return NotFound();

        return Ok(new PartidaResponse
        {
            Id = partida.Id,
            Evento = partida.Evento,
            Sitio = "",
            Anio = partida.Anio,
            Oponente = partida.Oponente,
            Resultado = partida.Resultado ?? "",
            CodigoECO = partida.CodigoECO,
            NombreApertura = partida.AperturaNombre ?? "",
            Pgn = partida.PGN,
            ColorJugador = partida.ColorJugador ?? "Blancas"
        });
    }

    [HttpGet("eventos")]
    public async Task<ActionResult> GetEventos([FromQuery] int? jugadorId)
    {
        var eventos = await _repository.GetEventosDistintos(jugadorId);
        return Ok(eventos);
    }

    [HttpGet("aperturas")]
    public async Task<ActionResult> GetAperturas([FromQuery] int? jugadorId)
    {
        var aperturas = await _repository.GetAperturasDistintas(jugadorId);
        return Ok(aperturas);
    }
}
