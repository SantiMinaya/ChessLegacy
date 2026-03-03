namespace ChessLegacy.API.Services;

public class AperturaDetector
{
    private static readonly Dictionary<string, string> Aperturas = new()
    {
        // Aperturas abiertas (1.e4 e5)
        { "Ruy Lopez", "e4 e5 Nf3 Nc6 Bb5" },
        { "Italiana", "e4 e5 Nf3 Nc6 Bc4" },
        { "Escocesa", "e4 e5 Nf3 Nc6 d4" },
        { "Dos Caballos", "e4 e5 Nf3 Nc6 Bc4 Nf6" },
        { "Gambito de Rey", "e4 e5 f4" },
        { "Vienesa", "e4 e5 Nc3" },
        { "Petrov", "e4 e5 Nf3 Nf6" },
        
        // Defensas contra 1.e4
        { "Siciliana", "e4 c5" },
        { "Francesa", "e4 e6" },
        { "Caro-Kann", "e4 c6" },
        { "Pirc", "e4 d6" },
        { "Alekhine", "e4 Nf6" },
        { "Escandinava", "e4 d5" },
        
        // Aperturas cerradas (1.d4)
        { "Gambito de Dama", "d4 d5 c4" },
        { "India de Rey", "d4 Nf6 c4 g6" },
        { "Nimzoindia", "d4 Nf6 c4 e6 Nc3 Bb4" },
        { "India de Dama", "d4 Nf6 c4 e6 Nf3 b6" },
        { "Grunfeld", "d4 Nf6 c4 g6 Nc3 d5" },
        { "Benoni", "d4 Nf6 c4 c5" },
        { "Holandesa", "d4 f5" },
        
        // Aperturas de flanco
        { "Inglesa", "c4" },
        { "Reti", "Nf3" },
        { "Bird", "f4" },
    };

    public static string? DetectarApertura(string pgn)
    {
        var movimientos = NormalizarMovimientos(pgn);
        
        foreach (var (nombre, secuencia) in Aperturas.OrderByDescending(x => x.Value.Length))
        {
            if (movimientos.StartsWith(secuencia, StringComparison.OrdinalIgnoreCase))
                return nombre;
        }
        
        return null;
    }

    private static string NormalizarMovimientos(string pgn)
    {
        // Eliminar números de movimiento, resultados y comentarios
        var limpio = pgn
            .Replace("1-0", "")
            .Replace("0-1", "")
            .Replace("1/2-1/2", "")
            .Trim();
        
        // Extraer solo los movimientos (sin números)
        var movimientos = System.Text.RegularExpressions.Regex.Replace(limpio, @"\d+\.", "")
            .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(m => !m.StartsWith("{") && !m.StartsWith("[") && !string.IsNullOrWhiteSpace(m))
            .Take(20) // Primeros 10 movimientos completos
            .ToList();

        return string.Join(" ", movimientos);
    }
}
