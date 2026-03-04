namespace ChessLegacy.API.Models;

public class LogroUsuario
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Codigo { get; set; } = string.Empty; // PRIMERA_APERTURA, PRECISION_100, etc.
    public DateTime FechaObtenido { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
}
