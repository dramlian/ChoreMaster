public interface IChoreManagementService
{
    Task<IEnumerable<Chore>> GetAllChoresAsync();
    Task<IEnumerable<Chore>> GetChoresByUserIdAsync(int userId);
    Task<Chore?> GetChoreByIdAsync(int id);
    Task<Chore> CreateChoreAsync(ChoreDto choreDto);
    Task<Chore?> UpdateChoreAsync(int id, ChoreDto chore);
    Task<string> CompleteChoreAsync(int choreId, int fromUserId, int? toUserId);
    Task<int> DeleteChoreAsync(int id);
}