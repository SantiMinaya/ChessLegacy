namespace ChessLegacy.API.Engine;

public class SimpleChessEngine
{
    private readonly Random _random = new();

    public (string bestMove, int evaluation) AnalyzePosition(string fen)
    {
        try
        {
            var moves = new[] { "e7e5", "g8f6", "b8c6", "d7d5", "c7c5" };
            var move = moves[_random.Next(moves.Length)];
            return (move, 0);
        }
        catch
        {
            return ("", 0);
        }
    }
}
