public interface IChoreManagementService
{
    Task<IEnumerable<Chore>> GetAllChoresAsync();
    Task<Chore?> GetChoreByIdAsync(int id);
    Task<Chore> CreateChoreAsync(ChoreDto choreDto);
    Task<string> CompleteChoreAsync(int choreId, int fromUserId, int toUserId);
    Task<int> DeleteChoreAsync(int id);
}