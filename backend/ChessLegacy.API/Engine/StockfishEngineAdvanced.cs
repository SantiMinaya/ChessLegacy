using System.Diagnostics;

namespace ChessLegacy.API.Engine;

public class StockfishEngineAdvanced
{
    private readonly string _stockfishPath;

    public StockfishEngineAdvanced(string stockfishPath)
    {
        _stockfishPath = stockfishPath;
    }

    public async Task<(string bestMove, int evaluation)> AnalyzePosition(
        string fen, 
        int depth = 15, 
        EstiloJuego estilo = EstiloJuego.Equilibrado)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = _stockfishPath,
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            }
        };

        process.Start();

        await process.StandardInput.WriteLineAsync("uci");
        
        // Configurar estilo
        switch (estilo)
        {
            case EstiloJuego.Agresivo:
                await process.StandardInput.WriteLineAsync("setoption name Contempt value 50");
                break;
            case EstiloJuego.Posicional:
                await process.StandardInput.WriteLineAsync("setoption name Contempt value -20");
                break;
            case EstiloJuego.Tactico:
                await process.StandardInput.WriteLineAsync("setoption name Contempt value 30");
                break;
        }

        await process.StandardInput.WriteLineAsync($"position fen {fen}");
        await process.StandardInput.WriteLineAsync($"go depth {depth}");

        string bestMove = "";
        int evaluation = 0;

        while (!process.StandardOutput.EndOfStream)
        {
            var line = await process.StandardOutput.ReadLineAsync();
            if (line == null) continue;

            if (line.StartsWith("bestmove"))
            {
                bestMove = line.Split(' ')[1];
                break;
            }

            if (line.Contains("score cp"))
            {
                var parts = line.Split(' ');
                var cpIndex = Array.IndexOf(parts, "cp");
                if (cpIndex > 0 && cpIndex + 1 < parts.Length)
                    int.TryParse(parts[cpIndex + 1], out evaluation);
            }
        }

        await process.StandardInput.WriteLineAsync("quit");
        await process.WaitForExitAsync();

        return (bestMove, evaluation);
    }

    public async Task<List<(string move, int score)>> GetTopMoves(string fen, int cantidad = 3)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = _stockfishPath,
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            }
        };

        process.Start();

        await process.StandardInput.WriteLineAsync("uci");
        await process.StandardInput.WriteLineAsync($"setoption name MultiPV value {cantidad}");
        await process.StandardInput.WriteLineAsync($"position fen {fen}");
        await process.StandardInput.WriteLineAsync("go depth 15");

        var moves = new List<(string move, int score)>();

        while (!process.StandardOutput.EndOfStream)
        {
            var line = await process.StandardOutput.ReadLineAsync();
            if (line == null) continue;

            if (line.StartsWith("bestmove")) break;

            if (line.Contains("multipv") && line.Contains("score cp"))
            {
                var parts = line.Split(' ');
                var pvIndex = Array.IndexOf(parts, "pv");
                var cpIndex = Array.IndexOf(parts, "cp");
                
                if (pvIndex > 0 && cpIndex > 0 && pvIndex + 1 < parts.Length && cpIndex + 1 < parts.Length)
                {
                    var move = parts[pvIndex + 1];
                    int.TryParse(parts[cpIndex + 1], out int score);
                    moves.Add((move, score));
                }
            }
        }

        await process.StandardInput.WriteLineAsync("quit");
        await process.WaitForExitAsync();

        return moves.Take(cantidad).ToList();
    }
}

public enum EstiloJuego
{
    Equilibrado,
    Agresivo,      // Busca complicaciones, evita tablas
    Posicional,    // Juego tranquilo, acepta tablas
    Tactico        // Busca sacrificios y ataques
}
