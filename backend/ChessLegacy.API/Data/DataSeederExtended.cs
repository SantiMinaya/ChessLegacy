using ChessLegacy.API.Data;
using ChessLegacy.API.Models;

namespace ChessLegacy.API.Data;

public static class DataSeederExtended
{
    public static async Task SeedAsync(ChessLegacyContext context)
    {
        if (context.Jugadores.Any()) return;

        var jugadores = new List<Jugador>
        {
            new Jugador
            {
                Nombre = "Mikhail Tal",
                AnioNacimiento = 1936,
                Pais = "Letonia",
                PesoSacrificio = 0.9,
                PesoAtaqueRey = 0.85,
                PesoSimplificacion = 0.2,
                PesoFinales = 0.4,
                PesoControlCentro = 0.6
            },
            new Jugador
            {
                Nombre = "José Raúl Capablanca",
                AnioNacimiento = 1888,
                Pais = "Cuba",
                PesoSacrificio = 0.3,
                PesoAtaqueRey = 0.5,
                PesoSimplificacion = 0.9,
                PesoFinales = 0.95,
                PesoControlCentro = 0.7
            },
            new Jugador
            {
                Nombre = "Garry Kasparov",
                AnioNacimiento = 1963,
                Pais = "Rusia",
                PesoSacrificio = 0.6,
                PesoAtaqueRey = 0.75,
                PesoSimplificacion = 0.5,
                PesoFinales = 0.7,
                PesoControlCentro = 0.9
            },
            new Jugador
            {
                Nombre = "Anatoly Karpov",
                AnioNacimiento = 1951,
                Pais = "Rusia",
                PesoSacrificio = 0.3,
                PesoAtaqueRey = 0.5,
                PesoSimplificacion = 0.85,
                PesoFinales = 0.9,
                PesoControlCentro = 0.8
            },
            new Jugador
            {
                Nombre = "Bobby Fischer",
                AnioNacimiento = 1943,
                Pais = "Estados Unidos",
                PesoSacrificio = 0.5,
                PesoAtaqueRey = 0.8,
                PesoSimplificacion = 0.6,
                PesoFinales = 0.85,
                PesoControlCentro = 0.85
            },
            new Jugador
            {
                Nombre = "Paul Morphy",
                AnioNacimiento = 1837,
                Pais = "Estados Unidos",
                PesoSacrificio = 0.85,
                PesoAtaqueRey = 0.9,
                PesoSimplificacion = 0.3,
                PesoFinales = 0.5,
                PesoControlCentro = 0.7
            },
            new Jugador
            {
                Nombre = "Tigran Petrosian",
                AnioNacimiento = 1929,
                Pais = "Armenia",
                PesoSacrificio = 0.2,
                PesoAtaqueRey = 0.4,
                PesoSimplificacion = 0.95,
                PesoFinales = 0.85,
                PesoControlCentro = 0.9
            }
        };

        context.Jugadores.AddRange(jugadores);
        await context.SaveChangesAsync();
    }
}
