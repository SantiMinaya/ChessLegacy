namespace ChessLegacy.API.Models;

public class PartidaJugada
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Maestro { get; set; } = string.Empty;
    public string Resultado { get; set; } = string.Empty; // win | loss | draw
    public string Pgn { get; set; } = string.Empty;
    public int TotalMovimientos { get; set; }
    public DateTime FechaJugada { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
}
