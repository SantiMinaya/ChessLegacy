using System.Security.Claims;
using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/progreso")]
[Authorize]
public class ProgresoController : ControllerBase
{
    private readonly ChessLegacyContext _db;

    private static readonly Dictionary<string, (string Nombre, string Descripcion, string Emoji)> Logros = new()
    {
        ["PRIMERA_APERTURA"]   = ("Primera Apertura",       "Completa tu primera sesión de entrenamiento",          "🎓"),
        ["PRECISION_100"]      = ("Perfección",             "Completa una apertura con 100% de precisión",          "💯"),
        ["DIEZ_APERTURAS"]     = ("Estudioso",              "Practica 10 aperturas distintas",                      "📚"),
        ["CINCUENTA_ACIERTOS"] = ("Buen Estudiante",        "Acumula 50 movimientos correctos",                     "🎯"),
        ["CIEN_ACIERTOS"]      = ("Experto",                "Acumula 100 movimientos correctos",                    "🏅"),
        ["QUINIENTOS_ACIERTOS"]= ("Gran Maestro",           "Acumula 500 movimientos correctos",                    "👑"),
        ["CONTRARRELOJ_LIMPIO"]= ("Sin Tiempo",             "Completa una sesión de contrarreloj sin timeouts",     "⚡"),
        ["CINCO_SESIONES"]     = ("Constante",              "Realiza 5 sesiones de entrenamiento",                  "🔥"),
        ["VEINTE_SESIONES"]    = ("Dedicado",               "Realiza 20 sesiones de entrenamiento",                 "⭐"),
        ["ADIVINA_PERFECTO"]   = ("Reconocedor",            "Consigue 5/5 en Adivina la Apertura",                  "🤔"),
        ["PRIMER_TORNEO"]       = ("Debutante",              "Completa tu primer torneo",                            "🎪"),
        ["PRIMER_TORNEO_GANADO"]= ("Campeón",               "Gana tu primer torneo",                                "🏆"),
        ["CINCO_TORNEOS"]       = ("Veterano",               "Completa 5 torneos",                                   "🎖️"),
        ["TORNEO_PERFECTO"]     = ("Invicto",                "Gana un torneo sin perder ninguna ronda",              "👑"),
        ["VENCE_TODOS_MAESTROS"]= ("Conquistador",           "Gana al menos un torneo contra cada maestro",          "⚔️"),
        ["TORNEO_BALA"]         = ("Rayo",                   "Gana un torneo con control de tiempo bala (≤2 min)",   "⚡"),
        ["BLINDFOLD_WIN"]        = ("Ciego",                  "Gana una partida en modo blindfold",                   "🙈"),
        ["SUPERVIVIENTE_20"]     = ("Superviviente",           "Llega al puzzle 20 en modo supervivencia",             "💀"),
        ["SPEED_RUNNER"]         = ("Speed Runner",            "Completa una apertura en menos de 30 segundos",        "⚡"),
        ["SEMANA_COMPLETA"]      = ("Semana Completa",         "Mantén una racha de 7 días consecutivos",              "📅"),
        ["GEOGRAFO"]             = ("Geógrafo",               "Acierta 100 casillas en el modo Aprender Casillas",    "🗺️"),
        ["ANALISTA"]             = ("Analista",               "Analiza 10 partidas post-partida",                     "🔍"),
        ["PATRON_MAESTRO"]       = ("Patrón Maestro",         "Completa los 5 patrones tácticos",                    "🧩"),
    };

    public ProgresoController(ChessLegacyContext db) => _db = db;

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetProgreso()
    {
        var usuario = await _db.Usuarios.FindAsync(UserId);
        var progresos = await _db.Progresos.Where(p => p.UsuarioId == UserId).ToListAsync();
        var logros = await _db.Logros.Where(l => l.UsuarioId == UserId).ToListAsync();

        var logrosDetalle = logros.Select(l =>
        {
            Logros.TryGetValue(l.Codigo, out var info);
            return new
            {
                l.Codigo,
                l.FechaObtenido,
                Nombre = info.Nombre ?? l.Codigo,
                Descripcion = info.Descripcion ?? "",
                Emoji = info.Emoji ?? "🏆"
            };
        });

        return Ok(new
        {
            progresos,
            logros = logrosDetalle,
            rachaActual = usuario?.RachaActual ?? 0,
            maximaRacha = usuario?.MaximaRacha ?? 0,
            xp = usuario?.Xp ?? 0
        });
    }

