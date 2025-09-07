using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Email), IsUnique = true)]
public class User
{
    [Key]
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Chore>? ActiveChores { get; set; }

    public User()
    {
        Username = string.Empty;
        Email = string.Empty;
        CreatedAt = DateTime.UtcNow;
    }

    public User(string username, string email)
    {
        Username = username;
        Email = email;
        CreatedAt = DateTime.UtcNow;
    }
}

public class UserDto
{
    public required string Username { get; set; }
    public required string Email { get; set; }
}