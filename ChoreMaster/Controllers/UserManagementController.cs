using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChoreMaster.Data;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/users")]
public class UserManagementController : ControllerBase
{
    private readonly ChoreMasterDbContext _context;

    public UserManagementController(ChoreMasterDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Route("all")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        return Ok(await _context.Users.ToListAsync());
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<UserDto>> CreateUser(UserDto userDto)
    {

        var user = new User(userDto.Username, userDto.Email);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateUser), new { id = user.Id }, userDto);
    }
}