    [HttpPost("sesion")]
    public async Task<IActionResult> GuardarSesion([FromBody] SesionRequest req)
    {
        var progreso = await _db.Progresos.FirstOrDefaultAsync(p =>
            p.UsuarioId == UserId && p.Apertura == req.Apertura && p.Variante == req.Variante && p.Color == req.Color);

        if (progreso == null)
        {
            progreso = new ProgresoApertura { UsuarioId = UserId, Apertura = req.Apertura, Variante = req.Variante, Color = req.Color };
            _db.Progresos.Add(progreso);
        }

        progreso.Intentos += req.Intentos;
        progreso.Aciertos += req.Aciertos;
        progreso.Sesiones++;
        if (req.Intentos > 0 && req.Aciertos == req.Intentos)
            progreso.SesionesPerfectas++;
        progreso.UltimaSesion = DateTime.UtcNow;

        // Actualizar racha
        var usuario = await _db.Usuarios.FindAsync(UserId);
        if (usuario != null)
        {
            var hoy = DateTime.UtcNow.Date;
            var ultimaFecha = usuario.UltimaActividad?.Date;
            if (ultimaFecha == null || ultimaFecha < hoy.AddDays(-1))
                usuario.RachaActual = 1;
            else if (ultimaFecha < hoy)
                usuario.RachaActual++;
            usuario.UltimaActividad = DateTime.UtcNow;
            if (usuario.RachaActual > usuario.MaximaRacha)
                usuario.MaximaRacha = usuario.RachaActual;

            var hoyOnly = DateOnly.FromDateTime(hoy);
            if (!await _db.ActividadesDiarias.AnyAsync(a => a.UsuarioId == UserId && a.Fecha == hoyOnly))
                _db.ActividadesDiarias.Add(new ActividadDiaria { UsuarioId = UserId, Fecha = hoyOnly });

            // XP: 10 por sesión + 1 por acierto
            usuario.Xp += 10 + req.Aciertos;
        }

        await _db.SaveChangesAsync();

        var nuevosLogros = await ComprobarLogros(req);
        return Ok(new { progreso, nuevosLogros, rachaActual = usuario?.RachaActual ?? 0, xp = usuario?.Xp ?? 0 });
    }

