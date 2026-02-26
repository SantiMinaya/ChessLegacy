using Microsoft.EntityFrameworkCore;
using ChessLegacy.API.Models;

namespace ChessLegacy.API.Data;

public class ChessLegacyContext : DbContext
{
    public ChessLegacyContext(DbContextOptions<ChessLegacyContext> options) : base(options) { }
    
    public DbSet<Jugador> Jugadores { get; set; }
    public DbSet<Partida> Partidas { get; set; }
    public DbSet<Posicion> Posiciones { get; set; }
    public DbSet<Intento> Intentos { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Jugador>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Pais).HasMaxLength(50);
        });
        
        modelBuilder.Entity<Partida>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Jugador)
                .WithMany(j => j.Partidas)
                .HasForeignKey(e => e.JugadorId);
        });
        
        modelBuilder.Entity<Posicion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Partida)
                .WithMany(p => p.Posiciones)
                .HasForeignKey(e => e.PartidaId);
        });
        
        modelBuilder.Entity<Intento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Posicion)
                .WithMany(p => p.Intentos)
                .HasForeignKey(e => e.PosicionId);
        });
    }
}
