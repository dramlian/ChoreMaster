using Microsoft.AspNetCore.Mvc;

namespace ChoreMaster.Controllers;

[ApiController]
[Route("api/chores")]
public class ChoreManagementController : ControllerBase
{
    private readonly ILogger<ChoreManagementController> _logger;

    public ChoreManagementController(ILogger<ChoreManagementController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetChores()
    {
        // Placeholder for fetching chores from a data source
        var chores = new List<object>
        {
            new { Name = "Take out trash", AssignedTo = "Alice", LastCompleted = DateTime.Now.AddDays(-3), Threshold = 7 },
            new { Name = "Wash dishes", AssignedTo = "Bob", LastCompleted = DateTime.Now.AddDays(-1), Threshold = 1 }
        };

        return Ok(chores);
    }
}