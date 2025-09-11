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

    public async Task<IEnumerable<Chore>> GetChoresByUserIdAsync(int userId)
    {
        _logger.LogInformation("Fetching chores for user with ID {UserId} from the database.", userId);
        var user = await _userManagementService.GetUserByIdAsync(userId);
        if (user is null)
        {
            throw new ArgumentException("User not found.");
        }
        return await _context.Chores.Where(x => x.AssignedTo != null && x.AssignedTo.Id == userId).ToListAsync();
    }

    public async Task<Chore?> GetChoreByIdAsync(int id)
    {
        _logger.LogInformation("Fetching chore with ID {ChoreId} from the database.", id);
        var chore = await _context.Chores.Include(x => x.AssignedTo).Include(x => x.History).FirstOrDefaultAsync(x => x.Id.Equals(id));

        if (chore is null)
        {
            throw new ArgumentException("Chore not found.");
        }
        return chore;
    }

    public async Task<Chore> CreateChoreAsync(ChoreDto choreDto)
    {
        if (choreDto is null)
            throw new ArgumentNullException(nameof(choreDto));

        if (choreDto.AssignedToUserID is null)
            throw new ArgumentException("User ID is required to assign a chore.");

        if (string.IsNullOrWhiteSpace(choreDto.Name))
            throw new ArgumentException("Chore name is required.");

        if (choreDto.Threshold is null)
            throw new ArgumentException("Threshold is required.");

        if (choreDto.IsReassignedable is null)
            throw new ArgumentException("Reassignable flag is required.");

        var user = await _userManagementService.GetUserByIdAsync(choreDto.AssignedToUserID.Value);
        if (user is null)
            throw new ArgumentException("Assigned user not found.");

        _logger.LogInformation("Creating a new chore with title {Title}.", choreDto.Name);

        var chore = new Chore(
            choreDto.Name,
            choreDto.Threshold.Value,
            user,
            choreDto.IsReassignedable.Value);

        _context.Chores.Add(chore);
        await _context.SaveChangesAsync();

        return chore;
    }


    public async Task<Chore?> UpdateChoreAsync(int id, ChoreUpdateDto chore)
    {
        _logger.LogInformation("Updating chore with ID {ChoreId}.", id);
        var existingChore = await _context.Chores.FindAsync(id);
        if (existingChore is null)
        {
            throw new ArgumentException("Chore not found.");
        }

        if (chore.Name is null || chore.Threshold is null || chore.IsReassignedable is null)
        {
            throw new ArgumentException("Invalid chore data.");
        }
        existingChore.Name = chore.Name;
        existingChore.Threshold = chore.Threshold.Value;
        existingChore.IsReassignedable = chore.IsReassignedable.Value;

        await _context.SaveChangesAsync();
        return existingChore;
    }

    public async Task<string> CompleteChoreAsync(int choreId, int fromUserId, int? toUserId)
    {
        var fromUser = await _userManagementService.GetUserByIdAsync(fromUserId)
                       ?? throw new ArgumentException("User not found.");

        var chore = await GetChoreByIdAsync(choreId)
                    ?? throw new ArgumentException("Chore not found.");

        if (chore.AssignedTo?.Id != fromUserId)
            throw new ArgumentException("Chore is not assigned to this user.");

        User? toUser = null;
        if (chore.IsReassignedable && toUserId.HasValue)
        {
            toUser = await _userManagementService.GetUserByIdAsync(toUserId.Value)
                    ?? throw new ArgumentException("Reassigned user not found.");
            chore.AssignedTo = toUser;
        }

        chore.LastCompleted = DateTime.UtcNow;

        var message = $"Chore '{chore.Name}' completed by {fromUser.Username}" +
                      (toUser is not null ? $" and reassigned to {toUser.Username}." : ".");

        chore.History.Add(new ChoreHistory(message));

        await _context.SaveChangesAsync();
        return message;
    }


    public async Task<int> DeleteChoreAsync(int id)
    {
        var chore = await _context.Chores.FindAsync(id);
        if (chore is null)
        {
            throw new ArgumentException("Chore not found.");
        }

        _context.Chores.Remove(chore);
        await _context.SaveChangesAsync();
        return id;
    }

}

