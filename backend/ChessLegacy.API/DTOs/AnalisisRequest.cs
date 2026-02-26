namespace ChessLegacy.API.DTOs;

public class AnalisisRequest
{
    public int PosicionId { get; set; }
    public string MovimientoJugado { get; set; } = string.Empty;
}
