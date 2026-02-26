using System.Diagnostics;

namespace ChessLegacy.API.Engine;

public class StockfishEngine
{
    private readonly string _stockfishPath;

    public StockfishEngine(string stockfishPath)
    {
        _stockfishPath = stockfishPath;
    }

    public async Task<(string bestMove, int evaluation)> AnalyzePosition(string fen)
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
        await process.StandardInput.WriteLineAsync($"position fen {fen}");
        await process.StandardInput.WriteLineAsync("go depth 15");

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
}
