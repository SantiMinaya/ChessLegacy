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
    public DbSet<Movimiento> Movimientos { get; set; }
    public DbSet<Apertura> Aperturas { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<ProgresoApertura> Progresos { get; set; }
    public DbSet<LogroUsuario> Logros { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Jugador>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Pais).HasMaxLength(50);
            entity.HasIndex(e => e.Nombre);
        });
        
        modelBuilder.Entity<Partida>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Jugador)
                .WithMany(j => j.Partidas)
                .HasForeignKey(e => e.JugadorId);
            entity.HasOne(e => e.Apertura)
                .WithMany(a => a.Partidas)
                .HasForeignKey(e => e.CodigoECO)
                .HasPrincipalKey(a => a.ECO)
                .IsRequired(false);
            entity.HasIndex(e => e.CodigoECO);
            entity.HasIndex(e => e.Anio);
            entity.HasIndex(e => new { e.JugadorId, e.CodigoECO });
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
        
        modelBuilder.Entity<Movimiento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Partida)
                .WithMany(p => p.Movimientos)
                .HasForeignKey(e => e.PartidaId);
            entity.HasIndex(e => new { e.PartidaId, e.NumeroMovimiento });
            entity.HasIndex(e => e.FaseJuego);
        });
        
        modelBuilder.Entity<Apertura>(entity =>
        {
            entity.HasKey(e => e.ECO);
            entity.Property(e => e.ECO).HasMaxLength(10);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.Nombre);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
        });

        modelBuilder.Entity<ProgresoApertura>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Usuario).WithMany(u => u.Progresos).HasForeignKey(e => e.UsuarioId);
            entity.HasIndex(e => new { e.UsuarioId, e.Apertura, e.Variante }).IsUnique();
        });

        modelBuilder.Entity<LogroUsuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Usuario).WithMany(u => u.Logros).HasForeignKey(e => e.UsuarioId);
            entity.HasIndex(e => new { e.UsuarioId, e.Codigo }).IsUnique();
        });
    }
}
