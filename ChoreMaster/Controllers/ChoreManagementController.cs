using Microsoft.AspNetCore.Mvc;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/chores")]
public class ChoreManagementController : ControllerBase
{
    private readonly IChoreManagementService _choreManagementService;

    public ChoreManagementController(IChoreManagementService choreManagementService)
    {
        _choreManagementService = choreManagementService;
    }

    [HttpGet]
    [Route("all")]
    public async Task<ActionResult<IEnumerable<Chore>>> GetChores()
    {
        return Ok(await _choreManagementService.GetAllChoresAsync());
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Chore>> GetChoreById(int id)
    {
        return Ok(await _choreManagementService.GetChoreByIdAsync(id));
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<Chore>> CreateChore(ChoreDto choreDto)
    {
        return await _choreManagementService.CreateChoreAsync(choreDto);
    }

    [HttpPost]
    [Route("{choreId}/complete")]
    public async Task<ActionResult> CompleteChore([FromBody] CompleteChoreRequestDto request)
    {
        return Ok(await _choreManagementService.CompleteChoreAsync(request.ChoreId, request.FromUserId, request.ToUserId));
    }
}
