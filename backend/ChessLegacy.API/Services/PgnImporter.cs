using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using ilf.pgn;
using ilf.pgn.Data;

namespace ChessLegacy.API.Services;

public class PgnImporter
{
    private readonly ChessLegacyContext _context;

    public PgnImporter(ChessLegacyContext context)
    {
        _context = context;
    }

    public async Task<int> ImportarPgn(string rutaArchivo, int jugadorId)
    {
        var jugador = await _context.Jugadores.FindAsync(jugadorId);
        if (jugador == null) throw new Exception("Jugador no encontrado");

        var pgnReader = new PgnReader();
        using var stream = System.IO.File.OpenRead(rutaArchivo);
        var database = pgnReader.ReadFromStream(stream);

        int importadas = 0;

        foreach (var game in database.Games.Take(50)) // Limita a 50 partidas
        {
            var partida = new Partida
            {
                JugadorId = jugadorId,
                Oponente = ObtenerOponente(game, jugador.Nombre),
                Anio = game.Year ?? 0,
                Evento = game.Event ?? "Desconocido",
                PGN = game.MoveText?.ToString() ?? ""
            };

            _context.Partidas.Add(partida);
            await _context.SaveChangesAsync();

            // Extraer posiciones interesantes (cada 10 movimientos)
            var posiciones = ExtraerPosiciones(game, partida.Id);
            _context.Posiciones.AddRange(posiciones);
            await _context.SaveChangesAsync();

            importadas++;
        }

        return importadas;
    }

    private string ObtenerOponente(Game game, string nombreJugador)
    {
        if (game.WhitePlayer?.Contains(nombreJugador) == true)
            return game.BlackPlayer ?? "Desconocido";
        return game.WhitePlayer ?? "Desconocido";
    }

    private List<Posicion> ExtraerPosiciones(Game game, int partidaId)
    {
        var posiciones = new List<Posicion>();
        var board = new BoardSetup();

        if (game.MoveText?.Count > 0)
        {
            // Posición inicial
            posiciones.Add(new Posicion
            {
                PartidaId = partidaId,
                FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                MovimientoHistorico = game.MoveText[0].ToString() ?? "",
                TipoPosicion = "Apertura"
            });

            // Medio juego (movimiento 15)
            if (game.MoveText.Count > 15)
            {
                posiciones.Add(new Posicion
                {
                    PartidaId = partidaId,
                    FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Simplificado
                    MovimientoHistorico = game.MoveText[15].ToString() ?? "",
                    TipoPosicion = "Medio juego"
                });
            }

            // Final (últimos 10 movimientos)
            if (game.MoveText.Count > 30)
            {
                posiciones.Add(new Posicion
                {
                    PartidaId = partidaId,
                    FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Simplificado
                    MovimientoHistorico = game.MoveText[^10].ToString() ?? "",
                    TipoPosicion = "Final"
                });
            }
        }

        return posiciones;
    }
}
