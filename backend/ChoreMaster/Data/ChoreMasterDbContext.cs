using Microsoft.EntityFrameworkCore;

namespace ChoreMaster.Data;

public class ChoreMasterDbContext : DbContext
{
    public ChoreMasterDbContext(DbContextOptions<ChoreMasterDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Chore> Chores { get; set; }
    public DbSet<ChoreHistory> ChoreHistories { get; set; }
}
