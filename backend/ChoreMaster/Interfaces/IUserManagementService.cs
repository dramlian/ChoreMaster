public interface IUserManagementService
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<User> CreateUserAsync(UserDto userDto);
    Task<int> DeleteUserAsync(int id);
}