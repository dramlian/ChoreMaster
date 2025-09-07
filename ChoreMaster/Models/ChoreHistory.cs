using System.ComponentModel.DataAnnotations;

public class ChoreHistory
{
    [Key]
    public int Id { get; set; }
    public DateTime DateTime { get; set; }
    public string Message { get; set; }

    public ChoreHistory()
    {
        DateTime = DateTime.UtcNow;
        Message = string.Empty;
    }

    public ChoreHistory(string message)
    {
        DateTime = DateTime.UtcNow;
        Message = message;
    }
}