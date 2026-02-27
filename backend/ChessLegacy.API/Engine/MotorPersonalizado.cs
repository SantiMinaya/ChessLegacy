using System.Diagnostics;

namespace ChessLegacy.API.Engine;

public class MotorPersonalizado
{
    private readonly string _stockfishPath;

    public MotorPersonalizado(string stockfishPath)
    {
        _stockfishPath = stockfishPath;
    }

    public async Task<string> JugarComoMaestro(string fen, PersonalidadAjedrez personalidad)
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
        await process.StandardInput.WriteLineAsync($"setoption name Contempt value {personalidad.Contempt}");
        await process.StandardInput.WriteLineAsync($"setoption name Skill Level value {personalidad.SkillLevel}");
        await process.StandardInput.WriteLineAsync($"setoption name MultiPV value {personalidad.MultiPV}");
        await process.StandardInput.WriteLineAsync($"position fen {fen}");
        await process.StandardInput.WriteLineAsync($"go depth {personalidad.Depth}");

        var moves = new List<(string move, int score)>();

        while (!process.StandardOutput.EndOfStream)
        {
            var line = await process.StandardOutput.ReadLineAsync();
            if (line == null) continue;

            if (line.StartsWith("bestmove")) break;

            if (line.Contains("multipv") && line.Contains("pv"))
            {
                var parts = line.Split(' ');
                var pvIndex = Array.IndexOf(parts, "pv");
                var cpIndex = Array.IndexOf(parts, "cp");

                if (pvIndex > 0 && pvIndex + 1 < parts.Length)
                {
                    var move = parts[pvIndex + 1];
                    int score = 0;
                    if (cpIndex > 0 && cpIndex + 1 < parts.Length)
                        int.TryParse(parts[cpIndex + 1], out score);
                    
                    moves.Add((move, score));
                }
            }
        }

        await process.StandardInput.WriteLineAsync("quit");
        await process.WaitForExitAsync();

        return moves.Count > 0 
            ? personalidad.SelectorMovimiento(moves) 
            : "";
    }

    public async Task<(string move, string comentario)> JugarConComentario(string fen, PersonalidadAjedrez personalidad)
    {
        var movimiento = await JugarComoMaestro(fen, personalidad);
        var comentario = GenerarComentario(personalidad.Nombre, movimiento);
        return (movimiento, comentario);
    }

    public async Task<string> ObtenerMejorMovimiento(string fen)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = _stockfishPath,
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            }
        };

        process.Start();
        
        var writer = process.StandardInput;
        var reader = process.StandardOutput;
        
        writer.WriteLine("uci");
        writer.WriteLine("isready");
        writer.Flush();
        
        // Esperar readyok
        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (line.Contains("readyok")) break;
        }
        
        writer.WriteLine($"position fen {fen}");
        writer.WriteLine("go depth 10");
        writer.Flush();

        string bestMove = "";
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (line.StartsWith("bestmove"))
            {
                var parts = line.Split(' ');
                if (parts.Length > 1)
                    bestMove = parts[1];
                break;
            }
        }

        writer.WriteLine("quit");
        writer.Flush();
        
        if (!process.WaitForExit(2000))
            process.Kill();
        
        return bestMove;
    }

    public async Task<int> EvaluarPosicion(string fen)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = _stockfishPath,
                UseShellExecute = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            }
        };

        process.Start();
        
        var writer = process.StandardInput;
        var reader = process.StandardOutput;
        
        writer.WriteLine("uci");
        writer.WriteLine("isready");
        writer.Flush();
        
        // Esperar readyok
        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (line.Contains("readyok")) break;
        }
        
        writer.WriteLine($"position fen {fen}");
        writer.WriteLine("go depth 10");
        writer.Flush();

        int evaluacion = 0;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (line.Contains("score cp"))
            {
                var parts = line.Split(' ');
                var cpIndex = Array.IndexOf(parts, "cp");
                if (cpIndex > 0 && cpIndex + 1 < parts.Length)
                    int.TryParse(parts[cpIndex + 1], out evaluacion);
            }
            if (line.StartsWith("bestmove")) break;
        }

        writer.WriteLine("quit");
        writer.Flush();
        
        if (!process.WaitForExit(2000))
            process.Kill();
        
        return evaluacion;
    }

    private string GenerarComentario(string maestro, string movimiento)
    {
        return maestro switch
        {
            "Mikhail Tal" => "¡Sacrificio interesante! Veamos qué pasa...",
            "José Raúl Capablanca" => "Jugada simple y fuerte.",
            "Garry Kasparov" => "Presión dinámica constante.",
            "Anatoly Karpov" => "Mejorando la posición paso a paso.",
            "Bobby Fischer" => "Jugada precisa y contundente.",
            "Paul Morphy" => "¡Al ataque!",
            "Tigran Petrosian" => "Defensa sólida como el hierro.",
            _ => "Buena jugada."
        };
    }
}
