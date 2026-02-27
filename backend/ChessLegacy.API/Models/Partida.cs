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
    public string? AperturaNombre { get; set; }
    public string? VarianteNombre { get; set; }
    public string? Resultado { get; set; } // 1-0, 0-1, 1/2-1/2
    public string? ColorJugador { get; set; } // Blancas, Negras
    public int? EloJugador { get; set; }
    public int? EloOponente { get; set; }
    public DateTime? Fecha { get; set; }
    
    public Jugador Jugador { get; set; } = null!;
    public Apertura? Apertura { get; set; }
    public ICollection<Posicion> Posiciones { get; set; } = new List<Posicion>();
    public ICollection<Movimiento> Movimientos { get; set; } = new List<Movimiento>();
}
