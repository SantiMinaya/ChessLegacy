namespace ChessLegacy.API.Models;

public class Intento
{
    public int Id { get; set; }
    public int PosicionId { get; set; }
    public string MovimientoJugado { get; set; } = string.Empty;
    public double ScorePrecision { get; set; }
    public double ScoreEstilo { get; set; }
    public double ScoreFinal { get; set; }
    public string MejorMovimiento { get; set; } = string.Empty;
    public int EvaluacionCentipawns { get; set; }
    public DateTime FechaIntento { get; set; }
    
    public Posicion Posicion { get; set; } = null!;
}
