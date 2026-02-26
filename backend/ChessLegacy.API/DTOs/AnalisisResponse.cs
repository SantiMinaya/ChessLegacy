namespace ChessLegacy.API.DTOs;

public class AnalisisResponse
{
    public string MovimientoJugado { get; set; } = string.Empty;
    public string MejorMovimiento { get; set; } = string.Empty;
    public int EvaluacionCentipawns { get; set; }
    public double ScorePrecision { get; set; }
    public double ScoreEstilo { get; set; }
    public double ScoreFinal { get; set; }
    public string Mensaje { get; set; } = string.Empty;
}
