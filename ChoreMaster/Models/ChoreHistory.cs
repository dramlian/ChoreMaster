using System.ComponentModel.DataAnnotations;

public class ChoreHistory
{
    [Key]
    public int Id { get; set; }
    public User? User { get; set; }
    public DateTime DateTime { get; set; }
    public string? Message { get; set; }

    public ChoreHistory()
    {
    }

    public ChoreHistory(User user, string? message = null)
    {
        User = user;
        DateTime = DateTime.UtcNow;
        Message = message;
    }
}