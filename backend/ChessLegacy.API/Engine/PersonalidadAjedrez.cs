namespace ChessLegacy.API.Engine;

public class PersonalidadAjedrez
{
    public string Nombre { get; set; } = string.Empty;
    public int Depth { get; set; }
    public int Contempt { get; set; }
    public int SkillLevel { get; set; }
    public int MultiPV { get; set; }
    public Func<List<(string move, int score)>, string> SelectorMovimiento { get; set; } = null!;

    public static PersonalidadAjedrez Tal => new()
    {
        Nombre = "Mikhail Tal",
        Depth = 12,
        Contempt = 50,
        SkillLevel = 18,
        MultiPV = 5,
        SelectorMovimiento = (moves) =>
        {
            // Tal prefiere sacrificios y complicaciones
            // Busca movimientos con evaluación ligeramente inferior pero más agresivos
            var random = new Random();
            return moves.Count > 2 && random.Next(100) < 30 
                ? moves[1].move  // 30% elige segunda mejor (más arriesgada)
                : moves[0].move;
        }
    };

    public static PersonalidadAjedrez Capablanca => new()
    {
        Nombre = "José Raúl Capablanca",
        Depth = 18,
        Contempt = -15,
        SkillLevel = 20,
        MultiPV = 3,
        SelectorMovimiento = (moves) =>
        {
            // Capablanca: precisión absoluta, siempre la mejor
            return moves[0].move;
        }
    };

    public static PersonalidadAjedrez Kasparov => new()
    {
        Nombre = "Garry Kasparov",
        Depth = 16,
        Contempt = 25,
        SkillLevel = 20,
        MultiPV = 4,
        SelectorMovimiento = (moves) =>
        {
            // Kasparov: agresivo pero preciso
            return moves[0].move;
        }
    };

    public static PersonalidadAjedrez Karpov => new()
    {
        Nombre = "Anatoly Karpov",
        Depth = 17,
        Contempt = -10,
        SkillLevel = 20,
        MultiPV = 3,
        SelectorMovimiento = (moves) =>
        {
            // Karpov: posicional, busca ventajas pequeñas y duraderas
            return moves[0].move;
        }
    };

    public static PersonalidadAjedrez Fischer => new()
    {
        Nombre = "Bobby Fischer",
        Depth = 16,
        Contempt = 20,
        SkillLevel = 20,
        MultiPV = 3,
        SelectorMovimiento = (moves) =>
        {
            // Fischer: preciso y agresivo
            return moves[0].move;
        }
    };

    public static PersonalidadAjedrez Morphy => new()
    {
        Nombre = "Paul Morphy",
        Depth = 14,
        Contempt = 40,
        SkillLevel = 19,
        MultiPV = 5,
        SelectorMovimiento = (moves) =>
        {
            // Morphy: desarrollo rápido y ataque directo
            var random = new Random();
            return moves.Count > 1 && random.Next(100) < 20
                ? moves[1].move
                : moves[0].move;
        }
    };

    public static PersonalidadAjedrez Petrosian => new()
    {
        Nombre = "Tigran Petrosian",
        Depth = 16,
        Contempt = -25,
        SkillLevel = 19,
        MultiPV = 2,
        SelectorMovimiento = (moves) =>
        {
            // Petrosian: ultra defensivo, "Tigre de hierro"
            return moves[0].move;
        }
    };

    public static List<PersonalidadAjedrez> TodasLasPersonalidades => new()
    {
        Tal, Capablanca, Kasparov, Karpov, Fischer, Morphy, Petrosian
    };
}
