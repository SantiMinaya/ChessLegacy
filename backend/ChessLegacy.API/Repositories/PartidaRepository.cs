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

        if (!string.IsNullOrEmpty(filtros.Oponente))
            query = query.Where(p => p.Oponente.Contains(filtros.Oponente));

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

    public async Task<Partida?> BuscarPorPgnStart(int jugadorId, string pgnStart)
    {
        var normalizado = NormalizarPgn(pgnStart);
        var candidatas = await _context.Partidas
            .Where(p => p.JugadorId == jugadorId)
            .ToListAsync();
        return candidatas.FirstOrDefault(p => NormalizarPgn(p.PGN).StartsWith(normalizado));
    }

    private static string NormalizarPgn(string pgn) =>
        System.Text.RegularExpressions.Regex.Replace(pgn, @"\s+", " ").Trim();

    public async Task<Partida?> GetByIdAsync(int id) =>
        await _context.Partidas.FindAsync(id);

    public async Task<int> CountAsync() =>
        await _context.Partidas.CountAsync();

    public async Task<Partida?> GetByOffsetAsync(int offset) =>
        await _context.Partidas.OrderBy(p => p.Id).Skip(offset).FirstOrDefaultAsync();

    public async Task<List<Partida>> BuscarPorFen(string fen)
    {
        // Buscamos partidas cuyo PGN contenga posiciones que lleguen al FEN dado
        // Como SQLite no tiene funciones de ajedrez, buscamos por movimientos parciales
        // Estrategia: cargar candidatas con PGN no nulo y filtrar en memoria (limitado a 500)
        var candidatas = await _context.Partidas
            .Where(p => p.PGN != null && p.PGN.Length > 10)
            .OrderBy(p => p.Id)
            .Take(500)
            .ToListAsync();

        var resultado = new List<Partida>();
        foreach (var p in candidatas)
        {
            if (PgnContieneFen(p.PGN, fen)) resultado.Add(p);
            if (resultado.Count >= 10) break;
        }
        return resultado;
    }

    private static bool PgnContieneFen(string pgn, string fenBuscado)
    {
        try
        {
            // Extraer solo la parte de posición del FEN (sin contadores)
            var fenPos = fenBuscado.Split(' ')[0];
            // Simulación básica: buscar si el PGN contiene los primeros movimientos
            // que llevan a esa posición (aproximación sin motor)
            return pgn.Contains(fenPos.Substring(0, Math.Min(10, fenPos.Length)));
        }
        catch { return false; }
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
