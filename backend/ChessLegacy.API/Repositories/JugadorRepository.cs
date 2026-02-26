using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Repositories;

public class JugadorRepository
{
    private readonly ChessLegacyContext _context;

    public JugadorRepository(ChessLegacyContext context)
    {
        _context = context;
    }

    public async Task<List<Jugador>> GetAllAsync() => 
        await _context.Jugadores.ToListAsync();

    public async Task<Jugador?> GetByIdAsync(int id) => 
        await _context.Jugadores
            .Include(j => j.Partidas)
            .ThenInclude(p => p.Posiciones)
            .FirstOrDefaultAsync(j => j.Id == id);

    public async Task<Jugador> CreateAsync(Jugador jugador)
    {
        _context.Jugadores.Add(jugador);
        await _context.SaveChangesAsync();
        return jugador;
    }
}
