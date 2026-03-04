namespace ChessLegacy.API.Services;

public class AperturaDetectorExtendido
{
    public class AperturaVariante
    {
        public string Apertura { get; set; } = "";
        public string? Variante { get; set; }
        public string Movimientos { get; set; } = "";
    }

    private static readonly List<AperturaVariante> AperturasConVariantes = new()
    {
        // RUY LOPEZ
        new() { Apertura = "Ruy Lopez", Variante = "Cerrada", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6" },
        new() { Apertura = "Ruy Lopez", Variante = "Abierta", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4" },
        new() { Apertura = "Ruy Lopez", Variante = "Berlinesa", Movimientos = "e4 e5 Nf3 Nc6 Bb5 Nf6" },
        new() { Apertura = "Ruy Lopez", Variante = "Steinitz", Movimientos = "e4 e5 Nf3 Nc6 Bb5 d6" },
        new() { Apertura = "Ruy Lopez", Variante = "Schliemann", Movimientos = "e4 e5 Nf3 Nc6 Bb5 f5" },
        new() { Apertura = "Ruy Lopez", Variante = "Exchange", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6" },
        new() { Apertura = "Ruy Lopez", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 Bb5" },

        // ITALIANA
        new() { Apertura = "Italiana", Variante = "Giuoco Piano", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5" },
        new() { Apertura = "Italiana", Variante = "Dos Caballos", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6" },
        new() { Apertura = "Italiana", Variante = "Evans", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4" },
        new() { Apertura = "Italiana", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 Bc4" },

        // SICILIANA
        new() { Apertura = "Siciliana", Variante = "Najdorf", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6" },
        new() { Apertura = "Siciliana", Variante = "Dragon", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6" },
        new() { Apertura = "Siciliana", Variante = "Sveshnikov", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5" },
        new() { Apertura = "Siciliana", Variante = "Paulsen", Movimientos = "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6" },
        new() { Apertura = "Siciliana", Variante = "Scheveningen", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6" },
        new() { Apertura = "Siciliana", Variante = "Accelerated Dragon", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6" },
        new() { Apertura = "Siciliana", Variante = "Alapin", Movimientos = "e4 c5 c3" },
        new() { Apertura = "Siciliana", Variante = "Closed", Movimientos = "e4 c5 Nc3" },
        new() { Apertura = "Siciliana", Variante = null, Movimientos = "e4 c5" },

        // FRANCESA
        new() { Apertura = "Francesa", Variante = "Winawer", Movimientos = "e4 e6 d4 d5 Nc3 Bb4" },
        new() { Apertura = "Francesa", Variante = "Tarrasch", Movimientos = "e4 e6 d4 d5 Nd2" },
        new() { Apertura = "Francesa", Variante = "Classical", Movimientos = "e4 e6 d4 d5 Nc3 Nf6" },
        new() { Apertura = "Francesa", Variante = "Advance", Movimientos = "e4 e6 d4 d5 e5" },
        new() { Apertura = "Francesa", Variante = "Exchange", Movimientos = "e4 e6 d4 d5 exd5" },
        new() { Apertura = "Francesa", Variante = null, Movimientos = "e4 e6" },

        // CARO-KANN
        new() { Apertura = "Caro-Kann", Variante = "Classical", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5" },
        new() { Apertura = "Caro-Kann", Variante = "Advance", Movimientos = "e4 c6 d4 d5 e5" },
        new() { Apertura = "Caro-Kann", Variante = "Exchange", Movimientos = "e4 c6 d4 d5 exd5" },
        new() { Apertura = "Caro-Kann", Variante = "Panov", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4" },
        new() { Apertura = "Caro-Kann", Variante = null, Movimientos = "e4 c6" },

        // ESCOCESA
        new() { Apertura = "Escocesa", Variante = "Classical", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5" },
        new() { Apertura = "Escocesa", Variante = "Steinitz", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4" },
        new() { Apertura = "Escocesa", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 d4" },

        // GAMBITO DE REY
        new() { Apertura = "Gambito de Rey", Variante = "Aceptado", Movimientos = "e4 e5 f4 exf4" },
        new() { Apertura = "Gambito de Rey", Variante = "Rechazado", Movimientos = "e4 e5 f4 Bc5" },
        new() { Apertura = "Gambito de Rey", Variante = null, Movimientos = "e4 e5 f4" },

        // PETROV
        new() { Apertura = "Petrov", Variante = "Classical", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4" },
        new() { Apertura = "Petrov", Variante = null, Movimientos = "e4 e5 Nf3 Nf6" },

        // ALEKHINE
        new() { Apertura = "Alekhine", Variante = "Four Pawns", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4" },
        new() { Apertura = "Alekhine", Variante = "Modern", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3" },
        new() { Apertura = "Alekhine", Variante = null, Movimientos = "e4 Nf6" },

        // PIRC
        new() { Apertura = "Pirc", Variante = "Austrian", Movimientos = "e4 d6 d4 Nf6 Nc3 g6 f4" },
        new() { Apertura = "Pirc", Variante = "Classical", Movimientos = "e4 d6 d4 Nf6 Nc3 g6 Nf3" },
        new() { Apertura = "Pirc", Variante = null, Movimientos = "e4 d6 d4 Nf6 Nc3 g6" },

        // ESCANDINAVA
        new() { Apertura = "Escandinava", Variante = "Main Line", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5" },
        new() { Apertura = "Escandinava", Variante = null, Movimientos = "e4 d5" },

        // GAMBITO DE DAMA
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado", Movimientos = "d4 d5 c4 dxc4" },
        new() { Apertura = "Gambito de Dama", Variante = "Rechazado", Movimientos = "d4 d5 c4 e6" },
        new() { Apertura = "Gambito de Dama", Variante = "Eslava", Movimientos = "d4 d5 c4 c6" },
        new() { Apertura = "Gambito de Dama", Variante = "Semi-Eslava", Movimientos = "d4 d5 c4 c6 Nf3 Nf6 Nc3 e6" },
        new() { Apertura = "Gambito de Dama", Variante = "Tarrasch", Movimientos = "d4 d5 c4 e6 Nc3 c5" },
        new() { Apertura = "Gambito de Dama", Variante = null, Movimientos = "d4 d5 c4" },

        // INDIA DE REY
        new() { Apertura = "India de Rey", Variante = "Classical", Movimientos = "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2" },
        new() { Apertura = "India de Rey", Variante = "Samisch", Movimientos = "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3" },
        new() { Apertura = "India de Rey", Variante = "Four Pawns", Movimientos = "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4" },
        new() { Apertura = "India de Rey", Variante = "Fianchetto", Movimientos = "d4 Nf6 c4 g6 Nf3 Bg7 g3" },
        new() { Apertura = "India de Rey", Variante = null, Movimientos = "d4 Nf6 c4 g6" },

        // NIMZOINDIA
        new() { Apertura = "Nimzoindia", Variante = "Classical", Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4 Qc2" },
        new() { Apertura = "Nimzoindia", Variante = "Rubinstein", Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4 e3" },
        new() { Apertura = "Nimzoindia", Variante = "Samisch", Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4 a3" },
        new() { Apertura = "Nimzoindia", Variante = null, Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4" },

        // INDIA DE DAMA
        new() { Apertura = "India de Dama", Variante = "Petrosian", Movimientos = "d4 Nf6 c4 e6 Nf3 b6 a3" },
        new() { Apertura = "India de Dama", Variante = "Classical", Movimientos = "d4 Nf6 c4 e6 Nf3 b6 g3" },
        new() { Apertura = "India de Dama", Variante = null, Movimientos = "d4 Nf6 c4 e6 Nf3 b6" },

        // GRUNFELD
        new() { Apertura = "Grunfeld", Variante = "Exchange", Movimientos = "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4" },
        new() { Apertura = "Grunfeld", Variante = "Russian", Movimientos = "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3" },
        new() { Apertura = "Grunfeld", Variante = null, Movimientos = "d4 Nf6 c4 g6 Nc3 d5" },

        // BENONI
        new() { Apertura = "Benoni", Variante = "Modern", Movimientos = "d4 Nf6 c4 c5 d5 e6" },
        new() { Apertura = "Benoni", Variante = "Czech", Movimientos = "d4 Nf6 c4 c5 d5 e5" },
        new() { Apertura = "Benoni", Variante = null, Movimientos = "d4 Nf6 c4 c5" },

        // HOLANDESA
        new() { Apertura = "Holandesa", Variante = "Leningrad", Movimientos = "d4 f5 g3 Nf6 Bg2 g6" },
        new() { Apertura = "Holandesa", Variante = "Stonewall", Movimientos = "d4 f5 g3 Nf6 Bg2 e6 Nf3 d5" },
        new() { Apertura = "Holandesa", Variante = null, Movimientos = "d4 f5" },

        // INGLESA
        new() { Apertura = "Inglesa", Variante = "Symmetrical", Movimientos = "c4 c5" },
        new() { Apertura = "Inglesa", Variante = "Four Knights", Movimientos = "c4 e5 Nc3 Nf6 Nf3 Nc6" },
        new() { Apertura = "Inglesa", Variante = "Reversed Sicilian", Movimientos = "c4 e5" },
        new() { Apertura = "Inglesa", Variante = null, Movimientos = "c4" },

        // RETI
        new() { Apertura = "Reti", Variante = "King's Indian Attack", Movimientos = "Nf3 d5 g3" },
        new() { Apertura = "Reti", Variante = null, Movimientos = "Nf3" },

        // BIRD
        new() { Apertura = "Bird", Variante = "From Gambit", Movimientos = "f4 e5" },
        new() { Apertura = "Bird", Variante = null, Movimientos = "f4" },

        // VIENESA
        new() { Apertura = "Vienesa", Variante = "Gambit", Movimientos = "e4 e5 Nc3 Nf6 f4" },
        new() { Apertura = "Vienesa", Variante = null, Movimientos = "e4 e5 Nc3" },

        // BUDAPEST
        new() { Apertura = "Budapest", Variante = null, Movimientos = "d4 Nf6 c4 e5" },

        // BENKO
        new() { Apertura = "Benko", Variante = null, Movimientos = "d4 Nf6 c4 c5 d5 b5" },

        // CATALAN
        new() { Apertura = "Catalan", Variante = "Open", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4" },
        new() { Apertura = "Catalan", Variante = "Closed", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7" },
        new() { Apertura = "Catalan", Variante = null, Movimientos = "d4 Nf6 c4 e6 g3" },
    };

    public static (string? apertura, string? variante) DetectarAperturaYVariante(string pgn)
    {
        var movimientos = NormalizarMovimientos(pgn);
        
        AperturaVariante? mejorMatch = null;
        int mejorLongitud = 0;

        foreach (var av in AperturasConVariantes.OrderByDescending(x => x.Movimientos.Length))
        {
            if (movimientos.StartsWith(av.Movimientos, StringComparison.OrdinalIgnoreCase))
            {
                if (av.Movimientos.Length > mejorLongitud)
                {
                    mejorMatch = av;
                    mejorLongitud = av.Movimientos.Length;
                }
            }
        }
        
        return mejorMatch != null ? (mejorMatch.Apertura, mejorMatch.Variante) : (null, null);
    }

    public static List<string> ObtenerAperturas()
    {
        return AperturasConVariantes
            .Select(x => x.Apertura)
            .Distinct()
            .OrderBy(x => x)
            .ToList();
    }

    public static List<string> ObtenerVariantes(string apertura)
    {
        return AperturasConVariantes
            .Where(x => x.Apertura == apertura && x.Variante != null)
            .Select(x => x.Variante!)
            .Distinct()
            .OrderBy(x => x)
            .ToList();
    }

    public static object? ObtenerParaAprendizaje(string apertura, string? variante)
    {
        var match = AperturasConVariantes
            .Where(x => x.Apertura.Equals(apertura, StringComparison.OrdinalIgnoreCase)
                     && (variante == null || (x.Variante != null && x.Variante.Equals(variante, StringComparison.OrdinalIgnoreCase))))
            .OrderByDescending(x => x.Movimientos.Length)
            .FirstOrDefault();

        if (match == null) return null;

        var movimientos = match.Movimientos
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .ToList();

        return new
        {
            apertura = match.Apertura,
            variante = match.Variante,
            movimientos
        };
    }

    private static string NormalizarMovimientos(string pgn)
    {
        var limpio = pgn
            .Replace("1-0", "")
            .Replace("0-1", "")
            .Replace("1/2-1/2", "")
            .Trim();
        
        var movimientos = System.Text.RegularExpressions.Regex.Replace(limpio, @"\d+\.", "")
            .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(m => !m.StartsWith("{") && !m.StartsWith("[") && !string.IsNullOrWhiteSpace(m))
            .Take(30)
            .ToList();

        return string.Join(" ", movimientos);
    }
}
