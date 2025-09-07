using ChoreMaster.Data;
using Microsoft.EntityFrameworkCore;

public class ChoreManagementService : IChoreManagementService
{
    private readonly ILogger<ChoreManagementService> _logger;
    private readonly ChoreMasterDbContext _context;
    private readonly IUserManagementService _userManagementService;

    public ChoreManagementService(ILogger<ChoreManagementService> logger, ChoreMasterDbContext context, IUserManagementService userManagementService)
    {
        _logger = logger;
        _context = context;
        _userManagementService = userManagementService;
    }

    public async Task<IEnumerable<Chore>> GetAllChoresAsync()
    {
        _logger.LogInformation("Fetching all chores from the database.");
        return await _context.Chores.ToListAsync();
    }

    public async Task<Chore?> GetChoreByIdAsync(int id)
    {
        _logger.LogInformation("Fetching chore with ID {ChoreId} from the database.", id);
        var chore = await _context.Chores.FindAsync(id);

        if (chore is null)
        {
            throw new ArgumentException("Chore not found.");
        }
        return chore;
    }

    public async Task<Chore> CreateChoreAsync(ChoreDto choreDto)
    {
        _logger.LogInformation("Creating a new chore with title {Title}.", choreDto.Name);
        if (choreDto?.AssignedToUserID is not null)
        {
            int userId = (int)choreDto?.AssignedToUserID!;
            var user = await _userManagementService.GetUserByIdAsync(userId);
            if (user is not null)
            {

                var chore = new Chore(choreDto.Name, choreDto.Threshold, user, choreDto.IsReassignedable);
                _context.Chores.Add(chore);
                await _context.SaveChangesAsync();
                return chore;
            }
            else
            {
                throw new ArgumentException("Assigned user not found.");
            }
        }
        else
        {
            throw new ArgumentException("Invalid chore data or user not found.");
        }
    }

    public async Task<string> CompleteChoreAsync(int choreId, int fromUserId, int toUserId)
    {
        var fromUser = await _userManagementService.GetUserByIdAsync(fromUserId);
        var toUser = await _userManagementService.GetUserByIdAsync(toUserId);
        var chore = await _context.Chores.FindAsync(choreId);

        if (fromUser is null || toUser is null || chore is null)
        {
            throw new ArgumentException("User or chore not found.");
        }

        if (chore is null)
        {
            throw new ArgumentException("Chore not found.");
        }

        if (fromUser.ActiveChores.Contains(chore) == false)
        {
            throw new ArgumentException("The user does not have this chore assigned.");
        }

        fromUser.ActiveChores.Remove(chore);
        toUser.ActiveChores.Add(chore);

        var choreHistory = new ChoreHistory(fromUser, $"Chore '{chore.Name}' completed by {fromUser.Username} and reassigned to {toUser.Username}.");

        _context.ChoreHistories.Add(choreHistory);
        await _context.SaveChangesAsync();
        return choreHistory.Message;
    }

}

