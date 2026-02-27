namespace ChessLegacy.API.Models;

public class Apertura
{
    public string ECO { get; set; } = string.Empty; // B90, C95, E15
    public string Nombre { get; set; } = string.Empty; // Siciliana Najdorf
    public string? Variante { get; set; } // Poisoned Pawn, English Attack
    public string? MovimientosIniciales { get; set; } // e4 c5 Nf3 d6 d4 cxd4...
    
    public ICollection<Partida> Partidas { get; set; } = new List<Partida>();
}
