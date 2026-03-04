namespace ChessLegacy.API.DTOs;

public class PartidaFiltrosRequest
{
    public int? JugadorId { get; set; }
    public string? CodigoECO { get; set; }
    public string? NombreApertura { get; set; }
    public string? Variante { get; set; }
    public string? Evento { get; set; }
    public string? Oponente { get; set; }
    public int? AnioDesde { get; set; }
    public int? AnioHasta { get; set; }
    public string? Resultado { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class PartidaResponse
{
    public int Id { get; set; }
    public string Evento { get; set; } = string.Empty;
    public string Sitio { get; set; } = string.Empty;
    public int Anio { get; set; }
    public string Oponente { get; set; } = string.Empty;
    public string Resultado { get; set; } = string.Empty;
    public string CodigoECO { get; set; } = string.Empty;
    public string NombreApertura { get; set; } = string.Empty;
    public string Pgn { get; set; } = string.Empty;
    public string ColorJugador { get; set; } = string.Empty;
}
