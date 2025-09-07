using Microsoft.AspNetCore.Mvc;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/users")]
public class UserManagementController : ControllerBase
{
    private readonly UserManagementService _userManagementService;

    public UserManagementController(UserManagementService userManagementService)
    {
        _userManagementService = userManagementService;
    }

    [HttpGet]
    [Route("all")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return Ok(await _userManagementService.GetAllUsersAsync());
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<User>> GetUserById(int id)
    {
        return Ok(await _userManagementService.GetUserByIdAsync(id));
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<User>> CreateUser(UserDto userDto)
    {
        return Ok(await _userManagementService.CreateUserAsync(userDto));
    }
}