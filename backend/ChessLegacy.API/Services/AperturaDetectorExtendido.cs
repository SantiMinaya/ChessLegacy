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
        new() { Apertura = "Ruy Lopez", Variante = "Cerrada", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 Nbd2 Bb7 Bc2 Re8 Nf1 Bf8 Ng3 g6 a4 c5 d5" },
        new() { Apertura = "Ruy Lopez", Variante = "Abierta", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Nbd2 O-O Bc2 Nxf2 Rxf2 f6 exf6 Bxf2+ Kxf2 Qxf6" },
        new() { Apertura = "Ruy Lopez", Variante = "Berlinesa", Movimientos = "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Nc3 Ke8 h3 h5 Bf4 Be7 Rad1" },
        new() { Apertura = "Ruy Lopez", Variante = "Steinitz", Movimientos = "e4 e5 Nf3 Nc6 Bb5 d6 d4 Bd7 Nc3 Nf6 O-O Be7 Re1 exd4 Nxd4 O-O Bxc6 bxc6 Bg5" },
        new() { Apertura = "Ruy Lopez", Variante = "Schliemann", Movimientos = "e4 e5 Nf3 Nc6 Bb5 f5 Nc3 fxe4 Nxe4 d5 Nxe5 dxe4 Nxc6 Qd5 c4 Qd6 Nxb8 Rxb8 d4" },
        new() { Apertura = "Ruy Lopez", Variante = "Exchange", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6 d4 exd4 Nxd4 c5 Ne2 Qxd1 Rxd1 Bg4 f3 Be6 Nbc3" },
        new() { Apertura = "Ruy Lopez", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 Bb5" },

        // ITALIANA
        new() { Apertura = "Italiana", Variante = "Giuoco Piano", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 Qb3 Nce7 O-O O-O Rfe1 c6 a4" },
        new() { Apertura = "Italiana", Variante = "Dos Caballos", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6 f4 exf3 Nxf3" },
        new() { Apertura = "Italiana", Variante = "Evans", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Na5 Bg5 f6 Be3 Ne7 d5" },
        new() { Apertura = "Italiana", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 Bc4" },

        // SICILIANA
        new() { Apertura = "Siciliana", Variante = "Najdorf", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O g4 d5 g5 Nfd7 exd5 Nxd5 Nxd5 Bxd5 Qxd5 Qxd5 Nc5 Qe6" },
        new() { Apertura = "Siciliana", Variante = "Dragon", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rb8 h4 h5 Bg5 Rc8 Bb3 Ne5" },
        new() { Apertura = "Siciliana", Variante = "Sveshnikov", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Nd5 Be7 Bxf6 Bxf6 c3 O-O Nc2 Bg5 a4 bxa4" },
        new() { Apertura = "Siciliana", Variante = "Scheveningen", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 Be2 Be7 O-O O-O f4 Nc6 Be3 Bd7 Nb3 a6 g4 d5 g5 Nxe4 Nxe4 d4" },
        new() { Apertura = "Siciliana", Variante = "Paulsen", Movimientos = "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3 Qc7 Be2 Nf6 O-O Nc6 Be3 Be7 f4 d6 Qe1 Nxd4 Bxd4 e5 Be3 O-O" },
        new() { Apertura = "Siciliana", Variante = "Accelerated Dragon", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Nf6 Nc3 d6 Be2 Nxd4 Qxd4 Bg7 Be3 O-O Qd2 Be6 Rc1 Qa5" },
        new() { Apertura = "Siciliana", Variante = "Alapin", Movimientos = "e4 c5 c3 Nf6 e5 Nd5 d4 cxd4 cxd4 d6 Nf3 Nc6 Bc4 Nb6 Bb3 dxe5 dxe5 Qxd1+ Kxd1" },
        new() { Apertura = "Siciliana", Variante = "Closed", Movimientos = "e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 Be3 e6 Nge2 Nge7 O-O O-O d4 cxd4 Nxd4" },
        new() { Apertura = "Siciliana", Variante = null, Movimientos = "e4 c5" },

        // FRANCESA
        new() { Apertura = "Francesa", Variante = "Winawer", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2 Nbc6 f4 dxc3 Qd3 d4 Nxd4" },
        new() { Apertura = "Francesa", Variante = "Tarrasch", Movimientos = "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6 Nf3 Bd6 O-O Qc7 Bg5" },
        new() { Apertura = "Francesa", Variante = "Classical", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 a6 Nf3 c5 dxc5 Nxc5 Bd3 Nbd7 Qe2 b6" },
        new() { Apertura = "Francesa", Variante = "Advance", Movimientos = "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 b4 cxd4 cxd4 Nf5 Bb2 Bd7 Nc3 Rc8 Na4 Qa6" },
        new() { Apertura = "Francesa", Variante = "Exchange", Movimientos = "e4 e6 d4 d5 exd5 exd5 Nf3 Nf6 Bd3 Bd6 O-O O-O Bg5 Bg4 Nbd2 Nbd7 c3 c6 Qc2 Qc7" },
        new() { Apertura = "Francesa", Variante = null, Movimientos = "e4 e6" },

        // CARO-KANN
        new() { Apertura = "Caro-Kann", Variante = "Classical", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bd2 Ngf6 O-O-O Be7 Ne4 Nxe4 Qxe4" },
        new() { Apertura = "Caro-Kann", Variante = "Advance", Movimientos = "e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 O-O Nc6 c3 cxd4 cxd4 Nge7 Nc3 Nf5 Na4 Be7 Nc5 O-O" },
        new() { Apertura = "Caro-Kann", Variante = "Panov", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5 Bd3 Nc6 O-O O-O Re1 Nf6 Bg5" },
        new() { Apertura = "Caro-Kann", Variante = "Exchange", Movimientos = "e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6 Ngf3 Be7 O-O O-O" },
        new() { Apertura = "Caro-Kann", Variante = null, Movimientos = "e4 c6" },

        // ESCOCESA
        new() { Apertura = "Escocesa", Variante = "Classical", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bc4 Ne5 Be2 Qg6 O-O d6 f3 O-O Kh1 Nec6" },
        new() { Apertura = "Escocesa", Variante = "Steinitz", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2 Qxe4+ Be2 Kd8 O-O Bxd2 Qxd2 Qxg2 Rf2 Qg4" },
        new() { Apertura = "Escocesa", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 d4" },

        // GAMBITO DE REY
        new() { Apertura = "Gambito de Rey", Variante = "Aceptado", Movimientos = "e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 d4 Nh5 Bb3 Qe7 Bxf4 Nxf4 O-O" },
        new() { Apertura = "Gambito de Rey", Variante = "Rechazado", Movimientos = "e4 e5 f4 Bc5 Nf3 d6 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 O-O Bd3 d5" },
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
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Bb7 Rd1 Nbd7 Nc3 cxd4 exd4 Be7 Bg5" },
        new() { Apertura = "Gambito de Dama", Variante = "Rechazado", Movimientos = "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6 cxd5 Nxd5 Bxe7 Qxe7 Nxd5 exd5 Rc1 Be6 Qa4" },
        new() { Apertura = "Gambito de Dama", Variante = "Eslava", Movimientos = "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O O-O Qe2 Bg4 Rd1 Nbd7" },
        new() { Apertura = "Gambito de Dama", Variante = "Semi-Eslava", Movimientos = "d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7 O-O a6 e4 c5 d5" },
        new() { Apertura = "Gambito de Dama", Variante = "Tarrasch", Movimientos = "d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 h6 Be3" },
        new() { Apertura = "Gambito de Dama", Variante = null, Movimientos = "d4 d5 c4" },

        // INDIA DE REY
        new() { Apertura = "India de Rey", Variante = "Classical", Movimientos = "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Nd3 f5 Bd2 Nf6 f3 f4 c5" },
        new() { Apertura = "India de Rey", Variante = "Samisch", Movimientos = "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 Nh5 Qd2 Qh4+ g3 Nxg3 Qf2 Nxf1 Qxh4 Nxe3" },
        new() { Apertura = "India de Rey", Variante = "Four Pawns", Movimientos = "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5 b5 cxb5 a6 bxa6 Bxa6 Bd3 Nbd7 O-O" },
        new() { Apertura = "India de Rey", Variante = "Fianchetto", Movimientos = "d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nbd7 Nc3 e5 e4 c6 h3 Qb6 d5 cxd5 cxd5" },
        new() { Apertura = "India de Rey", Variante = null, Movimientos = "d4 Nf6 c4 g6" },

        // NIMZOINDIA
        new() { Apertura = "Nimzoindia", Variante = "Classical", Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3 Bxc3+ Qxc3 b6 Bg5 Bb7 e3 d6 f3 Nbd7 Bd3 c5 Ne2 Rc8" },
        new() { Apertura = "Nimzoindia", Variante = "Rubinstein", Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6 a3 Bxc3 bxc3 dxc4 Bxc4 Qc7 Bd3" },
        new() { Apertura = "Nimzoindia", Variante = "Samisch", Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3 O-O f3 d5 cxd5 exd5 e3 c5 Bd3 Nc6 Ne2 b6 O-O" },
        new() { Apertura = "Nimzoindia", Variante = null, Movimientos = "d4 Nf6 c4 e6 Nc3 Bb4" },

        // INDIA DE DAMA
        new() { Apertura = "India de Dama", Variante = "Petrosian", Movimientos = "d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 Qc2 Nxc3 bxc3 Be7 e4 O-O Bd3 c5 O-O" },
        new() { Apertura = "India de Dama", Variante = "Classical", Movimientos = "d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Nc3 Ne4 Qc2 Nxc3 Qxc3 f5 b3 Bf6 Bb2" },
        new() { Apertura = "India de Dama", Variante = null, Movimientos = "d4 Nf6 c4 e6 Nf3 b6" },

        // GRUNFELD
        new() { Apertura = "Grunfeld", Variante = "Exchange", Movimientos = "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O cxd4 cxd4 Bg4 f3 Na5 Bd3" },
        new() { Apertura = "Grunfeld", Variante = "Russian", Movimientos = "d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Bg4 Be3 Nfd7 Qb3 Nb6 Rd1 Nc6 d5 Ne5" },
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
        new() { Apertura = "Catalan", Variante = "Open", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 a6 Ne5 c5 Na3 cxd4 Naxc4 Bc5 O-O O-O Qb3 Bd5" },
        new() { Apertura = "Catalan", Variante = "Closed", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O dxc4 Qc2 a6 Qxc4 b5 Qc2 Bb7 Bd2 Nbd7 Rc1" },
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

    public static object? ObtenerRandomParaAprendizaje()
    {
        var candidatos = AperturasConVariantes.Where(x => x.Variante != null).ToList();
        var random = candidatos[new Random().Next(candidatos.Count)];
        var movimientos = random.Movimientos.Split(' ', StringSplitOptions.RemoveEmptyEntries).ToList();
        return new { apertura = random.Apertura, variante = random.Variante, movimientos };
    }

    public static List<(string apertura, string? variante)> ObtenerTodosConVariante()
    {
        return AperturasConVariantes
            .Where(x => x.Variante != null)
            .Select(x => (x.Apertura, (string?)x.Variante))
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
