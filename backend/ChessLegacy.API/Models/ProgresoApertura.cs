namespace ChessLegacy.API.Models;

public class ProgresoApertura
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Apertura { get; set; } = string.Empty;
    public string? Variante { get; set; }
    public int Intentos { get; set; }
    public int Aciertos { get; set; }
    public int Sesiones { get; set; }
    public DateTime UltimaSesion { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
}
