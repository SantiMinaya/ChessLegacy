using ChessLegacy.API.Data;
using ChessLegacy.API.DTOs;
using ChessLegacy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Repositories;

public class PartidaRepository
{
    private readonly ChessLegacyContext _context;

    public PartidaRepository(ChessLegacyContext context)
    {
        _context = context;
    }

    public async Task<(List<Partida>, int)> GetPartidasConFiltros(PartidaFiltrosRequest filtros)
    {
        var query = _context.Partidas.AsQueryable();

        if (filtros.JugadorId.HasValue)
            query = query.Where(p => p.JugadorId == filtros.JugadorId.Value);

        if (!string.IsNullOrEmpty(filtros.CodigoECO))
            query = query.Where(p => p.CodigoECO.StartsWith(filtros.CodigoECO));

        if (!string.IsNullOrEmpty(filtros.NombreApertura))
            query = query.Where(p => p.AperturaNombre != null && p.AperturaNombre.Contains(filtros.NombreApertura));

        if (!string.IsNullOrEmpty(filtros.Variante))
            query = query.Where(p => p.VarianteNombre != null && p.VarianteNombre.Contains(filtros.Variante));

        if (!string.IsNullOrEmpty(filtros.Evento))
            query = query.Where(p => p.Evento.Contains(filtros.Evento));

        if (filtros.AnioDesde.HasValue)
            query = query.Where(p => p.Anio >= filtros.AnioDesde.Value);

        if (filtros.AnioHasta.HasValue)
            query = query.Where(p => p.Anio <= filtros.AnioHasta.Value);

        if (!string.IsNullOrEmpty(filtros.Resultado))
            query = query.Where(p => p.Resultado == filtros.Resultado);

        var total = await query.CountAsync();

        var partidas = await query
            .OrderByDescending(p => p.Anio)
            .Skip((filtros.Page - 1) * filtros.PageSize)
            .Take(filtros.PageSize)
            .ToListAsync();

        return (partidas, total);
    }

    public async Task<Partida?> GetByIdAsync(int id)
    {
        return await _context.Partidas.FindAsync(id);
    }

    public async Task<List<string>> GetEventosDistintos(int? jugadorId)
    {
        var query = _context.Partidas.AsQueryable();
        
        if (jugadorId.HasValue)
            query = query.Where(p => p.JugadorId == jugadorId.Value);

        return await query
            .Select(p => p.Evento)
            .Distinct()
            .OrderBy(e => e)
            .ToListAsync();
    }

    public async Task<List<object>> GetAperturasDistintas(int? jugadorId)
    {
        var query = _context.Partidas.AsQueryable();
        
        if (jugadorId.HasValue)
            query = query.Where(p => p.JugadorId == jugadorId.Value);

        return await query
            .GroupBy(p => new { p.CodigoECO, p.AperturaNombre })
            .Select(g => new
            {
                codigoECO = g.Key.CodigoECO,
                nombreApertura = g.Key.AperturaNombre,
                cantidad = g.Count()
            })
            .OrderBy(a => a.codigoECO)
            .Cast<object>()
            .ToListAsync();
    }
}
