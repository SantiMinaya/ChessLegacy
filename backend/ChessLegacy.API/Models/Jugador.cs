namespace ChessLegacy.API.Models;

public class Jugador
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int AnioNacimiento { get; set; }
    public string Pais { get; set; } = string.Empty;
    
    // Pesos heurísticos para evaluación de estilo
    public double PesoSacrificio { get; set; }
    public double PesoAtaqueRey { get; set; }
    public double PesoSimplificacion { get; set; }
    public double PesoFinales { get; set; }
    public double PesoControlCentro { get; set; }
    
    public ICollection<Partida> Partidas { get; set; } = new List<Partida>();
}
