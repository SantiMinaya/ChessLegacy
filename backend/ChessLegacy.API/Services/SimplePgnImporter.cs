using ChessLegacy.API.Data;
using ChessLegacy.API.Models;

namespace ChessLegacy.API.Services;

public class SimplePgnImporter
{
    private readonly ChessLegacyContext _context;

    public SimplePgnImporter(ChessLegacyContext context)
    {
        _context = context;
    }

    public async Task<int> ImportarPgn(string rutaArchivo, int jugadorId, int limite = 0)
    {
        var jugador = await _context.Jugadores.FindAsync(jugadorId);
        if (jugador == null) throw new Exception("Jugador no encontrado");

        var lineas = await File.ReadAllLinesAsync(rutaArchivo);
        var partidas = ParsearPgn(lineas, jugador.Nombre, limite);
        
        int importadas = 0;
        foreach (var partida in partidas)
        {
            partida.JugadorId = jugadorId;
            partida.CodigoECO = null!;
            var (apertura, variante) = AperturaDetectorExtendido.DetectarAperturaYVariante(partida.PGN);
            partida.AperturaNombre = apertura;
            partida.VarianteNombre = variante;
            _context.Partidas.Add(partida);
            
            if (++importadas % 50 == 0)
            {
                await _context.SaveChangesAsync();
                Console.WriteLine($"Importadas {importadas} partidas de {jugador.Nombre}...");
            }
        }
        
        if (importadas % 50 != 0)
        {
            await _context.SaveChangesAsync();
        }
        
        return importadas;
    }

    private List<Partida> ParsearPgn(string[] lineas, string nombreJugador, int limite)
    {
        var partidas = new List<Partida>();
        Partida? partidaActual = null;
        string pgn = "";
        string whitePlayer = "";
        string blackPlayer = "";

        foreach (var linea in lineas)
        {
            if (limite > 0 && partidas.Count >= limite) break;

            var l = linea.Trim();
            
            if (l.StartsWith("[Event "))
            {
                if (partidaActual != null && !string.IsNullOrEmpty(pgn))
                {
                    partidaActual.PGN = pgn.Trim();
                    partidaActual.Oponente = DeterminarOponente(whitePlayer, blackPlayer, nombreJugador);
                    partidaActual.ColorJugador = DeterminarColor(whitePlayer, blackPlayer, nombreJugador);
                    if (string.IsNullOrEmpty(partidaActual.Evento)) partidaActual.Evento = "Desconocido";
                    partidas.Add(partidaActual);
                }
                partidaActual = new Partida { Evento = ExtraerValor(l) };
                pgn = "";
                whitePlayer = "";
                blackPlayer = "";
            }
            else if (partidaActual != null)
            {
                if (l.StartsWith("[White ")) whitePlayer = ExtraerValor(l);
                else if (l.StartsWith("[Black ")) blackPlayer = ExtraerValor(l);
                else if (l.StartsWith("[Date ")) partidaActual.Anio = ExtraerAnio(l);
                else if (!l.StartsWith("[") && !string.IsNullOrEmpty(l))
                {
                    pgn += " " + l;
                }
            }
        }

        if (partidaActual != null && !string.IsNullOrEmpty(pgn))
        {
            partidaActual.PGN = pgn.Trim();
            partidaActual.Oponente = DeterminarOponente(whitePlayer, blackPlayer, nombreJugador);
            partidaActual.ColorJugador = DeterminarColor(whitePlayer, blackPlayer, nombreJugador);
            if (string.IsNullOrEmpty(partidaActual.Evento)) partidaActual.Evento = "Desconocido";
            partidas.Add(partidaActual);
        }

        return partidas;
    }

    private string DeterminarColor(string white, string black, string jugador)
    {
        var apellidoJugador = jugador.Split(' ').Last();
        var apellidoWhite = white.Split(',')[0].Trim();
        
        if (apellidoWhite.Equals(apellidoJugador, StringComparison.OrdinalIgnoreCase))
            return "Blancas";
        
        return "Negras";
    }

    private string DeterminarOponente(string white, string black, string jugador)
    {
        if (string.IsNullOrEmpty(white) && string.IsNullOrEmpty(black))
            return "Desconocido";
        
        // Extraer apellido del jugador (última palabra del nombre completo)
        var apellidoJugador = jugador.Split(' ').Last();
        
        // Extraer apellido de white y black (primera parte antes de la coma)
        var apellidoWhite = white.Split(',')[0].Trim();
        var apellidoBlack = black.Split(',')[0].Trim();
        
        if (apellidoWhite.Equals(apellidoJugador, StringComparison.OrdinalIgnoreCase))
            return string.IsNullOrEmpty(black) ? "Desconocido" : black;
        
        if (apellidoBlack.Equals(apellidoJugador, StringComparison.OrdinalIgnoreCase))
            return string.IsNullOrEmpty(white) ? "Desconocido" : white;
        
        return string.IsNullOrEmpty(black) ? white : black;
    }

    private string ExtraerValor(string linea)
    {
        var inicio = linea.IndexOf('"') + 1;
        var fin = linea.LastIndexOf('"');
        return inicio > 0 && fin > inicio ? linea.Substring(inicio, fin - inicio) : "";
    }

    private int ExtraerAnio(string linea)
    {
        var valor = ExtraerValor(linea);
        var partes = valor.Split('.');
        return int.TryParse(partes[0], out int anio) ? anio : 0;
    }
}
