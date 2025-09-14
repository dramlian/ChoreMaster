public interface IChoreManagementService
{
    Task<IEnumerable<Chore>> GetAllChoresAsync();
    Task<IEnumerable<Chore>> GetChoresByUserIdAsync(int userId);
    Task<IEnumerable<ChoreHistory>> GetChoreHistoryAsync(int choreId);
    Task<Chore> CreateChoreAsync(ChoreDto choreDto);
    Task<Chore?> UpdateChoreAsync(int id, ChoreUpdateDto chore);
    Task<Chore> CompleteChoreAsync(int choreId, int fromUserId, int? toUserId);
    Task<int> DeleteChoreAsync(int id);
}