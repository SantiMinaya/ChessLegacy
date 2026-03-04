namespace ChessLegacy.API.Models;

public class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

    public ICollection<ProgresoApertura> Progresos { get; set; } = new List<ProgresoApertura>();
    public ICollection<LogroUsuario> Logros { get; set; } = new List<LogroUsuario>();
}
