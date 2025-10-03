namespace ChoreMaster.Tests;


public class ChoreMasterTests : IClassFixture<TestSetupFixture>
{

    private readonly IChoreManagementService _choreManagementService;

    private readonly IUserManagementService _userManagerService;

    public ChoreMasterTests(TestSetupFixture fixture)
    {
        _choreManagementService = fixture.GetChoreManagementService() ?? throw new Exception("No ChoreManagementService was setup in the fixture");
        _userManagerService = fixture.GetUserManagementService() ?? throw new Exception("No UserManagementService was setup in the fixture");
    }

    [Fact]
    public async Task CreateDeleteUser()
    {
        var user = await _userManagerService.CreateUserAsync(CreateSampleUserDto());
        Assert.NotNull(user);
        Assert.NotEqual(user?.Id, 0);
        Assert.NotEmpty(await _userManagerService.GetAllUsersAsync());
        await _userManagerService.DeleteUserAsync(user!.Id);
        Assert.Empty(await _userManagerService.GetAllUsersAsync());
    }

    [Fact]
    public async Task CreateDeleteChore()
    {
        var user = await _userManagerService.CreateUserAsync(CreateSampleUserDto());
        Assert.NotNull(user);
        Assert.NotEqual(user?.Id, 0);
        Assert.NotEmpty(await _userManagerService.GetAllUsersAsync());

        var chore = await _choreManagementService.CreateChoreAsync(CreateSampleChoreDto(user!));
        Assert.NotNull(chore);
        Assert.NotEqual(chore?.Id, 0);
        Assert.NotEmpty(await _choreManagementService.GetAllChoresAsync());
    }

    private ChoreDto CreateSampleChoreDto(User user)
    {
        return new ChoreDto(new Chore("Sample Chore", 7, user, true));
    }

    private UserDto CreateSampleUserDto()
    {
        return new UserDto("sample", "sample@sample");
    }
}

