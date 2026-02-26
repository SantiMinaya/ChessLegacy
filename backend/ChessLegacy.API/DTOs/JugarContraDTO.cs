namespace ChessLegacy.API.DTOs;

public class JugarContraRequest
{
    public string FEN { get; set; } = string.Empty;
    public int JugadorId { get; set; }
}

public class JugarContraResponse
{
    public string MovimientoIA { get; set; } = string.Empty;
    public string NuevoFEN { get; set; } = string.Empty;
    public string Comentario { get; set; } = string.Empty;
    public string Maestro { get; set; } = string.Empty;
}
