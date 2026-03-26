using System.Security.Claims;
using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/amigos")]
[Authorize]
public class AmigosController : ControllerBase
{
    private readonly ChessLegacyContext _db;
    public AmigosController(ChessLegacyContext db) => _db = db;
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/amigos — lista de amigos aceptados
    [HttpGet]
    public async Task<IActionResult> GetAmigos()
    {
        var amigos = await _db.Amistades
            .Where(a => (a.UsuarioId == UserId || a.AmigoId == UserId) && a.Estado == "aceptada")
            .Select(a => new
            {
                amigoId = a.UsuarioId == UserId ? a.AmigoId : a.UsuarioId,
                username = a.UsuarioId == UserId ? a.Amigo.Username : a.Usuario.Username,
                foto = a.UsuarioId == UserId ? a.Amigo.Foto : a.Usuario.Foto,
                xp = a.UsuarioId == UserId ? a.Amigo.Xp : a.Usuario.Xp,
                rachaActual = a.UsuarioId == UserId ? a.Amigo.RachaActual : a.Usuario.RachaActual,
                ultimaActividad = a.UsuarioId == UserId ? a.Amigo.UltimaActividad : a.Usuario.UltimaActividad,
            })
            .ToListAsync();
        return Ok(amigos);
    }

    // GET /api/amigos/solicitudes — solicitudes pendientes recibidas
    [HttpGet("solicitudes")]
    public async Task<IActionResult> GetSolicitudes()
    {
        var solicitudes = await _db.Amistades
            .Where(a => a.AmigoId == UserId && a.Estado == "pendiente")
            .Select(a => new
            {
                a.Id,
                solicitanteId = a.UsuarioId,
                username = a.Usuario.Username,
                foto = a.Usuario.Foto,
                xp = a.Usuario.Xp,
                a.FechaSolicitud,
            })
            .ToListAsync();
        return Ok(solicitudes);
    }

    // POST /api/amigos/solicitar — enviar solicitud por username
    [HttpPost("solicitar")]
    public async Task<IActionResult> Solicitar([FromBody] SolicitarAmigoRequest req)
    {
        var amigo = await _db.Usuarios.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (amigo == null) return NotFound(new { error = "Usuario no encontrado" });
        if (amigo.Id == UserId) return BadRequest(new { error = "No puedes añadirte a ti mismo" });

        var existe = await _db.Amistades.AnyAsync(a =>
            (a.UsuarioId == UserId && a.AmigoId == amigo.Id) ||
            (a.UsuarioId == amigo.Id && a.AmigoId == UserId));
        if (existe) return BadRequest(new { error = "Ya existe una solicitud o amistad con este usuario" });

        _db.Amistades.Add(new Amistad { UsuarioId = UserId, AmigoId = amigo.Id });
        await _db.SaveChangesAsync();
        return Ok(new { mensaje = $"Solicitud enviada a {amigo.Username}" });
    }

    // POST /api/amigos/aceptar/{id} — aceptar solicitud
    [HttpPost("aceptar/{id:int}")]
    public async Task<IActionResult> Aceptar(int id)
    {
        var solicitud = await _db.Amistades.FindAsync(id);
        if (solicitud == null || solicitud.AmigoId != UserId) return NotFound();
        solicitud.Estado = "aceptada";
        await _db.SaveChangesAsync();
        return Ok(new { mensaje = "Solicitud aceptada" });
    }

    // DELETE /api/amigos/rechazar/{id} — rechazar solicitud
    [HttpDelete("rechazar/{id:int}")]
    public async Task<IActionResult> Rechazar(int id)
    {
        var solicitud = await _db.Amistades.FindAsync(id);
        if (solicitud == null || solicitud.AmigoId != UserId) return NotFound();
        _db.Amistades.Remove(solicitud);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // DELETE /api/amigos/{amigoId} — eliminar amigo
    [HttpDelete("{amigoId:int}")]
    public async Task<IActionResult> Eliminar(int amigoId)
    {
        var amistad = await _db.Amistades.FirstOrDefaultAsync(a =>
            (a.UsuarioId == UserId && a.AmigoId == amigoId) ||
            (a.UsuarioId == amigoId && a.AmigoId == UserId));
        if (amistad == null) return NotFound();
        _db.Amistades.Remove(amistad);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // GET /api/amigos/buscar?q=username — buscar usuarios
    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2) return BadRequest();
        var usuarios = await _db.Usuarios
            .Where(u => u.Username.Contains(q) && u.Id != UserId)
            .Take(10)
            .Select(u => new { u.Id, u.Username, u.Foto, u.Xp })
            .ToListAsync();
        return Ok(usuarios);
    }
}

public record SolicitarAmigoRequest(string Username);
