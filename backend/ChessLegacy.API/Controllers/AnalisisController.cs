using ChessLegacy.API.Engine;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalisisController : ControllerBase
{
    private readonly StockfishEngine _engine;

    public AnalisisController()
    {
        var stockfishPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "stockfish", "stockfish.exe");
        _engine = new StockfishEngine(stockfishPath);
    }

    [HttpPost("evaluar")]
    public async Task<ActionResult> EvaluarPosicion([FromBody] EvaluarRequest request)
    {
        var (bestMove, evaluation) = await _engine.AnalyzePosition(request.Fen, request.Maestro);
        
        return Ok(new
        {
            fen = request.Fen,
            mejorMovimiento = bestMove,
            evaluacion = evaluation,
            evaluacionTexto = FormatearEvaluacion(evaluation)
        });
    }

    private string FormatearEvaluacion(int centipawns)
    {
        if (Math.Abs(centipawns) > 1000)
            return centipawns > 0 ? "+M" : "-M";
        
        double pawns = centipawns / 100.0;
        return pawns >= 0 ? $"+{pawns:F2}" : $"{pawns:F2}";
    }
}

public record EvaluarRequest(string Fen, string? Maestro = null);
