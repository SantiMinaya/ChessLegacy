using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Repositories;

public class PosicionRepository
{
    private readonly ChessLegacyContext _context;

    public PosicionRepository(ChessLegacyContext context)
    {
        _context = context;
    }

    public async Task<List<Posicion>> GetByJugadorIdAsync(int jugadorId) =>
        await _context.Posiciones
            .Include(p => p.Partida)
            .Where(p => p.Partida.JugadorId == jugadorId)
            .ToListAsync();

    public async Task<Posicion?> GetByIdAsync(int id) =>
        await _context.Posiciones
            .Include(p => p.Partida)
            .FirstOrDefaultAsync(p => p.Id == id);
}
