using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChoreMaster.Data;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/chores")]
public class ChoreManagementController : ControllerBase
{
    private readonly ILogger<ChoreManagementController> _logger;
    private readonly ChoreMasterDbContext _context;

    public ChoreManagementController(ILogger<ChoreManagementController> logger, ChoreMasterDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetChores()
    {
        return Ok(await _context.Chores.ToListAsync());
    }
}