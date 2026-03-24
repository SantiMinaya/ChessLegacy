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
        new() { Apertura = "Ruy Lopez", Variante = "Noruega", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Na5" },
        new() { Apertura = "Ruy Lopez", Variante = "Clásica Diferida", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5" },
        new() { Apertura = "Ruy Lopez", Variante = "Steinitz Diferida", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6" },
        new() { Apertura = "Ruy Lopez", Variante = "Schliemann Diferida", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 f5" },
        new() { Apertura = "Ruy Lopez", Variante = "Arcángel", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7" },
        new() { Apertura = "Ruy Lopez", Variante = "Möller", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Bc5" },
        new() { Apertura = "Ruy Lopez", Variante = "Rusa", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d6" },
        new() { Apertura = "Ruy Lopez", Variante = "Variante Cerrada", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7" },
        new() { Apertura = "Ruy Lopez", Variante = "Variante Abierta", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6" },
        new() { Apertura = "Ruy Lopez", Variante = "Sistema Keres", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Qe2" },
        new() { Apertura = "Ruy Lopez", Variante = "Variante Adam", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Qe2 Be7 c4" },
        new() { Apertura = "Ruy Lopez", Variante = "Variante Italiana", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3" },
        new() { Apertura = "Ruy Lopez", Variante = "Defensa Italiana", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5" },
        new() { Apertura = "Ruy Lopez", Variante = "Defensa Berlín", Movimientos = "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Nc5" },
        new() { Apertura = "Ruy Lopez", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 Bb5" },

        // ITALIANA
        new() { Apertura = "Italiana", Variante = "Giuoco Piano", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 Qb3 Nce7 O-O O-O Rfe1 c6 a4" },
        new() { Apertura = "Italiana", Variante = "Dos Caballos", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6 f4 exf3 Nxf3" },
        new() { Apertura = "Italiana", Variante = "Evans", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Na5 Bg5 f6 Be3 Ne7 d5" },
        // Giuoco Piano variantes
        new() { Apertura = "Italiana", Variante = "Ataque Greco", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Nxc3 bxc3 Bxc3" },
        new() { Apertura = "Italiana", Variante = "Greco Steinitz-Lasker", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 bxc3 d5 Ba3 dxc4 Re1 Be6 Rxe4 Qd5" },
        new() { Apertura = "Italiana", Variante = "Ataque Møller", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 d5 Bf6 Re1 Ne7 Rxe4 d6 Bg5 Bxg5 Nxg5 O-O Nxh7" },
        new() { Apertura = "Italiana", Variante = "Møller Bayoneta", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 d5 Bf6 Re1 Ne7 Rxe4 d6 g4" },
        new() { Apertura = "Italiana", Variante = "Bd2 Ataque Moeller", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Nxe4 Bxb4 Nxb4 Bxf7+ Kxf7 Qb3+ d5 Ne5+ Kf6 f3" },
        new() { Apertura = "Italiana", Variante = "Cracovia Kf1", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Kf1" },
        new() { Apertura = "Italiana", Variante = "Sveshnikov e5", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 e5 d5 Bb5 Ne4 cxd4 Bb6 Nc3 O-O Bxc6" },
        // Giuoco Pianissimo
        new() { Apertura = "Italiana", Variante = "Pianissimo c3 d3", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O" },
        new() { Apertura = "Italiana", Variante = "Pianissimo b4", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 b4 Bb6 d3 d6 O-O O-O" },
        new() { Apertura = "Italiana", Variante = "Canal", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 d3 Nf6 Nc3 d6 Bg5" },
        // Variante cerrada Aliojin
        new() { Apertura = "Italiana", Variante = "Cerrada Aliojin", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6" },
        new() { Apertura = "Italiana", Variante = "Cerrada Aliojin d5", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 d5 Nb8 d6" },
        new() { Apertura = "Italiana", Variante = "Cerrada Aliojin Bg5", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 Bg5" },
        new() { Apertura = "Italiana", Variante = "Cerrada Aliojin Te1", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 O-O Nf6 a4 a6 Re1 d6 h3" },
        // Gambito Evans variantes
        new() { Apertura = "Italiana", Variante = "Evans Aceptado Normal", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O d6 d4 exd4 cxd4 Bb6" },
        new() { Apertura = "Italiana", Variante = "Evans Aceptado Qb3", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 Qb3 Qf6" },
        new() { Apertura = "Italiana", Variante = "Evans Comprometida", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O dxc3" },
        new() { Apertura = "Italiana", Variante = "Evans Lasker", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 d6 d4 b6" },
        // Dos Caballos variantes
        new() { Apertura = "Italiana", Variante = "Dos Caballos Ca5", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6" },
        new() { Apertura = "Italiana", Variante = "Dos Caballos Fritz", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nd4 c3 b5 Bf1 Nxd5 cxd4 Qxg5" },
        new() { Apertura = "Italiana", Variante = "Dos Caballos Ulvestad", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 b5 Bf1 h6 Nxf7 Kxf7" },
        new() { Apertura = "Italiana", Variante = "Fegatello", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3" },
        new() { Apertura = "Italiana", Variante = "Lolli", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 d4 Bb4 c3 Be7 Nxf7 Kxf7 Qf3+" },
        new() { Apertura = "Italiana", Variante = "Traxler", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7 Bxf2+ Kxf2 Nxe4+ Ke3 Qh4" },
        new() { Apertura = "Italiana", Variante = "Dos Caballos d4 Tarrasch", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Bc5 e5 d5 exf6 dxc4" },
        new() { Apertura = "Italiana", Variante = "d6 c3", Movimientos = "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 d6 d4 exd4 cxd4 Bb6" },
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
        // Variantes adicionales Siciliana
        new() { Apertura = "Siciliana", Variante = "Kalashnikov", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5 Nb5 d6" },
        new() { Apertura = "Siciliana", Variante = "Löwenthal", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5 Nb5 a6" },
        new() { Apertura = "Siciliana", Variante = "Pelikán", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 Be6" },
        new() { Apertura = "Siciliana", Variante = "Pelikán Be6", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 Be6" },
        new() { Apertura = "Siciliana", Variante = "Pelikán b5", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 f5" },
        new() { Apertura = "Siciliana", Variante = "Boleslavski", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 e5 Nxc6 bxc6" },
        new() { Apertura = "Siciliana", Variante = "Boleslavski Nb3", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 e5 Nb3" },
        new() { Apertura = "Siciliana", Variante = "Clásica Nc6", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6" },
        new() { Apertura = "Siciliana", Variante = "Cuatro Caballos", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Nxc6 bxc6" },
        new() { Apertura = "Siciliana", Variante = "Richter-Rauzer", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Be7 O-O-O O-O f4" },
        new() { Apertura = "Siciliana", Variante = "Richter-Rauzer Ad7", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Bd7" },
        new() { Apertura = "Siciliana", Variante = "Scheveningen Keres", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 g4" },
        new() { Apertura = "Siciliana", Variante = "Scheveningen Clásica", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 Be2 a6 O-O Qc7 f4 Nc6" },
        new() { Apertura = "Siciliana", Variante = "Sozin-Velimirovic", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 Bc4 Nc6 Be3 Be7 Qe2" },
        new() { Apertura = "Siciliana", Variante = "Sozin Ab3", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6 Bc4 Nc6 Bb3 Be7 Be3 O-O f4" },
        new() { Apertura = "Siciliana", Variante = "Dragon Yugoslavo", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rb8 h4" },
        new() { Apertura = "Siciliana", Variante = "Dragon Acelerado Maroczy", Movimientos = "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3 Nf6 Nc3" },
        new() { Apertura = "Siciliana", Variante = "Najdorf Ag5", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3" },
        new() { Apertura = "Siciliana", Variante = "Najdorf Ae3", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7 Qd2 O-O g4" },
        new() { Apertura = "Siciliana", Variante = "Najdorf Peón Envenenado", Movimientos = "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Qb6 Qd2 Qxb2 Rb1 Qa3" },
        new() { Apertura = "Siciliana", Variante = "Taimánov", Movimientos = "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be3 a6 Be2" },
        new() { Apertura = "Siciliana", Variante = "Kan", Movimientos = "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3 Qc7" },
        new() { Apertura = "Siciliana", Variante = "Smith-Morra", Movimientos = "e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 e6 O-O a6 Qe2 b5" },
        new() { Apertura = "Siciliana", Variante = "Cerrada Grand Prix", Movimientos = "e4 c5 Nc3 Nc6 f4 g6 Nf3 Bg7 Bc4 e6 f5" },
        new() { Apertura = "Siciliana", Variante = null, Movimientos = "e4 c5" },

        // FRANCESA
        new() { Apertura = "Francesa", Variante = "Winawer", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2 Nbc6 f4 dxc3 Qd3 d4 Nxd4" },
        new() { Apertura = "Francesa", Variante = "Tarrasch", Movimientos = "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 f6 exf6 Nxf6 Nf3 Bd6 O-O Qc7 Bg5" },
        new() { Apertura = "Francesa", Variante = "Classical", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 a6 Nf3 c5 dxc5 Nxc5 Bd3 Nbd7 Qe2 b6" },
        new() { Apertura = "Francesa", Variante = "Advance", Movimientos = "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6 b4 cxd4 cxd4 Nf5 Bb2 Bd7 Nc3 Rc8 Na4 Qa6" },
        new() { Apertura = "Francesa", Variante = "Exchange", Movimientos = "e4 e6 d4 d5 exd5 exd5 Nf3 Nf6 Bd3 Bd6 O-O O-O Bg5 Bg4 Nbd2 Nbd7 c3 c6 Qc2 Qc7" },
        // Variante Paulsen - MacCutcheon
        new() { Apertura = "Francesa", Variante = "MacCutcheon exd5 Bxf6", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 exd5 exd5 Bxf6 gxf6 Qd2" },
        new() { Apertura = "Francesa", Variante = "MacCutcheon e5 h6 exf6", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bxf6 gxf6 Qg4" },
        new() { Apertura = "Francesa", Variante = "MacCutcheon e5 h6 Bh4", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bh4" },
        new() { Apertura = "Francesa", Variante = "MacCutcheon e5 h6 Be3", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Be3" },
        new() { Apertura = "Francesa", Variante = "MacCutcheon e5 h6 Bd2 Nfd7 Bxc3 Qg4 Rf8", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Nfd7 Bxc3 Qg4 Rf8" },
        new() { Apertura = "Francesa", Variante = "MacCutcheon e5 h6 Bd2 Nfd7 Bxc3 Qg4 g6", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Nfd7 Bxc3 Qg4 g6" },
        // Variante Clásica Be7
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 Bxe7 Qd2", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Qd2" },
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 Bxe7 Bd3", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Bd3" },
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 Bxe7 Nb5", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Nb5" },
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 Bxe7 Qg4", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Qg4" },
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 h4", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4" },
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 f4 c5 dxc5", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 f4 c5 dxc5 Bxc5 Qg4" },
        new() { Apertura = "Francesa", Variante = "Clásica Be7 e5 Nfd7 f4 c5 Nf3", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 f4 c5 Nf3 Nc6 Be3" },
        new() { Apertura = "Francesa", Variante = "Clásica Burn dxe4", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4" },
        new() { Apertura = "Francesa", Variante = "Steinitz e5 Nfd7 f4 c5", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 dxc5 Nc6 a3 Bxc5 Qg4 O-O" },
        new() { Apertura = "Francesa", Variante = "Steinitz e5 Nfd7 Qg4", Movimientos = "e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 Qg4" },
        // Variante Rustemov
        new() { Apertura = "Francesa", Variante = "Rustemov Nc3 dxe4 Bd7", Movimientos = "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Bd7 Nf3 Bc6" },
        new() { Apertura = "Francesa", Variante = "Rustemov Nc3 dxe4 Nd7 Nxf6", Movimientos = "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Ne5" },
        new() { Apertura = "Francesa", Variante = "Rustemov Nc3 dxe4 Qd5", Movimientos = "e4 e6 d4 d5 Nc3 dxe4 Nxe4 Qd5" },
        // Variante Winawer variantes
        new() { Apertura = "Francesa", Variante = "Winawer 4.e5 c5 a3 Bxc3 bxc3 Qc7", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Qc7" },
        new() { Apertura = "Francesa", Variante = "Winawer 4.e5 c5 a3 Bxc3 bxc3 Ne7 Qg4 Rd1", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Kd1" },
        new() { Apertura = "Francesa", Variante = "Winawer 4.e5 c5 a3 Bxc3 bxc3 Ne7 Qg4 Ne2", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2" },
        new() { Apertura = "Francesa", Variante = "Winawer 4.e5 c5 Bd2", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 Bd2" },
        new() { Apertura = "Francesa", Variante = "Winawer 4.e5 c5 Qg4", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 e5 c5 Qg4" },
        new() { Apertura = "Francesa", Variante = "Winawer Nge2 dxe4 a3 Be7", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 Nge2 dxe4 a3 Be7 Nxe4 Nf6 N2g3 O-O Be2 Nc6" },
        new() { Apertura = "Francesa", Variante = "Winawer Nge2 dxe4 a3 Bxc3", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 Nge2 dxe4 a3 Bxc3+ Nxc3 Nc6" },
        new() { Apertura = "Francesa", Variante = "Winawer Bd3 c5 exd5 Qxd5 Bd2", Movimientos = "e4 e6 d4 d5 Nc3 Bb4 Bd3 c5 exd5 Qxd5 Bd2" },
        // Variante Tarrasch variantes
        new() { Apertura = "Francesa", Variante = "Tarrasch cerrada Nf6 e5 Nfd7 Bd3 c5 c3 b6", Movimientos = "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 b6" },
        new() { Apertura = "Francesa", Variante = "Tarrasch cerrada Leningrado", Movimientos = "e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 Nb6" },
        new() { Apertura = "Francesa", Variante = "Tarrasch abierta c5 exd5 exd5 Ngf3 Nc6", Movimientos = "e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nc6" },
        new() { Apertura = "Francesa", Variante = "Tarrasch abierta c5 exd5 Qxd5 Ngf3 cxd4 Bc4", Movimientos = "e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd8" },
        new() { Apertura = "Francesa", Variante = "Tarrasch Rubinstein dxe4 Bd7 Rustemov", Movimientos = "e4 e6 d4 d5 Nd2 dxe4 Nxe4 Bd7" },
        new() { Apertura = "Francesa", Variante = "Tarrasch Rubinstein Nf6 Nxf6 gxf6", Movimientos = "e4 e6 d4 d5 Nd2 dxe4 Nxe4 Nf6 Nxf6+ gxf6 Nf3" },
        new() { Apertura = "Francesa", Variante = "Tarrasch Rubinstein Nd7 Nf3 Ngf6", Movimientos = "e4 e6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Nf3 Ngf6" },
        new() { Apertura = "Francesa", Variante = "Tarrasch Guimard Nc6 Ngf3 Nf6 e5", Movimientos = "e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6 e5 Nd7" },
        new() { Apertura = "Francesa", Variante = "Tarrasch f5", Movimientos = "e4 e6 d4 d5 Nd2 f5" },
        // Variante Avance Nimzovitch
        new() { Apertura = "Francesa", Variante = "Avance c3 Nc6 Nf3 Qb6 Bd3", Movimientos = "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3" },
        new() { Apertura = "Francesa", Variante = "Avance c3 Nc6 Nf3 Bd7", Movimientos = "e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7" },
        new() { Apertura = "Francesa", Variante = "Avance c3 Qb6 Nf3 Bd7", Movimientos = "e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3 Bd7" },
        new() { Apertura = "Francesa", Variante = "Avance dxc5", Movimientos = "e4 e6 d4 d5 e5 c5 dxc5" },
        new() { Apertura = "Francesa", Variante = "Avance Qg4", Movimientos = "e4 e6 d4 d5 e5 c5 Qg4" },
        new() { Apertura = "Francesa", Variante = "Avance Nf3", Movimientos = "e4 e6 d4 d5 e5 c5 Nf3" },
        // Variante del cambio
        new() { Apertura = "Francesa", Variante = "Cambio Nc3 Nf6 Bg5 Nc6", Movimientos = "e4 e6 d4 d5 exd5 exd5 Nc3 Nf6 Bg5 Nc6" },
        new() { Apertura = "Francesa", Variante = "Cambio Nc3 Ne7 Bg5 f6", Movimientos = "e4 e6 d4 d5 exd5 exd5 Nc3 Ne7 Bg5 f6" },
        new() { Apertura = "Francesa", Variante = "Cambio Bd3 Nc6 Nf3", Movimientos = "e4 e6 d4 d5 exd5 exd5 Bd3 Nc6 Nf3" },
        new() { Apertura = "Francesa", Variante = "Cambio Bd3 Nc6 Ne2 Bd6 c3 Qh4", Movimientos = "e4 e6 d4 d5 exd5 exd5 Bd3 Nc6 Ne2 Bd6 c3 Qh4" },
        new() { Apertura = "Francesa", Variante = "Cambio c4", Movimientos = "e4 e6 d4 d5 exd5 exd5 c4" },
        // Otras variantes
        new() { Apertura = "Francesa", Variante = "Alapin Be3", Movimientos = "e4 e6 d4 d5 Be3" },
        new() { Apertura = "Francesa", Variante = "Gambito ala Nf3 d5 e5 c5 b4", Movimientos = "e4 e6 Nf3 d5 e5 c5 b4" },
        new() { Apertura = "Francesa", Variante = "Pelikan Nc3 d5 f4", Movimientos = "e4 e6 Nc3 d5 f4" },
        new() { Apertura = "Francesa", Variante = "Dos caballos Nc3 d5 Nf3", Movimientos = "e4 e6 Nc3 d5 Nf3" },
        new() { Apertura = "Francesa", Variante = "Chigorín Qe2", Movimientos = "e4 e6 Qe2" },
        new() { Apertura = "Francesa", Variante = "India de rey d3 d5 Nd2 Nf6 Ngf3 Nc6 g3", Movimientos = "e4 e6 d3 d5 Nd2 Nf6 Ngf3 Nc6 g3" },
        new() { Apertura = "Francesa", Variante = null, Movimientos = "e4 e6" },

        // CARO-KANN
        new() { Apertura = "Caro-Kann", Variante = "Classical", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bd2 Ngf6 O-O-O Be7 Ne4 Nxe4 Qxe4" },
        new() { Apertura = "Caro-Kann", Variante = "Advance", Movimientos = "e4 c6 d4 d5 e5 Bf5 Nf3 e6 Be2 c5 O-O Nc6 c3 cxd4 cxd4 Nge7 Nc3 Nf5 Na4 Be7 Nc5 O-O" },
        new() { Apertura = "Caro-Kann", Variante = "Panov", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Be7 cxd5 Nxd5 Bd3 Nc6 O-O O-O Re1 Nf6 Bg5" },
        new() { Apertura = "Caro-Kann", Variante = "Exchange", Movimientos = "e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4 Bg4 Qb3 Qd7 Nd2 e6 Ngf3 Be7 O-O O-O" },
        // Variantes adicionales Caro-Kann
        new() { Apertura = "Caro-Kann", Variante = "Advance Bd3", Movimientos = "e4 c6 d4 d5 e5 Bf5 Bd3" },
        new() { Apertura = "Caro-Kann", Variante = "Advance Nf3", Movimientos = "e4 c6 d4 d5 e5 Bf5 Nf3" },
        new() { Apertura = "Caro-Kann", Variante = "Advance Ne2", Movimientos = "e4 c6 d4 d5 e5 Bf5 Ne2" },
        new() { Apertura = "Caro-Kann", Variante = "Advance h4", Movimientos = "e4 c6 d4 d5 e5 Bf5 h4" },
        new() { Apertura = "Caro-Kann", Variante = "Advance g4", Movimientos = "e4 c6 d4 d5 e5 Bf5 g4" },
        new() { Apertura = "Caro-Kann", Variante = "Advance c3 Be2", Movimientos = "e4 c6 d4 d5 e5 Bf5 c3 e6 Be2" },
        new() { Apertura = "Caro-Kann", Variante = "Advance c5", Movimientos = "e4 c6 d4 d5 e5 c5" },
        new() { Apertura = "Caro-Kann", Variante = "Fantasia f3", Movimientos = "e4 c6 d4 d5 f3" },
        new() { Apertura = "Caro-Kann", Variante = "Nd2 Edinburgo", Movimientos = "e4 c6 d4 d5 Nd2 Qb6" },
        new() { Apertura = "Caro-Kann", Variante = "Nc3 b5", Movimientos = "e4 c6 d4 d5 Nc3 b5" },
        new() { Apertura = "Caro-Kann", Variante = "Nc3 g6", Movimientos = "e4 c6 d4 d5 Nc3 g6" },
        new() { Apertura = "Caro-Kann", Variante = "Na6 Nc7", Movimientos = "e4 c6 d4 Na6 Nc3 Nc7" },
        // Variante del cambio Panov
        new() { Apertura = "Caro-Kann", Variante = "Panov c5", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 c5" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Nc3 Nc6 Bg5 dxc4", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 dxc4 d5 Na5" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Nc3 Nc6 Bg5 e6", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 e6" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Nc3 Nc6 Bg5 Qa5", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 Qa5" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Nc3 Nc6 Bg5 Qb6", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 Qb6" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Nc3 e6", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Nc3 g6", Movimientos = "e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 g6" },
        new() { Apertura = "Caro-Kann", Variante = "Panov Bd3", Movimientos = "e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4" },
        // Variante Clásica
        new() { Apertura = "Caro-Kann", Variante = "Clásica Ng3 h4", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3" },
        new() { Apertura = "Caro-Kann", Variante = "Clásica Ng3 Nh3", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 Nh3" },
        new() { Apertura = "Caro-Kann", Variante = "Clásica Ng3 f4", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 f4" },
        new() { Apertura = "Caro-Kann", Variante = "Clásica Nf6 Nxf6 exf6", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ exf6 Bc4" },
        new() { Apertura = "Caro-Kann", Variante = "Clásica Nf6 Nxf6 exf6 c3", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ exf6 c3 Bd6" },
        new() { Apertura = "Caro-Kann", Variante = "Clásica Nf6 Nxf6 gxf6", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ gxf6" },
        new() { Apertura = "Caro-Kann", Variante = "Clásica Nf6 Bd3", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Bd3" },
        new() { Apertura = "Caro-Kann", Variante = "Nc3 f3", Movimientos = "e4 c6 d4 d5 Nc3 dxe4 f3" },
        // Variante Moderna Smyslov
        new() { Apertura = "Caro-Kann", Variante = "Moderna Smyslov", Movimientos = "e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Bc4 Ngf6 Ng5 e6 Qe2 Nb6" },
        // Líneas secundarias
        new() { Apertura = "Caro-Kann", Variante = "Dos Caballos", Movimientos = "e4 c6 Nc3 d5 Nf3 Bg4" },
        new() { Apertura = "Caro-Kann", Variante = "Anticaro c4", Movimientos = "e4 c6 c4 d5" },
        new() { Apertura = "Caro-Kann", Variante = "Bohemio Ne2", Movimientos = "e4 c6 Ne2" },
        new() { Apertura = "Caro-Kann", Variante = "Dama activa Qf3", Movimientos = "e4 c6 Nc3 d5 Qf3" },
        new() { Apertura = "Caro-Kann", Variante = null, Movimientos = "e4 c6" },

        // ESCOCESA
        new() { Apertura = "Escocesa", Variante = "Classical", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bc4 Ne5 Be2 Qg6 O-O d6 f3 O-O Kh1 Nec6" },
        new() { Apertura = "Escocesa", Variante = "Steinitz", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2 Qxe4+ Be2 Kd8 O-O Bxd2 Qxd2 Qxg2 Rf2 Qg4" },
        new() { Apertura = "Escocesa", Variante = "Línea Principal", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nxd4 Qxd4 d6 Bd3" },
        new() { Apertura = "Escocesa", Variante = "Ataque Horwitz A", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Nd2 Qxe4+ Be2" },
        new() { Apertura = "Escocesa", Variante = "Ataque Horwitz B", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2 Qxe4+ Be2" },
        new() { Apertura = "Escocesa", Variante = "Ataque Horwitz C", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nf3" },
        new() { Apertura = "Escocesa", Variante = "Variante Steinitz Qh4", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3" },
        new() { Apertura = "Escocesa", Variante = "Mieses", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Ba6" },
        new() { Apertura = "Escocesa", Variante = "Tartakóver", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 Nd2" },
        new() { Apertura = "Escocesa", Variante = "Blackburne", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Qd2 d5 Nb5 Bxe3 Qxe3 O-O Nxc7 Rb8 Nxd5 Nxd5 exd5 Nb4" },
        new() { Apertura = "Escocesa", Variante = "Paulsen", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bb5" },
        new() { Apertura = "Escocesa", Variante = "Paulsen-Günsberg", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bb5 Nd8" },
        new() { Apertura = "Escocesa", Variante = "Nc2", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Nc2" },
        new() { Apertura = "Escocesa", Variante = "Blumenfeld", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 Nb5" },
        new() { Apertura = "Escocesa", Variante = "Bc5 Ab6", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Bb6 c3" },
        new() { Apertura = "Escocesa", Variante = "Ab5", Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Bb5" },
        new() { Apertura = "Gambito Goering", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 c3 dxc3 Nxc3 Bb4" },
        new() { Apertura = "Gambito Escocés", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 d4 exd4 Bc4" },
        new() { Apertura = "Escocesa", Variante = null, Movimientos = "e4 e5 Nf3 Nc6 d4" },

        // GAMBITO DE REY
        new() { Apertura = "Gambito de Rey", Variante = "Aceptado", Movimientos = "e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 d4 Nh5 Bb3 Qe7 Bxf4 Nxf4 O-O" },
        new() { Apertura = "Gambito de Rey", Variante = "Rechazado", Movimientos = "e4 e5 f4 Bc5 Nf3 d6 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 O-O Bd3 d5" },
        new() { Apertura = "Gambito de Rey", Variante = null, Movimientos = "e4 e5 f4" },

        // PETROV
        new() { Apertura = "Petrov", Variante = "Classical", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4" },
        // Variante clásica 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3
        new() { Apertura = "Petrov", Variante = "Clásica Jaenisch Be7 Nc6 c4 Nb4 Be2", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O Nc6 c4 Nb4 Be2 O-O Nc3 Bf5 a3 Nxc3 bxc3 Nc6 Re1 Re8" },
        new() { Apertura = "Petrov", Variante = "Clásica Jaenisch 8.Re1 Bg4 c3 f5", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O Nc6 Re1 Bg4 c3 f5 Qb3" },
        new() { Apertura = "Petrov", Variante = "Clásica Marshall Bd6 c4 c6", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O c4 c6" },
        new() { Apertura = "Petrov", Variante = "Clásica Marshall Bd6 c4 Bg4", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O c4 Bg4" },
        new() { Apertura = "Petrov", Variante = "Clásica Be7 OO Nc6 Nbd2", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O Nc6 Nbd2" },
        new() { Apertura = "Petrov", Variante = "Clásica Nc6 OO Ag4", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Bg4" },
        new() { Apertura = "Petrov", Variante = "Clásica Bf5", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bf5" },
        // Ataque Nimzowitsch 5.Nc3
        new() { Apertura = "Petrov", Variante = "Nimzowitsch Nc3 Nxc3 dxc3", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Nc3 Nxc3 dxc3" },
        // Alternativas 5º movimiento blancas
        new() { Apertura = "Petrov", Variante = "Lasker Qe2", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Qe2 Qe7 d3 Nf6" },
        new() { Apertura = "Petrov", Variante = "d3 tranquila", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d3 Nf6" },
        new() { Apertura = "Petrov", Variante = "Kaufmann c4", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 c4 Be7 d4 O-O Bd3 Ng5" },
        new() { Apertura = "Petrov", Variante = "Milenio Bd3", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Bd3" },
        // Alternativas 4º movimiento blancas
        new() { Apertura = "Petrov", Variante = "Cochrane Nxf7", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7 Rxf7 Nc3 c5 Bc4 Be6" },
        new() { Apertura = "Petrov", Variante = "Paulsen Nc4", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nc4" },
        new() { Apertura = "Petrov", Variante = "Karklins-Martinovsky Nd3", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 d6 Nd3" },
        // Variante Damiano 3...Nxe4
        new() { Apertura = "Petrov", Variante = "Damiano Nxe4 Qe2 Qe7", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2 Qe7 Qxe4 d6 d4 dxe5 dxe5 Nc6" },
        // Gambito Stafford 3...Nc6
        new() { Apertura = "Petrov", Variante = "Stafford Nc6 Nxc6 dxc6", Movimientos = "e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 e5 Ne4 d3 Bc5" },
        // Variante Steinitz 3.d4
        new() { Apertura = "Petrov", Variante = "Steinitz d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 OO Bd6 c4", Movimientos = "e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 O-O Bd6 c4 c6 cxd5 cxd5 Nc3 Nxc3 bxc3 O-O Qh5" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 OO Qh4", Movimientos = "e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Nd7 Nxd7 Bxd7 O-O Qh4 c4 O-O-O" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 Nxe4 Bd3 d5 Nxe5 Bd6 OO", Movimientos = "e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Bd6 O-O O-O c4 Bxe5 dxe5 Nc6 cxd5 Qxd5 Qc2 Nb4" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 Nxe4 Bd3 Nc6 Murey", Movimientos = "e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 Nc6 Nxe5 d5" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 Nxe4 dxe5 d5 Nbd2", Movimientos = "e4 e5 Nf3 Nf6 d4 Nxe4 dxe5 d5 Nbd2 Nc5" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 exd4 e5 Ne4 Qxd4 d5 exd6", Movimientos = "e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qxd4 d5 exd6 Nxd6 Nc3 Nc6 Qf4" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 exd4 Bc4 Urusov", Movimientos = "e4 e5 Nf3 Nf6 d4 exd4 Bc4" },
        new() { Apertura = "Petrov", Variante = "Steinitz d4 d5 exd5 exd4 Bb5+", Movimientos = "e4 e5 Nf3 Nf6 d4 d5 exd5 exd4 Bb5+ c6 dxc6 bxc6" },
        // Variante italiana 3.Bc4
        new() { Apertura = "Petrov", Variante = "Italiana Bc4 Nxe4 Nc3 Boden-Kieseritzky", Movimientos = "e4 e5 Nf3 Nf6 Bc4 Nxe4 Nc3 Nxc3 dxc3 f6 O-O Nc6" },
        new() { Apertura = "Petrov", Variante = "Italiana Bc4 Nc6 Dos Caballos", Movimientos = "e4 e5 Nf3 Nf6 Bc4 Nc6" },
        // Tres caballos 3.Nc3
        new() { Apertura = "Petrov", Variante = "Tres Caballos Nc3 Nc6 Cuatro", Movimientos = "e4 e5 Nf3 Nf6 Nc3 Nc6" },
        new() { Apertura = "Petrov", Variante = "Tres Caballos Nc3 Bb4", Movimientos = "e4 e5 Nf3 Nf6 Nc3 Bb4 Nxe5 O-O Be2 Re8 Nd3 Bxc3 dxc3 Nxe4 O-O" },
        // Variante cerrada 3.d3
        new() { Apertura = "Petrov", Variante = "Cerrada d3 Nc6 Be2", Movimientos = "e4 e5 Nf3 Nf6 d3 Nc6 Be2" },
        new() { Apertura = "Petrov", Variante = "Cerrada d3 Nc6 g3 Bg2", Movimientos = "e4 e5 Nf3 Nf6 d3 Nc6 g3 Bg2" },
        new() { Apertura = "Petrov", Variante = "Cerrada d3 d5 exd5 Qxd5 Nc3", Movimientos = "e4 e5 Nf3 Nf6 d3 d5 exd5 Qxd5 Nc3 Bb4 Bd2 Bxc3 Bxc3 Nc6" },
        new() { Apertura = "Petrov", Variante = null, Movimientos = "e4 e5 Nf3 Nf6" },

        // ALEKHINE
        new() { Apertura = "Alekhine", Variante = "Four Pawns", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4" },
        new() { Apertura = "Alekhine", Variante = "Modern", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3" },
        // Variante del cambio
        new() { Apertura = "Alekhine", Variante = "Exchange exd6 cxd6", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 cxd6 Nc3 g6 Be3 Bg7 Rc1 O-O b3" },
        new() { Apertura = "Alekhine", Variante = "Exchange exd6 exd6", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 exd6 Nc3 g6 Nf3 Bg7 Bg5" },
        new() { Apertura = "Alekhine", Variante = "Exchange Voronezh", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 cxd6 Nc3 g6 Be3 Bg7 Rc1 O-O b3 e5 dxe5 dxe5 Qxd8 Rxd8 c5 N6d7" },
        // Ataque cuatro peones
        new() { Apertura = "Alekhine", Variante = "Four Pawns Nc6 Be3 Bf5 Nc3 e6 Nf3 Be7", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3 Be7 Be2 O-O O-O f6" },
        new() { Apertura = "Alekhine", Variante = "Four Pawns Nc6 Be3 Bf5 Nc3 e6 Nf3 Qd7", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3 Qd7" },
        new() { Apertura = "Alekhine", Variante = "Four Pawns Nc6 Be3 Bf5 Nc3 e6 Nf3 Bb4", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3 Bb4" },
        new() { Apertura = "Alekhine", Variante = "Four Pawns Planinc g5", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 g5" },
        new() { Apertura = "Alekhine", Variante = "Four Pawns Fianchetto g6", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 g6" },
        new() { Apertura = "Alekhine", Variante = "Four Pawns Trifunovic Bf5", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 Bf5" },
        // Variante moderna Nf3
        new() { Apertura = "Alekhine", Variante = "Modern Nf3 Bg4 Be2", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 Be2" },
        new() { Apertura = "Alekhine", Variante = "Modern Nf3 g6 Bc4 Keres", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3 g6 Bc4" },
        new() { Apertura = "Alekhine", Variante = "Modern Nf3 dxe5 Nxe5 Nd7 Nxf7", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3 dxe5 Nxe5 Nd7 Nxf7 Kxf7 Qh5+ Ke6" },
        new() { Apertura = "Alekhine", Variante = "Modern Nf3 dxe5 Nxe5 c6 Miles", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3 dxe5 Nxe5 c6 Be2 Nd7" },
        new() { Apertura = "Alekhine", Variante = "Modern Nf3 dxe5 Nxe5 g6 Kengis", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3 dxe5 Nxe5 g6 c4" },
        new() { Apertura = "Alekhine", Variante = "Modern Nf3 c6", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Nf3 c6" },
        // Variante Balogh Bc4
        new() { Apertura = "Alekhine", Variante = "Balogh Bc4 Nb6 Bb3 dxe5 Qh5", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Bc4 Nb6 Bb3 dxe5 Qh5 e6 dxe5" },
        new() { Apertura = "Alekhine", Variante = "Balogh Bc4 Nb6 Bb3 Bf5 e6", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Bc4 Nb6 Bb3 Bf5 e6" },
        new() { Apertura = "Alekhine", Variante = "Balogh Bc4 Nb6 Bb3 d5", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Bc4 Nb6 Bb3 d5" },
        // Ataque dos peones c4 Nb6 c5
        new() { Apertura = "Alekhine", Variante = "Two Pawns c4 Nb6 c5 Nd5 Bc4", Movimientos = "e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Bc4" },
        new() { Apertura = "Alekhine", Variante = "Two Pawns c4 Nb6 c5 Nd5 Nc3", Movimientos = "e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Nc3 e6" },
        // Variante dos caballos Nc3
        new() { Apertura = "Alekhine", Variante = "Two Knights Nc3 Nxc3 dxc3 d6", Movimientos = "e4 Nf6 e5 Nd5 Nc3 Nxc3 dxc3 d6 Bc4 dxe5" },
        new() { Apertura = "Alekhine", Variante = "Two Knights Nc3 Nxc3 bxc3 d6", Movimientos = "e4 Nf6 e5 Nd5 Nc3 Nxc3 bxc3 d6" },
        new() { Apertura = "Alekhine", Variante = "Two Knights Nc3 e6 d4 Nxc3 bxc3", Movimientos = "e4 Nf6 e5 Nd5 Nc3 e6 d4 Nxc3 bxc3" },
        new() { Apertura = "Alekhine", Variante = "Two Knights Nc3 e6 d4 Nxd5 exd5", Movimientos = "e4 Nf6 e5 Nd5 Nc3 e6 d4 Nxd5 exd5" },
        // Variantes menores tras 2.e5 Nd5
        new() { Apertura = "Alekhine", Variante = "d4 d6 Bg5 h6 Bh4 dxe5", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Bg5 h6 Bh4 dxe5 dxe5 Bf5" },
        new() { Apertura = "Alekhine", Variante = "d4 d6 Be2", Movimientos = "e4 Nf6 e5 Nd5 d4 d6 Be2" },
        new() { Apertura = "Alekhine", Variante = "d4 b5 Gambito O'Sullivan", Movimientos = "e4 Nf6 e5 Nd5 d4 b5" },
        new() { Apertura = "Alekhine", Variante = "c4 Nb6 a4 Emory Tate", Movimientos = "e4 Nf6 e5 Nd5 c4 Nb6 a4 d6 a5 N6d7 e6" },
        // Alternativas a 2.e5
        new() { Apertura = "Alekhine", Variante = "Nc3 d5 Escandinava", Movimientos = "e4 Nf6 Nc3 d5 exd5 Nxd5 Bc4 Nb6" },
        new() { Apertura = "Alekhine", Variante = "Nc3 e5 Vienesa", Movimientos = "e4 Nf6 Nc3 e5" },
        new() { Apertura = "Alekhine", Variante = "Nc3 d6 Pirc", Movimientos = "e4 Nf6 Nc3 d6" },
        new() { Apertura = "Alekhine", Variante = null, Movimientos = "e4 Nf6" },

        // PIRC
        new() { Apertura = "Pirc", Variante = "Austrian", Movimientos = "e4 d6 d4 Nf6 Nc3 g6 f4" },
        new() { Apertura = "Pirc", Variante = "Classical", Movimientos = "e4 d6 d4 Nf6 Nc3 g6 Nf3" },
        new() { Apertura = "Pirc", Variante = null, Movimientos = "e4 d6 d4 Nf6 Nc3 g6" },

        // ESCANDINAVA
        new() { Apertura = "Escandinava", Variante = "Main Line", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5" },
        // Variante 3...Qa5 (clásica)
        new() { Apertura = "Escandinava", Variante = "Qa5 tabiya", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Bd2 e6 Qe2 Bb4 Ne5 Nbd7 O-O-O" },
        new() { Apertura = "Escandinava", Variante = "Qa5 Bg4", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bg4 h3 Bh5 g4 Bg6 Ne5" },
        new() { Apertura = "Escandinava", Variante = "Qa5 Bf5 Ne5", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bf5 Ne5 c6 g4" },
        new() { Apertura = "Escandinava", Variante = "Qa5 Nf3 Bc4 Ag4", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 Nf3 Nf6 Bc4 c6 O-O Bg4" },
        new() { Apertura = "Escandinava", Variante = "Qa5 Bc4 agresiva", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Bc4 c6 Bd2 Bf5 Qe2 e6 Ne5 Nbd7 O-O-O" },
        new() { Apertura = "Escandinava", Variante = "Qa5 h4 agresiva", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 c6 Bc4 Bf5 Ne5 e6 g4 Bg6 h4" },
        new() { Apertura = "Escandinava", Variante = "Qa5 e5 dudoso", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 d4 e5 Nf3" },
        new() { Apertura = "Escandinava", Variante = "Gambito Mieses-Kotrc b4", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qa5 b4" },
        // Variante 3...Qd6
        new() { Apertura = "Escandinava", Variante = "Qd6 a6", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 a6 g3 Bg4 Bg2 Nc6 O-O O-O-O d5" },
        new() { Apertura = "Escandinava", Variante = "Qd6 g6", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 g6" },
        new() { Apertura = "Escandinava", Variante = "Qd6 c6 Tiviakov", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 c6" },
        // Variante 3...Qd8 (Valenciana)
        new() { Apertura = "Escandinava", Variante = "Valenciana Qd8", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qd8" },
        // Variante 3...Qe5+ (Patzer)
        new() { Apertura = "Escandinava", Variante = "Patzer Qe5+", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qe5+" },
        // Variante 3...Qe6+ (Mieses-Kotrc)
        new() { Apertura = "Escandinava", Variante = "Mieses-Kotrc Qe6+", Movimientos = "e4 d5 exd5 Qxd5 Nc3 Qe6+ Be2 Qg6" },
        // Variante Marshall 2...Nf6
        new() { Apertura = "Escandinava", Variante = "Marshall Nf6 d4", Movimientos = "e4 d5 exd5 Nf6 d4 Nxd5 c4 Nb6" },
        new() { Apertura = "Escandinava", Variante = "Marshall Nf6 c4", Movimientos = "e4 d5 exd5 Nf6 c4 c6" },
        new() { Apertura = "Escandinava", Variante = "Marshall Nf6 Bb5+", Movimientos = "e4 d5 exd5 Nf6 Bb5+ Bd7 Be2 Nxd5 d4" },
        new() { Apertura = "Escandinava", Variante = "Marshall Nf6 Nc3", Movimientos = "e4 d5 exd5 Nf6 Nc3 Nxd5 Nf3" },
        // Variante portuguesa 3...Bg4
        new() { Apertura = "Escandinava", Variante = "Portuguesa Bg4 e6", Movimientos = "e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 Bb5+ Nbd7 c4 e6 dxe6 Bxe6 d5 Bf5 Nc3 Bd6 g4" },
        new() { Apertura = "Escandinava", Variante = "Portuguesa Bg4 a6", Movimientos = "e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 Bb5+ Nbd7 c4 a6 Bxd7+ Qxd7 Ne2 b5" },
        // Variante 3...Bd7 con Ab5+
        new() { Apertura = "Escandinava", Variante = "Bb5+ Bd7 Be2", Movimientos = "e4 d5 exd5 Nf6 Bb5+ Bd7 Be2 Nxd5 d4" },
        new() { Apertura = "Escandinava", Variante = "Bb5+ Bd7 Bc4 b5", Movimientos = "e4 d5 exd5 Nf6 Bb5+ Bd7 Bc4 b5" },
        // Gambito islándes 3.c4 e6
        new() { Apertura = "Escandinava", Variante = "Gambito Islandés", Movimientos = "e4 d5 exd5 Nf6 c4 e6 dxe6 Bxe6 Nf3 Nc6 Be2 Bc5 O-O Qd7 d3" },
        // Blackburne 2...c6
        new() { Apertura = "Escandinava", Variante = "Blackburne c6", Movimientos = "e4 d5 exd5 c6" },
        new() { Apertura = "Escandinava", Variante = null, Movimientos = "e4 d5" },

        // GAMBITO DE DAMA
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Bb7 Rd1 Nbd7 Nc3 cxd4 exd4 Be7 Bg5" },
        new() { Apertura = "Gambito de Dama", Variante = "Rechazado", Movimientos = "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 b6 cxd5 Nxd5 Bxe7 Qxe7 Nxd5 exd5 Rc1 Be6 Qa4" },
        new() { Apertura = "Gambito de Dama", Variante = "Eslava", Movimientos = "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O O-O Qe2 Bg4 Rd1 Nbd7" },
        new() { Apertura = "Gambito de Dama", Variante = "Semi-Eslava", Movimientos = "d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7 O-O a6 e4 c5 d5" },
        new() { Apertura = "Gambito de Dama", Variante = "Tarrasch", Movimientos = "d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 h6 Be3" },
        // Gambito de Dama Aceptado - variantes
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bxc4 c5 a6 a4", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 a4" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bxc4 c5 a6 e4", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 e4" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bxc4 c5 a6 Qe2 b5 Bb3 Nc6 Rd1", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Nc6 Rd1 c4 Bc2 Nb4 Nc3 Nxc2 Qxc2 Bb7 d5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bxc4 c5 a6 Qe2 b5 Bb3 Bb7 Rd1", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Bb7 Rd1 Nbd7 Nc3 Bd6" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bxc4 c5 cxd4", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O cxd4" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bxc4 c5 Qe2", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 Qe2 a6 dxc5 Bxc5 O-O Nc6 e4 b5 e5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 g6", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 g6" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Bg4", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 Bg4" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 e6 Be6", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 e3 Be6" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 Qa4+", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 Qa4+" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 Nc3 a6 e4", Movimientos = "d4 d5 c4 dxc4 Nf3 Nf6 Nc3 a6 e4" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 a6 e4", Movimientos = "d4 d5 c4 dxc4 Nf3 a6 e4" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 a6 e3 Bg4 d5", Movimientos = "d4 d5 c4 dxc4 Nf3 a6 e3 Bg4 Bxc4 e6 d5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 a6 e3 b5", Movimientos = "d4 d5 c4 dxc4 Nf3 a6 e3 b5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado Nf3 b5", Movimientos = "d4 d5 c4 dxc4 Nf3 b5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado e4 c5 d5 b5", Movimientos = "d4 d5 c4 dxc4 e4 c5 d5 Nf6 Nc3 b5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado e4 f5", Movimientos = "d4 d5 c4 dxc4 e4 f5" },
        new() { Apertura = "Gambito de Dama", Variante = "Aceptado b3", Movimientos = "d4 d5 c4 dxc4 b3 cxb3" },
        // Gambito de Dama Declinado - variantes adicionales
        new() { Apertura = "Gambito de Dama", Variante = "Chigorin", Movimientos = "d4 d5 c4 Nc6" },
        new() { Apertura = "Gambito de Dama", Variante = "Báltica Bf5", Movimientos = "d4 d5 c4 Bf5" },
        new() { Apertura = "Gambito de Dama", Variante = "Marshall Nf6", Movimientos = "d4 d5 c4 Nf6" },
        new() { Apertura = "Gambito de Dama", Variante = "Albin Contragambito", Movimientos = "d4 d5 c4 e5 dxe5 d4" },
        new() { Apertura = "Gambito de Dama", Variante = "Simétrica c5", Movimientos = "d4 d5 c4 c5" },
        new() { Apertura = "Gambito de Dama", Variante = "Alekhine g6", Movimientos = "d4 d5 c4 g6 cxd5 Qxd5 Nc3 Qa5 Nf3 Bg7 Bd2" },
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
        // Gambito Vienés con Nc6
        new() { Apertura = "Vienesa", Variante = "Gambito Vienés d4 Qh4 d5", Movimientos = "e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2 d5" },
        new() { Apertura = "Vienesa", Variante = "Gambito Vienés d4 Qh4 b6", Movimientos = "e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2 b6" },
        new() { Apertura = "Vienesa", Variante = "Gambito Vienés Nf3 g5 h4 Ng5", Movimientos = "e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 h4 g4 Ng5 d6" },
        new() { Apertura = "Vienesa", Variante = "Gambito Vienés Nf3 g5 Bc4 OO", Movimientos = "e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Ne5 Qxf4 Qf6" },
        new() { Apertura = "Vienesa", Variante = "Gambito Vienés Nf3 g5 d4", Movimientos = "e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 d4 g4 Bc4 gxf3 O-O d5 exd5 Bg4 dxc6" },
        // Gambito Vienés con Nf6
        new() { Apertura = "Vienesa", Variante = "Gambito Falkbeer Nf6 Qe2", Movimientos = "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Bg4 Qe2" },
        new() { Apertura = "Vienesa", Variante = "Gambito Falkbeer Nf6 Be7", Movimientos = "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7" },
        new() { Apertura = "Vienesa", Variante = "Gambito Falkbeer Nf6 Qf3 f5", Movimientos = "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Qf3 f5 d4" },
        new() { Apertura = "Vienesa", Variante = "Gambito Falkbeer Nf6 d3 Qh4", Movimientos = "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 d3 Qh4+ g3 Nxg3 Nf3 Qh5 Nxd5" },
        new() { Apertura = "Vienesa", Variante = "Gambito Falkbeer Nf6 d4", Movimientos = "e4 e5 Nc3 Nf6 f4 d5 d3" },
        // Vienesa con Bc4
        new() { Apertura = "Vienesa", Variante = "Bc4 Nf6 d3 Bb4 Bg5", Movimientos = "e4 e5 Nc3 Nc6 Bc4 Nf6 d3 Bb4 Bg5" },
        new() { Apertura = "Vienesa", Variante = "Bc4 Bc5 Qg4", Movimientos = "e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4" },
        // Variante Falkbeer con Bc4
        new() { Apertura = "Vienesa", Variante = "Falkbeer Bc4 Nxe4 Qh5 Nb6 Cb5", Movimientos = "e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Nc6 Nb5 g6 Qf3 f5 Qd5 Qe7 Nxc7+ Kd8 Nxa8 b6" },
        new() { Apertura = "Vienesa", Variante = "Falkbeer Bc4 Nxe4 Qh5 Nb6 d4", Movimientos = "e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Nc6 d4" },
        new() { Apertura = "Vienesa", Variante = "Falkbeer Bc4 Nxe4 Qh5 Be7 Nf3", Movimientos = "e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Be7 Nf3 Nc6 Nxe5" },
        new() { Apertura = "Vienesa", Variante = "Falkbeer Bc4 Nxe4 Nf3 d5", Movimientos = "e4 e5 Nc3 Nf6 Bc4 Nxe4 Nf3 d5" },
        new() { Apertura = "Vienesa", Variante = "Falkbeer Bc4 Nc6", Movimientos = "e4 e5 Nc3 Nf6 Bc4 Nc6" },
        new() { Apertura = "Vienesa", Variante = "Falkbeer a3", Movimientos = "e4 e5 Nc3 Nf6 a3" },
        new() { Apertura = "Vienesa", Variante = "Falkbeer g3", Movimientos = "e4 e5 Nc3 Nf6 g3" },
        // Otras líneas vienesas
        new() { Apertura = "Vienesa", Variante = "g3", Movimientos = "e4 e5 Nc3 Nc6 g3" },
        new() { Apertura = "Vienesa", Variante = "d4", Movimientos = "e4 e5 Nc3 Nc6 d4" },
        new() { Apertura = "Vienesa", Variante = "Zhuravlev Bb4 Qg4 Nf6", Movimientos = "e4 e5 Nc3 Bb4 Qg4 Nf6" },
        new() { Apertura = "Vienesa", Variante = null, Movimientos = "e4 e5 Nc3" },

        // BUDAPEST
        new() { Apertura = "Budapest", Variante = null, Movimientos = "d4 Nf6 c4 e5" },

        // BENKO
        new() { Apertura = "Benko", Variante = null, Movimientos = "d4 Nf6 c4 c5 d5 b5" },

        // CATALAN
        new() { Apertura = "Catalan", Variante = "Open", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 a6 Ne5 c5 Na3 cxd4 Naxc4 Bc5 O-O O-O Qb3 Bd5" },
        new() { Apertura = "Catalan", Variante = "Closed", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O dxc4 Qc2 a6 Qxc4 b5 Qc2 Bb7 Bd2 Nbd7 Rc1" },
        // Catalana cerrada Be7
        new() { Apertura = "Catalan", Variante = "Cerrada Nc3 c6 Qd3", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Nc3 c6 Qd3" },
        new() { Apertura = "Catalan", Variante = "Cerrada Qc2 c6 Rd1 b6 a4", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 Rd1 b6 a4" },
        new() { Apertura = "Catalan", Variante = "Cerrada Qc2 c6 b3 Ab7 Nc3 b5", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 b3 b6 Rd1 Bb7 Nc3 b5" },
        new() { Apertura = "Catalan", Variante = "Cerrada Nbd2 b6 b3 a5 Bb2", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Nbd2 b6 b3 a5 Bb2 Ba6" },
        // Catalana abierta dxc4
        new() { Apertura = "Catalan", Variante = "Abierta Qa4+ Nbd7 Qxc4 a6 Qc2", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Qa4+ Nbd7 Qxc4 a6 Qc2" },
        new() { Apertura = "Catalan", Variante = "Abierta Nf3 Be7", Movimientos = "d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 Be7" },
        new() { Apertura = "Catalan", Variante = null, Movimientos = "d4 Nf6 c4 e6 g3" },

        // SISTEMA LONDRES
        new() { Apertura = "Sistema Londres", Variante = "Clásica", Movimientos = "d4 d5 Nf3 Nf6 Bf4 e6 e3 Bd6 Bg3 O-O Nbd2 c5 c3 Nc6 Bd3 Bxg3 hxg3 Qe7 Ne5 Nd7 Nxd7 Bxd7 dxc5 Qxc5 e4" },
        new() { Apertura = "Sistema Londres", Variante = "vs Fianchetto", Movimientos = "d4 Nf6 Nf3 g6 Bf4 Bg7 e3 O-O Be2 d6 h3 c5 c3 Nc6 O-O Qb6 Qb3 Qxb3 axb3 cxd4 exd4" },
        new() { Apertura = "Sistema Londres", Variante = "vs India de Rey", Movimientos = "d4 Nf6 Nf3 g6 Bf4 Bg7 e3 O-O Be2 d6 O-O Nbd7 h3 c5 c3 b6 Nbd2 Bb7 Bh2 Re8 a4" },
        new() { Apertura = "Sistema Londres", Variante = "Agresiva", Movimientos = "d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3 Bxg3 hxg3 b6 Ne5 Bb7 f4 Ne7 g4" },
        // Respuestas negras al Londres
        new() { Apertura = "Sistema Londres", Variante = "vs GDD d5 e6 Nf6", Movimientos = "d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Bd3 Bd6 Nbd2 O-O Ne5" },
        new() { Apertura = "Sistema Londres", Variante = "vs India de Dama b6 Bb7", Movimientos = "d4 Nf6 Bf4 b6 e3 Bb7 Nf3 e6 Bd3 d6 Nbd2 Nbd7 O-O Be7 c3" },
        new() { Apertura = "Sistema Londres", Variante = "Simétrica d5 Bf5", Movimientos = "d4 d5 Bf4 Bf5 e3 e6 c4 Bxb1 Qxb1 Bb4+ Kd1" },
        new() { Apertura = "Sistema Londres", Variante = "c5 Qb6 Qb3", Movimientos = "d4 Nf6 Bf4 c5 e3 Qb6 Qb3 Qxb3 axb3" },
        new() { Apertura = "Sistema Londres", Variante = "c5 Qb6 Nc3", Movimientos = "d4 Nf6 Bf4 c5 e3 Qb6 Nc3 cxd4 exd4 d5" },
        new() { Apertura = "Sistema Londres", Variante = "Hipopótamo g6 b6", Movimientos = "d4 g6 Bf4 Bg7 e3 b6 Nf3 Bb7 Bd3 d6 Nbd2 e6 c3 Ne7 O-O Nd7" },
        new() { Apertura = "Sistema Londres", Variante = "Grünfeld d5 g6 Bg7", Movimientos = "d4 Nf6 Bf4 g6 e3 Bg7 Nf3 d5 Bd3 O-O Nbd2 c5 c3" },
        new() { Apertura = "Sistema Londres", Variante = "Torre invertido d5 Bg4", Movimientos = "d4 d5 Bf4 Nf6 e3 Bg4 Nf3 e6 Be2 Bxf3 Bxf3 c5" },
        new() { Apertura = "Sistema Londres", Variante = "Chigorin d5 Nc6 Bg4", Movimientos = "d4 d5 Bf4 Nc6 e3 Bg4 Nf3 e6 c3 Bd6" },
        // Jobava Londres (Rapport-Jobava)
        new() { Apertura = "Sistema Londres", Variante = "Jobava Nc3 d5 cxd4", Movimientos = "d4 Nf6 Bf4 d5 e3 c5 Nc3 cxd4 exd4 Nc6 Qd2 Bf5 O-O-O" },
        new() { Apertura = "Sistema Londres", Variante = "Jobava Nc3 g6 Bg7", Movimientos = "d4 Nf6 Bf4 g6 Nc3 d5 e3 Bg7 Qd2 O-O O-O-O c5" },
        new() { Apertura = "Sistema Londres", Variante = "Jobava Nc3 e6 d5", Movimientos = "d4 Nf6 Bf4 e6 Nc3 d5 e3 Bd6 Bg3 O-O Nf3" },
        new() { Apertura = "Sistema Londres", Variante = "h3 Bh2", Movimientos = "d4 d5 Bf4 Nf6 e3 e6 Nf3 c5 h3 Nc6 Bd3 Bd6 Bh2 O-O Nbd2 Qe7 Ne5" },
        new() { Apertura = "Sistema Londres", Variante = null, Movimientos = "d4 d5 Nf3 Nf6 Bf4" },
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
