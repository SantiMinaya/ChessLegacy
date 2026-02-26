using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ChessLegacyContext context)
    {
        if (context.Jugadores.Any()) return;

        var tal = new Jugador
        {
            Nombre = "Mikhail Tal",
            AnioNacimiento = 1936,
            Pais = "Letonia",
            PesoSacrificio = 0.9,
            PesoAtaqueRey = 0.85,
            PesoSimplificacion = 0.2,
            PesoFinales = 0.4,
            PesoControlCentro = 0.6
        };

        var capablanca = new Jugador
        {
            Nombre = "José Raúl Capablanca",
            AnioNacimiento = 1888,
            Pais = "Cuba",
            PesoSacrificio = 0.3,
            PesoAtaqueRey = 0.5,
            PesoSimplificacion = 0.9,
            PesoFinales = 0.95,
            PesoControlCentro = 0.7
        };

        var kasparov = new Jugador
        {
            Nombre = "Garry Kasparov",
            AnioNacimiento = 1963,
            Pais = "Rusia",
            PesoSacrificio = 0.6,
            PesoAtaqueRey = 0.75,
            PesoSimplificacion = 0.5,
            PesoFinales = 0.7,
            PesoControlCentro = 0.9
        };

        context.Jugadores.AddRange(tal, capablanca, kasparov);
        await context.SaveChangesAsync();

        await CargarPgnsSimple(context, tal.Id, "Tal.pgn");
        await CargarPgnsSimple(context, capablanca.Id, "Capablanca.pgn");
        await CargarPgnsSimple(context, kasparov.Id, "Kasparov.pgn");
    }

    private static async Task CargarPgnsSimple(ChessLegacyContext context, int jugadorId, string nombreArchivo)
    {
        var rutaArchivo = Path.Combine("pgn-data", nombreArchivo);
        
        if (!System.IO.File.Exists(rutaArchivo))
        {
            Console.WriteLine($"Archivo {nombreArchivo} no encontrado");
            return;
        }

        try
        {
            var lineas = await System.IO.File.ReadAllLinesAsync(rutaArchivo);
            int importadas = 0;
            string oponente = "Desconocido";
            int anio = 0;
            string evento = "Desconocido";
            string codigoECO = "";
            string movimientos = "";

            for (int i = 0; i < lineas.Length && importadas < 50; i++)
            {
                var linea = lineas[i].Trim();

                if (linea.StartsWith("[White "))
                    oponente = ExtraerValor(linea);
                else if (linea.StartsWith("[Date "))
                    anio = ExtraerAnio(linea);
                else if (linea.StartsWith("[Event "))
                    evento = ExtraerValor(linea);
                else if (linea.StartsWith("[ECO "))
                    codigoECO = ExtraerValor(linea);
                else if (!string.IsNullOrEmpty(linea) && !linea.StartsWith("[") && linea.Contains("."))
                {
                    movimientos = linea;
                    
                    var partida = new Partida
                    {
                        JugadorId = jugadorId,
                        Oponente = oponente,
                        Anio = anio,
                        Evento = evento,
                        CodigoECO = codigoECO,
                        PGN = movimientos
                    };

                    context.Partidas.Add(partida);
                    await context.SaveChangesAsync();

                    context.Posiciones.Add(new Posicion
                    {
                        PartidaId = partida.Id,
                        FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                        MovimientoHistorico = ExtraerPrimerMovimiento(movimientos),
                        TipoPosicion = "Apertura"
                    });

                    await context.SaveChangesAsync();
                    importadas++;
                    
                    oponente = "Desconocido";
                    anio = 0;
                    evento = "Desconocido";
                    codigoECO = "";
                    movimientos = "";
                }
            }

            Console.WriteLine($"✅ {importadas} partidas importadas de {nombreArchivo}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
        }
    }

    private static string ExtraerValor(string linea)
    {
        var inicio = linea.IndexOf('"') + 1;
        var fin = linea.LastIndexOf('"');
        return inicio > 0 && fin > inicio ? linea.Substring(inicio, fin - inicio) : "Desconocido";
    }

    private static int ExtraerAnio(string linea)
    {
        var valor = ExtraerValor(linea);
        return int.TryParse(valor.Split('.')[0], out int anio) ? anio : 0;
    }

    private static string ExtraerPrimerMovimiento(string movimientos)
    {
        var partes = movimientos.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return partes.Length > 1 ? partes[1] : "e2e4";
    }
}
