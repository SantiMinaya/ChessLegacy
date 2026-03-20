namespace ChessLegacy.API.Models;

public class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    public int RachaActual { get; set; } = 0;
    public int MaximaRacha { get; set; } = 0;
    public DateTime? UltimaActividad { get; set; }
    public int Xp { get; set; } = 0;
    public string? Foto { get; set; }

    public ICollection<ProgresoApertura> Progresos { get; set; } = new List<ProgresoApertura>();
    public ICollection<LogroUsuario> Logros { get; set; } = new List<LogroUsuario>();
}
