namespace ChessLegacy.API.Models;

public class Partida
{
    public int Id { get; set; }
    public int JugadorId { get; set; }
    public string PGN { get; set; } = string.Empty;
    public string Oponente { get; set; } = string.Empty;
    public int Anio { get; set; }
    public string Evento { get; set; } = string.Empty;
    public string CodigoECO { get; set; } = string.Empty;
    
    public Jugador Jugador { get; set; } = null!;
    public ICollection<Posicion> Posiciones { get; set; } = new List<Posicion>();
}
