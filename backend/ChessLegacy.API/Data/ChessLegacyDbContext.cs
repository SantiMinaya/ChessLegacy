using Microsoft.EntityFrameworkCore;
using ChessLegacy.API.Models;

namespace ChessLegacy.API.Data;

public class ChessLegacyDbContext : DbContext
{
    public ChessLegacyDbContext(DbContextOptions<ChessLegacyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Jugador> Jugadores => Set<Jugador>();
    public DbSet<Partida> Partidas => Set<Partida>();
    public DbSet<Posicion> Posiciones => Set<Posicion>();
    public DbSet<Intento> Intentos => Set<Intento>();
}