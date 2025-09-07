public class ChoreHistory
{
    public required User User { get; set; }
    public required DateTime DateTime { get; set; }
    public string? Message { get; set; }

    public ChoreHistory(User user, DateTime dateTime, string? message = null)
    {
        User = user;
        DateTime = dateTime;
        Message = message;
    }
}