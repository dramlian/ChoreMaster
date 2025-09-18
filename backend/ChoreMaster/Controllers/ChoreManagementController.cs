using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/chores")]
[Authorize]
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
    [Route("all/{userId}")]
    public async Task<ActionResult<IEnumerable<Chore>>> GetChoresByUserId(int userId)
    {
        return Ok(await _choreManagementService.GetChoresByUserIdAsync(userId));
    }

    [HttpGet]
    [Route("{id}/history")]
    public async Task<ActionResult<IEnumerable<ChoreHistory>>> GetChoreHistory(int id)
    {
        return Ok(await _choreManagementService.GetChoreHistoryAsync(id));
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult<Chore>> CreateChore(ChoreDto choreDto)
    {
        return await _choreManagementService.CreateChoreAsync(choreDto);
    }

    [HttpPut]
    [Route("update/{id}")]
    public async Task<ActionResult<Chore>> UpdateChore(int id, ChoreUpdateDto chore)
    {
        return Ok(await _choreManagementService.UpdateChoreAsync(id, chore));
    }

    [HttpPut]
    [Route("complete")]
    public async Task<ActionResult> CompleteChore([FromBody] CompleteChoreRequestDto request)
    {
        return Ok(await _choreManagementService.CompleteChoreAsync(request.ChoreId, request.FromUserId, request.ToUserId));
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> DeleteChore(int id)
    {
        return Ok(await _choreManagementService.DeleteChoreAsync(id));
    }
}
