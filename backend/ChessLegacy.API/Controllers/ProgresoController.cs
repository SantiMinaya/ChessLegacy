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
    };

    public ProgresoController(ChessLegacyContext db) => _db = db;

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetProgreso()
    {
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

        return Ok(new { progresos, logros = logrosDetalle });
    }

    [HttpPost("sesion")]
    public async Task<IActionResult> GuardarSesion([FromBody] SesionRequest req)
    {
        var progreso = await _db.Progresos.FirstOrDefaultAsync(p =>
            p.UsuarioId == UserId && p.Apertura == req.Apertura && p.Variante == req.Variante);

        if (progreso == null)
        {
            progreso = new ProgresoApertura { UsuarioId = UserId, Apertura = req.Apertura, Variante = req.Variante };
            _db.Progresos.Add(progreso);
        }

        progreso.Intentos += req.Intentos;
        progreso.Aciertos += req.Aciertos;
        progreso.Sesiones++;
        progreso.UltimaSesion = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var nuevosLogros = await ComprobarLogros(req);
        return Ok(new { progreso, nuevosLogros });
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
}

public record SesionRequest(string Apertura, string? Variante, int Intentos, int Aciertos, string Modo = "aprender", int Timeouts = 0);
