namespace ChessLegacy.API.Models;

public class Posicion
{
    public int Id { get; set; }
    public int PartidaId { get; set; }
    public string FEN { get; set; } = string.Empty;
    public string MovimientoHistorico { get; set; } = string.Empty;
    public string TipoPosicion { get; set; } = string.Empty; // Apertura, Medio juego, Final
    
    public Partida Partida { get; set; } = null!;
    public ICollection<Intento> Intentos { get; set; } = new List<Intento>();
}
