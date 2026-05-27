using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ChessLegacyContext context)
    {
        var jugadores = new List<Jugador>
        {
            new Jugador { Nombre = "Mikhail Tal", AnioNacimiento = 1936, Pais = "Letonia", PesoSacrificio = 0.9, PesoAtaqueRey = 0.85, PesoSimplificacion = 0.2, PesoFinales = 0.4, PesoControlCentro = 0.6 },
            new Jugador { Nombre = "José Raúl Capablanca", AnioNacimiento = 1888, Pais = "Cuba", PesoSacrificio = 0.3, PesoAtaqueRey = 0.5, PesoSimplificacion = 0.9, PesoFinales = 0.95, PesoControlCentro = 0.7 },
            new Jugador { Nombre = "Garry Kasparov", AnioNacimiento = 1963, Pais = "Rusia", PesoSacrificio = 0.6, PesoAtaqueRey = 0.75, PesoSimplificacion = 0.5, PesoFinales = 0.7, PesoControlCentro = 0.9 },
            new Jugador { Nombre = "Bobby Fischer", AnioNacimiento = 1943, Pais = "Estados Unidos", PesoSacrificio = 0.5, PesoAtaqueRey = 0.7, PesoSimplificacion = 0.6, PesoFinales = 0.8, PesoControlCentro = 0.85 },
            new Jugador { Nombre = "Anatoly Karpov", AnioNacimiento = 1951, Pais = "Rusia", PesoSacrificio = 0.3, PesoAtaqueRey = 0.5, PesoSimplificacion = 0.8, PesoFinales = 0.85, PesoControlCentro = 0.9 },
            new Jugador { Nombre = "Alexander Alekhine", AnioNacimiento = 1892, Pais = "Rusia", PesoSacrificio = 0.8, PesoAtaqueRey = 0.85, PesoSimplificacion = 0.4, PesoFinales = 0.6, PesoControlCentro = 0.7 },
            new Jugador { Nombre = "Tigran Petrosian", AnioNacimiento = 1929, Pais = "Armenia", PesoSacrificio = 0.2, PesoAtaqueRey = 0.4, PesoSimplificacion = 0.9, PesoFinales = 0.75, PesoControlCentro = 0.85 },
            new Jugador { Nombre = "Magnus Carlsen", AnioNacimiento = 1990, Pais = "Noruega", PesoSacrificio = 0.4, PesoAtaqueRey = 0.6, PesoSimplificacion = 0.7, PesoFinales = 0.95, PesoControlCentro = 0.8 },
            new Jugador { Nombre = "Viswanathan Anand", AnioNacimiento = 1969, Pais = "India", PesoSacrificio = 0.5, PesoAtaqueRey = 0.65, PesoSimplificacion = 0.7, PesoFinales = 0.8, PesoControlCentro = 0.8 },
            new Jugador { Nombre = "Mikhail Botvinnik", AnioNacimiento = 1911, Pais = "Rusia", PesoSacrificio = 0.4, PesoAtaqueRey = 0.6, PesoSimplificacion = 0.7, PesoFinales = 0.8, PesoControlCentro = 0.85 },
            new Jugador { Nombre = "David Bronstein", AnioNacimiento = 1924, Pais = "Ucrania", PesoSacrificio = 0.8, PesoAtaqueRey = 0.75, PesoSimplificacion = 0.3, PesoFinales = 0.5, PesoControlCentro = 0.6 },
            new Jugador { Nombre = "Vladimir Kramnik", AnioNacimiento = 1975, Pais = "Rusia", PesoSacrificio = 0.4, PesoAtaqueRey = 0.6, PesoSimplificacion = 0.8, PesoFinales = 0.85, PesoControlCentro = 0.9 },
            new Jugador { Nombre = "Emanuel Lasker", AnioNacimiento = 1868, Pais = "Alemania", PesoSacrificio = 0.5, PesoAtaqueRey = 0.6, PesoSimplificacion = 0.7, PesoFinales = 0.85, PesoControlCentro = 0.75 },
            new Jugador { Nombre = "Paul Morphy", AnioNacimiento = 1837, Pais = "Estados Unidos", PesoSacrificio = 0.9, PesoAtaqueRey = 0.95, PesoSimplificacion = 0.2, PesoFinales = 0.4, PesoControlCentro = 0.6 },
            new Jugador { Nombre = "Aron Nimzowitsch", AnioNacimiento = 1886, Pais = "Letonia", PesoSacrificio = 0.3, PesoAtaqueRey = 0.4, PesoSimplificacion = 0.8, PesoFinales = 0.8, PesoControlCentro = 0.95 },
            new Jugador { Nombre = "Akiba Rubinstein", AnioNacimiento = 1880, Pais = "Polonia", PesoSacrificio = 0.4, PesoAtaqueRey = 0.5, PesoSimplificacion = 0.8, PesoFinales = 0.95, PesoControlCentro = 0.85 },
            new Jugador { Nombre = "Vassily Smyslov", AnioNacimiento = 1921, Pais = "Rusia", PesoSacrificio = 0.3, PesoAtaqueRey = 0.5, PesoSimplificacion = 0.85, PesoFinales = 0.95, PesoControlCentro = 0.8 },
            new Jugador { Nombre = "Boris Spassky", AnioNacimiento = 1937, Pais = "Rusia", PesoSacrificio = 0.6, PesoAtaqueRey = 0.7, PesoSimplificacion = 0.6, PesoFinales = 0.75, PesoControlCentro = 0.75 },
            new Jugador { Nombre = "Wilhelm Steinitz", AnioNacimiento = 1836, Pais = "Austria", PesoSacrificio = 0.4, PesoAtaqueRey = 0.6, PesoSimplificacion = 0.7, PesoFinales = 0.8, PesoControlCentro = 0.9 },
            new Jugador { Nombre = "Siegbert Tarrasch", AnioNacimiento = 1862, Pais = "Alemania", PesoSacrificio = 0.3, PesoAtaqueRey = 0.5, PesoSimplificacion = 0.7, PesoFinales = 0.8, PesoControlCentro = 0.9 }
        };

        foreach (var j in jugadores)
        {
            if (!await context.Jugadores.AnyAsync(x => x.Nombre == j.Nombre))
            {
                context.Jugadores.Add(j);
            }
        }
        await context.SaveChangesAsync();
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
