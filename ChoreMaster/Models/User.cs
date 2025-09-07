using System.ComponentModel.DataAnnotations;

public class User
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<Chore>? ActiveChores { get; set; }

    public User(string username, string email, DateTime createdAt)
    {
        Username = username;
        Email = email;
        CreatedAt = createdAt;
    }
}