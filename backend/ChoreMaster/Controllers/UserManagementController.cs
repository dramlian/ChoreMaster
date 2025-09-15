using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserManagementController : ControllerBase
{
    private readonly IUserManagementService _userManagementService;

    public UserManagementController(IUserManagementService userManagementService)
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

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        return Ok(await _userManagementService.DeleteUserAsync(id));
    }
}