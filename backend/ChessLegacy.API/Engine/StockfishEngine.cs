using System.Diagnostics;
using System.Text;

namespace ChessLegacy.API.Engine;

public class StockfishEngine
{
    private readonly string _stockfishPath;

    public StockfishEngine(string stockfishPath)
    {
        _stockfishPath = stockfishPath;
    }

    private static readonly Dictionary<string, int> MasterContempt = new()
    {
        { "tal",        100 },  // Agresivo, evita tablas a toda costa
        { "kasparov",    80 },  // Muy agresivo, busca complicaciones
        { "alekhine",    70 },  // Combinaciones profundas
        { "fischer",     40 },  // Preciso pero busca ganar
        { "carlsen",     20 },  // Universal, ligeramente activo
        { "capablanca",   0 },  // Equilibrado, técnico
        { "karpov",     -20 },  // Posicional, acepta simplificaciones
        { "petrosian",  -50 },  // Defensivo, acepta tablas
    };

    public async Task<(string bestMove, int evaluation)> AnalyzePosition(string fen, string? maestro = null, int profundidad = 20)
    {
        return await Task.Run(() =>
        {
            try
            {
                Console.WriteLine($"Iniciando Stockfish desde: {_stockfishPath}");
                Console.WriteLine($"Analizando FEN: {fen}");
                
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = _stockfishPath,
                        UseShellExecute = false,
                        RedirectStandardInput = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                        StandardOutputEncoding = Encoding.UTF8,
                        StandardErrorEncoding = Encoding.UTF8
                    }
                };

                process.Start();
                Console.WriteLine("Proceso iniciado");

                // Enviar comandos
                process.StandardInput.AutoFlush = true;
                process.StandardInput.WriteLine("uci");
                Console.WriteLine("Comando UCI enviado");
                
                // Esperar uciok
                string? line;
                int lineCount = 0;
                while ((line = process.StandardOutput.ReadLine()) != null && lineCount < 100)
                {
                    lineCount++;
                    Console.WriteLine($"Stockfish: {line}");
                    if (line.Contains("uciok")) break;
                }

                // Aplicar personalidad del maestro
                if (maestro != null && MasterContempt.TryGetValue(maestro.ToLower(), out int contempt))
                    process.StandardInput.WriteLine($"setoption name Contempt value {contempt}");

                // Analizar posición
                process.StandardInput.WriteLine($"position fen {fen}");
                process.StandardInput.WriteLine($"go depth {profundidad}");
                Console.WriteLine("Comandos de análisis enviados");

                string bestMove = "";
                int evaluation = 0;

                // Leer resultado
                lineCount = 0;
                while ((line = process.StandardOutput.ReadLine()) != null && lineCount < 200)
                {
                    lineCount++;
                    Console.WriteLine($"Análisis: {line}");
                    
                    if (line.Contains("score cp"))
                    {
                        var parts = line.Split(' ');
                        var cpIndex = Array.IndexOf(parts, "cp");
                        if (cpIndex >= 0 && cpIndex + 1 < parts.Length)
                            int.TryParse(parts[cpIndex + 1], out evaluation);
                    }

                    if (line.StartsWith("bestmove"))
                    {
                        var parts = line.Split(' ');
                        if (parts.Length > 1)
                            bestMove = parts[1];
                        Console.WriteLine($"Mejor movimiento encontrado: {bestMove}");
                        break;
                    }
                }

                // Cerrar
                process.StandardInput.WriteLine("quit");
                process.WaitForExit(2000);
                
                if (!process.HasExited)
                    process.Kill();

                process.Dispose();

                Console.WriteLine($"Resultado: movimiento={bestMove}, evaluacion={evaluation}");
                return (bestMove, evaluation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Stockfish: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return ("", 0);
            }
        });
    }
}
