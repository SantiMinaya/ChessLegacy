using ChessLegacy.API.Data;
using ChessLegacy.API.DTOs;
using ChessLegacy.API.Engine;
using ChessLegacy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Services;

public class AnalisisService
{
    private readonly ChessLegacyContext _context;
    private readonly StockfishEngine _engine;

    public AnalisisService(ChessLegacyContext context, StockfishEngine engine)
    {
        _context = context;
        _engine = engine;
    }

    public async Task<AnalisisResponse> AnalizarMovimiento(AnalisisRequest request)
    {
        var posicion = await _context.Posiciones
            .Include(p => p.Partida)
            .ThenInclude(p => p.Jugador)
            .FirstOrDefaultAsync(p => p.Id == request.PosicionId);

        if (posicion == null)
            throw new Exception("Posición no encontrada");

        var (mejorMovimiento, evaluacion) = await _engine.AnalyzePosition(posicion.FEN);

        var scorePrecision = CalcularPrecision(request.MovimientoJugado, mejorMovimiento, evaluacion);
        var scoreEstilo = CalcularEstilo(posicion, request.MovimientoJugado);
        var scoreFinal = (scorePrecision * 0.6) + (scoreEstilo * 0.4);

        var intento = new Intento
        {
            PosicionId = posicion.Id,
            MovimientoJugado = request.MovimientoJugado,
            MejorMovimiento = mejorMovimiento,
            EvaluacionCentipawns = evaluacion,
            ScorePrecision = scorePrecision,
            ScoreEstilo = scoreEstilo,
            ScoreFinal = scoreFinal,
            FechaIntento = DateTime.UtcNow
        };

        _context.Intentos.Add(intento);
        await _context.SaveChangesAsync();

        return new AnalisisResponse
        {
            MovimientoJugado = request.MovimientoJugado,
            MejorMovimiento = mejorMovimiento,
            EvaluacionCentipawns = evaluacion,
            ScorePrecision = scorePrecision,
            ScoreEstilo = scoreEstilo,
            ScoreFinal = scoreFinal,
            Mensaje = GenerarMensaje(scoreFinal)
        };
    }

    private double CalcularPrecision(string movimiento, string mejorMovimiento, int evaluacion)
    {
        if (movimiento.ToLower() == mejorMovimiento.ToLower()) return 100;

        var diferencia = Math.Abs(evaluacion);
        if (diferencia <= 20) return 95;
        if (diferencia <= 50) return 85;
        if (diferencia <= 100) return 70;
        if (diferencia <= 200) return 50;
        if (diferencia <= 300) return 30;
        return 10;
    }

    private double CalcularEstilo(Posicion posicion, string movimiento)
    {
        var jugador = posicion.Partida.Jugador;
        double score = 50;

        bool esCaptura = movimiento.Contains("x");
        bool esCentral = movimiento.Contains("e") || movimiento.Contains("d");
        bool esAvance = char.IsDigit(movimiento[^1]) && int.Parse(movimiento[^1].ToString()) >= 5;

        // Kasparov: Agresivo, control central, desarrollo rápido
        if (jugador.Nombre.Contains("Kasparov"))
        {
            if (esCentral) score += 15;
            if (esCaptura) score += 10;
            if (esAvance) score += 10;
            if (posicion.TipoPosicion == "Apertura") score += 5;
        }
        // Capablanca: Finales, simplificación, técnica
        else if (jugador.Nombre.Contains("Capablanca"))
        {
            if (posicion.TipoPosicion == "Final") score += 20;
            if (!esCaptura && posicion.TipoPosicion == "Medio") score += 10;
            if (movimiento.Length <= 4) score += 5; // Movimientos simples
        }
        // Tal: Sacrificios, complicaciones, ataque
        else if (jugador.Nombre.Contains("Tal"))
        {
            if (esCaptura) score += 15;
            if (esAvance) score += 15;
            if (posicion.TipoPosicion == "Medio") score += 10;
        }

        return Math.Clamp(score, 0, 100);
    }

    private string GenerarMensaje(double score)
    {
        if (score >= 90) return "¡Excelente! Jugada magistral";
        if (score >= 75) return "Muy buena jugada";
        if (score >= 60) return "Jugada aceptable";
        if (score >= 40) return "Jugada dudosa";
        return "Error táctico";
    }
}
