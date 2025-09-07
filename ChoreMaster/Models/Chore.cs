public class Chore
{
    public string Name { get; set; }
    public DateTime LastCompleted { get; set; }
    public int Threshold { get; set; }
    public User AssignedTo { get; set; }
    public bool IsReassignedable { get; set; }
    public IEnumerable<ChoreHistory>? History { get; set; }
    public TimeSpan TimeLeft => LastCompleted.AddDays(Threshold) - DateTime.Now;

    public Chore(string name, int threshold, User assignedTo, bool isReassignedable)
    {
        Name = name;
        Threshold = threshold;
        AssignedTo = assignedTo;
        IsReassignedable = isReassignedable;
    }
}