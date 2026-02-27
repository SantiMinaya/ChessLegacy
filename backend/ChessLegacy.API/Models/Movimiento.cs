namespace ChessLegacy.API.Models;

public class Movimiento
{
    public int Id { get; set; }
    public int PartidaId { get; set; }
    public int NumeroMovimiento { get; set; }
    public string FenAntes { get; set; } = string.Empty;
    public string FenDespues { get; set; } = string.Empty;
    public string San { get; set; } = string.Empty; // e4, Nf3, O-O (Standard Algebraic Notation)
    public int? EvaluacionStockfish { get; set; } // centipawns
    public string? TipoMovimiento { get; set; } // Sacrificio, Posicional, Tactico, Defensivo
    public string FaseJuego { get; set; } = "Apertura"; // Apertura, MedioJuego, Final
    public string? CaracteristicasEstilo { get; set; } // JSON
    
    public Partida Partida { get; set; } = null!;
}
