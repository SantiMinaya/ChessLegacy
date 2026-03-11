namespace ChessLegacy.API.Models;

public class ActividadDiaria
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public DateOnly Fecha { get; set; }
    public Usuario Usuario { get; set; } = null!;
}
