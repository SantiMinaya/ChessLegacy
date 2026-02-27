namespace ChessLegacy.API.Models;

public class Jugador
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int AnioNacimiento { get; set; }
    public string Pais { get; set; } = string.Empty;
    public string? Biografia { get; set; }
    public string? FotoUrl { get; set; }
    
    // Pesos heurísticos para evaluación de estilo (legacy)
    public double PesoSacrificio { get; set; }
    public double PesoAtaqueRey { get; set; }
    public double PesoSimplificacion { get; set; }
    public double PesoFinales { get; set; }
    public double PesoControlCentro { get; set; }
    
    // Perfil de estilo completo (JSON)
    public string? PerfilEstilo { get; set; } // {"agresividad": 0.9, "complejidad": 0.8, ...}
    
    public ICollection<Partida> Partidas { get; set; } = new List<Partida>();
}
