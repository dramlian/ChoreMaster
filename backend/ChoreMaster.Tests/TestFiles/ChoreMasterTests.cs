namespace ChoreMaster.Tests;

public class ChoreMasterTests : IClassFixture<TestSetupFixture>, IAsyncLifetime
{
    private int _defaultChoreThreshold = 7;
    private int _updatedChoreThreshold = 14;
    private string _defaultChoreName = "Sample Chore";
    private string _defaultUsername = "sample";
    private string _defaultUserEmail = "sample@sample";

    private readonly IChoreManagementService _choreManagementService;
    private readonly IUserManagementService _userManagerService;

    public ChoreMasterTests(TestSetupFixture fixture)
    {
        _defaultChoreThreshold = 7;
        _updatedChoreThreshold = 14;
        _defaultChoreName = "Sample Chore";
        _defaultUsername = "sample";
        _defaultUserEmail = "sample@sample";

        _choreManagementService = fixture.GetChoreManagementService() ?? throw new Exception("No ChoreManagementService was setup in the fixture");
        _userManagerService = fixture.GetUserManagementService() ?? throw new Exception("No UserManagementService was setup in the fixture");
    }

    public async Task InitializeAsync()
    {
        await CleanupDatabaseAsync();
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    private async Task CleanupDatabaseAsync()
    {
        var allChores = await _choreManagementService.GetAllChoresAsync();
        foreach (var chore in allChores)
        {
            await _choreManagementService.DeleteChoreAsync(chore.Id);
        }

        var allUsers = await _userManagerService.GetAllUsersAsync();
        foreach (var user in allUsers)
        {
            await _userManagerService.DeleteUserAsync(user.Id);
        }
    }

    [Fact]
    public async Task CreateDeleteUser()
    {
        var user = await CreateFetchAndAssertUserAsync();
        await _userManagerService.DeleteUserAsync(user!.Id);
        Assert.Empty(await _userManagerService.GetAllUsersAsync());
    }

    [Fact]
    public async Task CreateGetDeleteUser()
    {
        var user = await CreateFetchAndAssertUserAsync();

        var fetchedUser = await _userManagerService.GetUserByIdAsync(user!.Id);
        Assert.NotNull(fetchedUser);
        Assert.Equal(user.Id, fetchedUser?.Id);
        Assert.Equal(user.Username, fetchedUser?.Username);
        Assert.Equal(user.Email, fetchedUser?.Email);

        await _userManagerService.DeleteUserAsync(user.Id);
        Assert.Empty(await _userManagerService.GetAllUsersAsync());
    }

    [Fact]
    public async Task CreateDeleteChore()
    {
        User user = await CreateFetchAndAssertUserAsync();
        Chore chore = await CreateFetchAndAssertChoreAsync(user);
        await _choreManagementService.DeleteChoreAsync(chore!.Id);
        Assert.Empty(await _choreManagementService.GetAllChoresAsync());
    }

    [Fact]
    public async Task CreateGetDeleteChore()
    {
        User user = await CreateFetchAndAssertUserAsync();
        Chore chore = await CreateFetchAndAssertChoreAsync(user);

        var fetchedChore = (await _choreManagementService.GetAllChoresAsync()).FirstOrDefault();
        Assert.NotNull(fetchedChore);
        Assert.Equal(chore!.Id, fetchedChore?.Id);
        Assert.Equal(chore.Name, fetchedChore?.Name);
        Assert.Equal(chore.Threshold, fetchedChore?.Threshold);
        Assert.Equal(chore?.AssignedTo?.Id, fetchedChore?.AssignedTo?.Id);
        Assert.Equal(chore?.IsReassignedable, fetchedChore?.IsReassignedable);

        await _choreManagementService.DeleteChoreAsync(chore!.Id);
        Assert.Empty(await _choreManagementService.GetAllChoresAsync());
    }

    [Fact]
    public async Task CreateGetUpdateDeleteChore()
    {
        User user = await CreateFetchAndAssertUserAsync();
        Chore chore = await CreateFetchAndAssertChoreAsync(user);

        var updatedChore = await _choreManagementService.UpdateChoreAsync(chore!.Id, new ChoreUpdateDto
        {
            Name = "Updated Chore",
            Threshold = _updatedChoreThreshold,
            IsReassignedable = false
        });

        Assert.NotNull(updatedChore);
        Assert.Equal(chore.Id, updatedChore?.Id);
        Assert.Equal("Updated Chore", updatedChore?.Name);
        Assert.Equal(_updatedChoreThreshold, updatedChore?.Threshold);
        Assert.Equal(chore?.AssignedTo?.Id, updatedChore?.AssignedTo?.Id);
        Assert.False(updatedChore?.IsReassignedable);
        await _choreManagementService.DeleteChoreAsync(chore!.Id);
        Assert.Empty(await _choreManagementService.GetAllChoresAsync());
    }

    [Fact]
    public async Task CreateCompleteDeleteChore()
    {
        User user = await CreateFetchAndAssertUserAsync();
        Chore chore = await CreateFetchAndAssertChoreAsync(user);

        var completedChore = await _choreManagementService.CompleteChoreAsync(chore!.Id, user!.Id, null);
        Assert.NotNull(completedChore);
        Assert.Equal(chore.Id, completedChore?.Id);

        var history = await _choreManagementService.GetChoreHistoryAsync(chore.Id);
        Assert.NotNull(history);
        Assert.Single(history);
        var historyEntry = history.First();
        Assert.Equal(historyEntry.Message, $"Chore '{chore.Name}' completed by {user.Username}.");

        await _choreManagementService.DeleteChoreAsync(chore!.Id);
        Assert.Empty(await _choreManagementService.GetAllChoresAsync());
    }

    [Fact]
    public async Task CreateCompleteReassignableChore()
    {
        var user1 = await CreateFetchAndAssertUserAsync("user1", "user1@example.com");
        var user2 = await CreateFetchAndAssertUserAsync("user2", "user2@example.com");
        var chore = await CreateFetchAndAssertChoreAsync(user1!);

        var completedChore = await _choreManagementService.CompleteChoreAsync(chore!.Id, user1!.Id, user2!.Id);
        Assert.NotNull(completedChore);
        Assert.Equal(chore.Id, completedChore?.Id);

        var history = await _choreManagementService.GetChoreHistoryAsync(chore.Id);
        Assert.NotNull(history);
        Assert.Single(history);
        var historyEntry = history.First();
        Assert.Equal(historyEntry.Message, $"Chore '{chore.Name}' completed by {user1.Username} and reassigned to {user2.Username}.");

        await _choreManagementService.DeleteChoreAsync(chore!.Id);
        Assert.Empty(await _choreManagementService.GetAllChoresAsync());
    }

    private async Task<User> CreateFetchAndAssertUserAsync(string? name = null, string? email = null)
    {
        var user = await _userManagerService.CreateUserAsync(CreateSampleUserDto(name, email));
        Assert.NotNull(user);
        Assert.True(user?.Id > 0, "User ID should be greater than 0");
        Assert.NotEmpty(await _userManagerService.GetAllUsersAsync());
        return user!;
    }

    private async Task<Chore> CreateFetchAndAssertChoreAsync(User user)
    {
        var chore = await _choreManagementService.CreateChoreAsync(CreateSampleChoreDto(user));
        Assert.NotNull(chore);
        Assert.True(chore?.Id > 0, "Chore ID should be greater than 0");
        Assert.NotEmpty(await _choreManagementService.GetAllChoresAsync());
        return chore!;
    }

    private ChoreDto CreateSampleChoreDto(User user)
    {
        return new ChoreDto(new Chore(_defaultChoreName, _defaultChoreThreshold, user, true));
    }

    private UserDto CreateSampleUserDto(string? name, string? email)
    {
        return new UserDto(name ?? _defaultUsername, email ?? _defaultUserEmail);
    }
}