    private async Task<List<object>> ComprobarLogros(SesionRequest req)
    {
        var nuevos = new List<object>();
        var existentes = await _db.Logros.Where(l => l.UsuarioId == UserId).Select(l => l.Codigo).ToListAsync();

        var totalAciertos = await _db.Progresos.Where(p => p.UsuarioId == UserId).SumAsync(p => p.Aciertos);
        var totalSesiones = await _db.Progresos.Where(p => p.UsuarioId == UserId).SumAsync(p => p.Sesiones);
        var aperturasDistintas = await _db.Progresos.Where(p => p.UsuarioId == UserId).Select(p => p.Apertura).Distinct().CountAsync();

        var candidatos = new List<(string codigo, bool condicion)>
        {
            ("PRIMERA_APERTURA",    totalSesiones >= 1),
            ("PRECISION_100",       req.Intentos > 0 && req.Aciertos == req.Intentos),
            ("DIEZ_APERTURAS",      aperturasDistintas >= 10),
            ("CINCUENTA_ACIERTOS",  totalAciertos >= 50),
            ("CIEN_ACIERTOS",       totalAciertos >= 100),
            ("QUINIENTOS_ACIERTOS", totalAciertos >= 500),
            ("CONTRARRELOJ_LIMPIO", req.Modo == "contrarreloj" && req.Timeouts == 0 && req.Intentos > 0),
            ("CINCO_SESIONES",      totalSesiones >= 5),
            ("VEINTE_SESIONES",     totalSesiones >= 20),
            ("ADIVINA_PERFECTO",    req.Modo == "adivinar" && req.Aciertos == 5 && req.Intentos == 5),
        };

        foreach (var (codigo, condicion) in candidatos)
        {
            if (condicion && !existentes.Contains(codigo))
            {
                _db.Logros.Add(new LogroUsuario { UsuarioId = UserId, Codigo = codigo });
                if (Logros.TryGetValue(codigo, out var info))
                    nuevos.Add(new { codigo, info.Nombre, info.Descripcion, info.Emoji });
            }
        }

        await _db.SaveChangesAsync();
        return nuevos;
    }
    [HttpPost("torneo")]
    public async Task<IActionResult> GuardarTorneo([FromBody] TorneoRequest req)
    {
        // Actualizar racha
        var usuario = await _db.Usuarios.FindAsync(UserId);
        if (usuario != null)
        {
            var hoy = DateTime.UtcNow.Date;
            var ultimaFecha = usuario.UltimaActividad?.Date;
            if (ultimaFecha == null || ultimaFecha < hoy.AddDays(-1)) usuario.RachaActual = 1;
            else if (ultimaFecha < hoy) usuario.RachaActual++;
            usuario.UltimaActividad = DateTime.UtcNow;
            if (usuario.RachaActual > usuario.MaximaRacha) usuario.MaximaRacha = usuario.RachaActual;

            var hoyOnly = DateOnly.FromDateTime(hoy);
            if (!await _db.ActividadesDiarias.AnyAsync(a => a.UsuarioId == UserId && a.Fecha == hoyOnly))
                _db.ActividadesDiarias.Add(new ActividadDiaria { UsuarioId = UserId, Fecha = hoyOnly });

            // XP: 20 por torneo + 30 si ganó
            usuario.Xp += req.Ganado ? 50 : 20;
        }
        await _db.SaveChangesAsync();

        var nuevos = new List<object>();
        var existentes = await _db.Logros.Where(l => l.UsuarioId == UserId).Select(l => l.Codigo).ToListAsync();
        var totalTorneos = await _db.Logros.CountAsync(l => l.UsuarioId == UserId && l.Codigo == "PRIMER_TORNEO");
        // Contar torneos completados usando un campo auxiliar en logros no es ideal;
        // usamos ProgresoApertura con Apertura="__torneo__" como contador
        var contadorTorneos = await _db.Progresos.FirstOrDefaultAsync(p => p.UsuarioId == UserId && p.Apertura == "__torneo__");
        if (contadorTorneos == null)
        {
            contadorTorneos = new ProgresoApertura { UsuarioId = UserId, Apertura = "__torneo__", Variante = null };
            _db.Progresos.Add(contadorTorneos);
        }
        contadorTorneos.Sesiones++;
        if (req.Ganado) contadorTorneos.Aciertos++;
        await _db.SaveChangesAsync();

        // Maestros ganados: guardamos en Variante el nombre del maestro
        if (req.Ganado)
        {
            var maestroKey = $"__torneo__{req.Maestro}";
            if (!await _db.Progresos.AnyAsync(p => p.UsuarioId == UserId && p.Apertura == maestroKey))
            {
                _db.Progresos.Add(new ProgresoApertura { UsuarioId = UserId, Apertura = maestroKey, Sesiones = 1 });
                await _db.SaveChangesAsync();
            }
        }
        var maestrosGanados = await _db.Progresos.CountAsync(p => p.UsuarioId == UserId && p.Apertura.StartsWith("__torneo__") && p.Apertura != "__torneo__");

        var candidatos = new List<(string codigo, bool condicion)>
        {
            ("PRIMER_TORNEO",        contadorTorneos.Sesiones >= 1),
            ("PRIMER_TORNEO_GANADO", req.Ganado && contadorTorneos.Aciertos >= 1),
            ("CINCO_TORNEOS",        contadorTorneos.Sesiones >= 5),
            ("TORNEO_PERFECTO",      req.Ganado && req.RondasPerdidas == 0),
            ("VENCE_TODOS_MAESTROS", maestrosGanados >= 8),
            ("TORNEO_BALA",          req.Ganado && req.MinutosPorRonda <= 2),
        };

        foreach (var (codigo, condicion) in candidatos)
        {
            if (condicion && !existentes.Contains(codigo))
            {
                _db.Logros.Add(new LogroUsuario { UsuarioId = UserId, Codigo = codigo });
                if (Logros.TryGetValue(codigo, out var info))
                    nuevos.Add(new { codigo, info.Nombre, info.Descripcion, info.Emoji });
            }
        }
        await _db.SaveChangesAsync();
        return Ok(new { nuevosLogros = nuevos, rachaActual = usuario?.RachaActual ?? 0 });
    }

