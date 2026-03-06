namespace ChessLegacy.API.Models;

public class ProgresoApertura
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Apertura { get; set; } = string.Empty;
    public string? Variante { get; set; }
    public string Color { get; set; } = "white"; // white | black
    public int Intentos { get; set; }
    public int Aciertos { get; set; }
    public int Sesiones { get; set; }
    public int SesionesPerfectas { get; set; } // sesiones con 100% de precisión
    public DateTime UltimaSesion { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
}
