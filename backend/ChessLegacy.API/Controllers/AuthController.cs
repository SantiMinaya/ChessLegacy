using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ChessLegacy.API.Data;
using ChessLegacy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ChessLegacyContext _db;
    private readonly IConfiguration _config;

    public AuthController(ChessLegacyContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Username) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest("Usuario y contraseña requeridos.");

        if (await _db.Usuarios.AnyAsync(u => u.Username == req.Username))
            return Conflict("El usuario ya existe.");

        var usuario = new Usuario
        {
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };
        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();

        return Ok(new { token = GenerarToken(usuario), username = usuario.Username, id = usuario.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest req)
    {
        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(req.Password, usuario.PasswordHash))
            return Unauthorized("Credenciales incorrectas.");

        return Ok(new { token = GenerarToken(usuario), username = usuario.Username, id = usuario.Id });
    }

    private string GenerarToken(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Username)
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.OldPassword) || string.IsNullOrWhiteSpace(req.NewPassword))
            return BadRequest("Se requieren ambas contraseñas.");

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized("Usuario no autenticado.");

        var userId = int.Parse(userIdClaim);
        var usuario = await _db.Usuarios.FindAsync(userId);
        if (usuario == null)
            return NotFound("Usuario no encontrado.");

        if (!BCrypt.Net.BCrypt.Verify(req.OldPassword, usuario.PasswordHash))
            return BadRequest("La contraseña actual es incorrecta.");

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        await _db.SaveChangesAsync();

        return Ok("Contraseña actualizada con éxito.");
    }
}

public record AuthRequest(string Username, string Password);
public record ChangePasswordRequest(string OldPassword, string NewPassword);
