namespace ChessLegacy.API.Models;

public class Amistad
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public int AmigoId { get; set; }
    public string Estado { get; set; } = "pendiente"; // pendiente | aceptada
    public DateTime FechaSolicitud { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
    public Usuario Amigo { get; set; } = null!;
}
