using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Name), IsUnique = true)]
public class Chore
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime LastCompleted { get; set; }
    public int Threshold { get; set; }
    public User? AssignedTo { get; set; }
    public bool IsReassignedable { get; set; }
    public ICollection<ChoreHistory>? History { get; set; }
    public TimeSpan TimeLeft => LastCompleted.AddDays(Threshold) - DateTime.Now;

    public Chore()
    {
        Name = string.Empty;
    }

    public Chore(string name, int threshold, User userAssigned, bool isReassignedable)
    {
        Name = name;
        Threshold = threshold;
        AssignedTo = userAssigned;
        IsReassignedable = isReassignedable;
        LastCompleted = DateTime.UtcNow;
    }
}

public class ChoreDto
{
    public required string Name { get; set; }
    public required int Threshold { get; set; }
    public int? AssignedToUserID { get; set; }
    public required bool IsReassignedable { get; set; }
}