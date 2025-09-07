using ChoreMaster.Data;
using Microsoft.EntityFrameworkCore;

public class UserManagementService : IUserManagementService
{
    private readonly ILogger<UserManagementService> _logger;
    private readonly ChoreMasterDbContext _context;

    public UserManagementService(ILogger<UserManagementService> logger, ChoreMasterDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        _logger.LogInformation("Fetching all users from the database.");
        return await _context.Users.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        _logger.LogInformation("Fetching user with ID {UserId} from the database.", id);
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> CreateUserAsync(UserDto userDto)
    {
        _logger.LogInformation("Creating a new user with username {Username}.", userDto.Username);
        var user = new User(userDto.Username, userDto.Email);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}