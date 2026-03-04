using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using ilf.pgn;
using ilf.pgn.Data;

namespace ChessLegacy.API.Services;

public class PgnImporterAdvanced
{
    private readonly ChessLegacyContext _context;

    public PgnImporterAdvanced(ChessLegacyContext context)
    {
        _context = context;
    }

    public async Task<int> ImportarPgnCompleto(string rutaArchivo, int jugadorId, int limite = 0)
    {
        var jugador = await _context.Jugadores.FindAsync(jugadorId);
        if (jugador == null) throw new Exception("Jugador no encontrado");

        var pgnReader = new PgnReader();
        using var stream = System.IO.File.OpenRead(rutaArchivo);
        var database = pgnReader.ReadFromStream(stream);

        int importadas = 0;
        var games = limite > 0 ? database.Games.Take(limite) : database.Games;
        var gamesList = games.ToList();
        
        const int batchSize = 50;
        var partidasLote = new List<Partida>();
        var movimientosLote = new List<Movimiento>();

        for (int i = 0; i < gamesList.Count; i++)
        {
            try
            {
                var game = gamesList[i];
                var partida = await CrearPartida(game, jugadorId, jugador.Nombre);
                partidasLote.Add(partida);

                if (partidasLote.Count >= batchSize || i == gamesList.Count - 1)
                {
                    _context.Partidas.AddRange(partidasLote);
                    await _context.SaveChangesAsync();
                    
                    foreach (var p in partidasLote)
                    {
                        var idx = partidasLote.IndexOf(p);
                        var originalGame = gamesList[importadas + idx];
                        var movs = GenerarMovimientos(originalGame, p.Id);
                        movimientosLote.AddRange(movs);
                    }
                    
                    if (movimientosLote.Count > 0)
                    {
                        _context.Movimientos.AddRange(movimientosLote);
                        await _context.SaveChangesAsync();
                    }
                    
                    importadas += partidasLote.Count;
                    Console.WriteLine($"Importadas {importadas}/{gamesList.Count} partidas de {jugador.Nombre}...");
                    
                    partidasLote.Clear();
                    movimientosLote.Clear();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en partida {i + 1}: {ex.Message}");
            }
        }

        return importadas;
    }

    private async Task<Partida> CrearPartida(ilf.pgn.Data.Game game, int jugadorId, string nombreJugador)
    {
        var esBlancas = game.WhitePlayer?.Contains(nombreJugador, StringComparison.OrdinalIgnoreCase) ?? false;
        
        var partida = new Partida
        {
            JugadorId = jugadorId,
            Oponente = NormalizarNombre(esBlancas ? (game.BlackPlayer ?? "Desconocido") : (game.WhitePlayer ?? "Desconocido")),
            Anio = game.Year ?? 0,
            Evento = game.Event ?? "Desconocido",
            CodigoECO = ObtenerTag(game, "ECO") ?? "",
            AperturaNombre = ObtenerTag(game, "Opening") ?? "",
            Resultado = game.Result != null ? game.Result.ToString() : "",
            ColorJugador = esBlancas ? "Blancas" : "Negras",
            EloJugador = ParseElo(ObtenerTag(game, esBlancas ? "WhiteElo" : "BlackElo")),
            EloOponente = ParseElo(ObtenerTag(game, esBlancas ? "BlackElo" : "WhiteElo")),
            PGN = game.MoveText?.ToString() ?? ""
        };

        // Crear apertura si no existe
        if (!string.IsNullOrEmpty(partida.CodigoECO))
        {
            var apertura = await _context.Aperturas.FindAsync(partida.CodigoECO);
            if (apertura == null && !string.IsNullOrEmpty(partida.AperturaNombre))
            {
                apertura = new Apertura
                {
                    ECO = partida.CodigoECO,
                    Nombre = partida.AperturaNombre
                };
                _context.Aperturas.Add(apertura);
            }
        }

        return partida;
    }

    private List<Movimiento> GenerarMovimientos(ilf.pgn.Data.Game game, int partidaId)
    {
        var movimientos = new List<Movimiento>();
        
        if (game.MoveText == null || game.MoveText.Count == 0)
            return movimientos;

        int numeroMovimiento = 1;

        foreach (var moveNode in game.MoveText)
        {
            try
            {
                var moveSan = moveNode.ToString()?.Trim() ?? "";
                
                if (string.IsNullOrEmpty(moveSan)) continue;

                var movimiento = new Movimiento
                {
                    PartidaId = partidaId,
                    NumeroMovimiento = numeroMovimiento,
                    FenAntes = "", // TODO: Generar FEN en Fase 2
                    FenDespues = "",
                    San = moveSan,
                    FaseJuego = DeterminarFase(numeroMovimiento)
                };

                movimientos.Add(movimiento);
                numeroMovimiento++;
            }
            catch
            {
                continue;
            }
        }

        return movimientos;
    }

    private static readonly Dictionary<string, string> _aliasJugadores = new(StringComparer.OrdinalIgnoreCase)
    {
        // Korchnoi
        { "Kortschnoj, Viktor", "Korchnoi, Viktor" },
        { "Kortchnoi, Viktor",  "Korchnoi, Viktor" },
        { "Korchnoi,V",         "Korchnoi, Viktor" },
        // Kasparov
        { "Kasparov, Gary",     "Kasparov, Garry" },
        { "Kasparov, G.",       "Kasparov, Garry" },
        { "Kasparov,G",         "Kasparov, Garry" },
        { "Kasparov,Georgy",    "Kasparov, Garry" },
        // Karpov
        { "Karpov, Anantoly2",  "Karpov, Anatoly" },
        { "Karpov,An",          "Karpov, Anatoly" },
        { "Karpov,Ana",         "Karpov, Anatoly" },
        // Carlsen
        { "Carlsen,M",          "Carlsen, Magnus" },
        { "Carlsen,Magnus",     "Carlsen, Magnus" },
        // Kramnik
        { "Kramnik,V",          "Kramnik, Vladimir" },
        // Spassky
        { "Spassky,B",          "Spassky, Boris V" },
        // Anand
        { "Anand,V",            "Anand, Viswanathan" },
        { "Anand,V2",           "Anand, Viswanathan" },
        // Smyslov
        { "Smyslov,V",          "Smyslov, Vassily" },
    };

    private static string NormalizarNombre(string nombre)
    {
        foreach (var alias in _aliasJugadores)
            if (nombre.Contains(alias.Key, StringComparison.OrdinalIgnoreCase))
                return nombre.Replace(alias.Key, alias.Value, StringComparison.OrdinalIgnoreCase);
        return nombre;
    }

    private string? ObtenerTag(ilf.pgn.Data.Game game, string tagName)
    {
        var tag = game.AdditionalInfo?.FirstOrDefault(t => 
            t.Name?.Equals(tagName, StringComparison.OrdinalIgnoreCase) == true);
        return tag?.Value;
    }

    private string DeterminarFase(int numeroMovimiento)
    {
        if (numeroMovimiento <= 15) return "Apertura";
        if (numeroMovimiento <= 40) return "MedioJuego";
        return "Final";
    }

    private int? ParseElo(string? eloStr)
    {
        if (string.IsNullOrEmpty(eloStr)) return null;
        return int.TryParse(eloStr, out var elo) ? elo : null;
    }
}
