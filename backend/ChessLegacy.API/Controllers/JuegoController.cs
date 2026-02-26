using ChessLegacy.API.DTOs;
using ChessLegacy.API.Engine;
using ChessLegacy.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JuegoController : ControllerBase
{
    private readonly MotorPersonalizado _motor;
    private readonly JugadorRepository _repository;

    public JuegoController(MotorPersonalizado motor, JugadorRepository repository)
    {
        _motor = motor;
        _repository = repository;
    }

    [HttpPost("jugar-contra")]
    public async Task<ActionResult<JugarContraResponse>> JugarContra(JugarContraRequest request)
    {
        var jugador = await _repository.GetByIdAsync(request.JugadorId);
        if (jugador == null) return NotFound("Jugador no encontrado");

        var personalidad = ObtenerPersonalidad(jugador.Nombre);
        var (movimiento, comentario) = await _motor.JugarConComentario(request.FEN, personalidad);

        return Ok(new JugarContraResponse
        {
            MovimientoIA = movimiento,
            Comentario = comentario,
            Maestro = jugador.Nombre,
            NuevoFEN = request.FEN // Aquí deberías aplicar el movimiento al FEN
        });
    }

    [HttpGet("personalidades")]
    public ActionResult<List<string>> GetPersonalidades()
    {
        return Ok(PersonalidadAjedrez.TodasLasPersonalidades.Select(p => p.Nombre).ToList());
    }

    private PersonalidadAjedrez ObtenerPersonalidad(string nombre)
    {
        return nombre switch
        {
            "Mikhail Tal" => PersonalidadAjedrez.Tal,
            "José Raúl Capablanca" => PersonalidadAjedrez.Capablanca,
            "Garry Kasparov" => PersonalidadAjedrez.Kasparov,
            _ => PersonalidadAjedrez.Capablanca
        };
    }
}