    [HttpGet("calendario")]
    public async Task<IActionResult> GetCalendario()
    {
        var desde = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-364));
        var dias = await _db.ActividadesDiarias
            .Where(a => a.UsuarioId == UserId && a.Fecha >= desde)
            .Select(a => a.Fecha.ToString("yyyy-MM-dd"))
            .ToListAsync();
        return Ok(dias);
    }

    [HttpPost("partida")]
    public async Task<IActionResult> GuardarPartida([FromBody] PartidaJugadaRequest req)
    {
        _db.PartidasJugadas.Add(new PartidaJugada
        {
            UsuarioId = UserId,
            Maestro = req.Maestro,
            Resultado = req.Resultado,
            Pgn = req.Pgn,
            TotalMovimientos = req.TotalMovimientos,
            EsTorneo = req.EsTorneo,
            ColorJugador = req.ColorJugador,
        });
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("partidas")]
    public async Task<IActionResult> GetPartidas([FromQuery] string? maestro, [FromQuery] string? resultado, [FromQuery] bool? esTorneo)
    {
        var query = _db.PartidasJugadas.Where(p => p.UsuarioId == UserId);
        if (!string.IsNullOrEmpty(maestro)) query = query.Where(p => p.Maestro == maestro);
        if (!string.IsNullOrEmpty(resultado)) query = query.Where(p => p.Resultado == resultado);
        if (esTorneo.HasValue) query = query.Where(p => p.EsTorneo == esTorneo.Value);

        var partidas = await query
            .OrderByDescending(p => p.FechaJugada)
            .Select(p => new { p.Id, p.Maestro, p.Resultado, p.TotalMovimientos, p.FechaJugada, p.Pgn, p.EsTorneo, p.ColorJugador })
            .ToListAsync();
        return Ok(partidas);
    }

    [HttpGet("/api/clasificacion")]
    [AllowAnonymous]
    public async Task<IActionResult> GetClasificacion()
    {
        var top = await _db.Usuarios
            .OrderByDescending(u => u.Xp)
            .Take(50)
            .Select(u => new {
                u.Id, u.Username, u.Xp, u.RachaActual, u.MaximaRacha, u.Foto,
                logros = _db.Logros.Count(l => l.UsuarioId == u.Id),
                partidas = _db.PartidasJugadas.Count(p => p.UsuarioId == u.Id),
                victorias = _db.PartidasJugadas.Count(p => p.UsuarioId == u.Id && p.Resultado == "win")
            })
            .ToListAsync();
        return Ok(top);
    }

    [HttpPost("foto")]
    public async Task<IActionResult> SubirFoto([FromBody] FotoRequest req)
    {
        var usuario = await _db.Usuarios.FindAsync(UserId);
        if (usuario == null) return NotFound();
        usuario.Foto = req.FotoBase64;
        await _db.SaveChangesAsync();
        return Ok(new { foto = usuario.Foto });
    }

    [HttpPost("logro")]
    public async Task<IActionResult> RegistrarLogro([FromBody] LogroManualRequest req)
    {
        var existentes = await _db.Logros.Where(l => l.UsuarioId == UserId).Select(l => l.Codigo).ToListAsync();
        if (existentes.Contains(req.Codigo)) return Ok(new { nuevo = false });
        _db.Logros.Add(new LogroUsuario { UsuarioId = UserId, Codigo = req.Codigo });
        await _db.SaveChangesAsync();
        Logros.TryGetValue(req.Codigo, out var info);
        return Ok(new { nuevo = true, codigo = req.Codigo, info.Nombre, info.Emoji, info.Descripcion });
    }
}

public record SesionRequest(string Apertura, string? Variante, string Color, int Intentos, int Aciertos, string Modo = "aprender", int Timeouts = 0);
public record TorneoRequest(string Maestro, bool Ganado, int RondasPerdidas, int MinutosPorRonda);
public record PartidaJugadaRequest(string Maestro, string Resultado, string Pgn, int TotalMovimientos, bool EsTorneo = false, string ColorJugador = "white");
public record FotoRequest(string FotoBase64);
public record LogroManualRequest(string Codigo);
