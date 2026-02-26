using ChessLegacy.API.Models;
using ChessLegacy.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ChessLegacy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PosicionesController : ControllerBase
{
    private readonly PosicionRepository _repository;

    public PosicionesController(PosicionRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Posicion>> GetById(int id)
    {
        var posicion = await _repository.GetByIdAsync(id);
        return posicion == null ? NotFound() : Ok(posicion);
    }
}
