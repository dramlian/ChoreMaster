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
    public ICollection<ChoreHistory> History { get; set; }
    public TimeSpan TimeLeft => LastCompleted.AddDays(Threshold) - DateTime.Now;

    public Chore()
    {
        Name = string.Empty;
        History = new List<ChoreHistory>();
    }

    public Chore(string name, int threshold, User userAssigned, bool isReassignedable)
    {
        Name = name;
        Threshold = threshold;
        AssignedTo = userAssigned;
        IsReassignedable = isReassignedable;
        LastCompleted = DateTime.UtcNow;
        History = new List<ChoreHistory>();
    }
}

public class ChoreDto : ChoreUpdateDto
{
    public int? AssignedToUserID { get; set; }

    public ChoreDto() { }

    public ChoreDto(Chore chore)
    {
        AssignedToUserID = chore?.AssignedTo?.Id;
        Name = chore?.Name;
        Threshold = chore?.Threshold;
        IsReassignedable = chore?.IsReassignedable;
    }
}

public class ChoreUpdateDto
{
    public string? Name { get; set; }
    public int? Threshold { get; set; }
    public bool? IsReassignedable { get; set; }
}

public class CompleteChoreRequestDto
{
    public required int ChoreId { get; set; }
    public required int FromUserId { get; set; }
    public int? ToUserId { get; set; }
}