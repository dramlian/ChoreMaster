using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ChoreMaster.Data;
using Microsoft.AspNetCore.Http;

namespace ChoreMaster.Tests;

public class TestSetupFixture : IAsyncLifetime
{
    public PostgreSqlTestcontainer? Container { get; private set; }
    public ServiceProvider? Provider { get; private set; }

    public async Task InitializeAsync()
    {
        // Start PostgreSQL container
        Container = new TestcontainersBuilder<PostgreSqlTestcontainer>()
            .WithDatabase(new PostgreSqlTestcontainerConfiguration
            {
                Database = "testdb",
                Username = "postgres",
                Password = "postgres"
            })
            .WithImage("postgres:15-alpine")
            .WithCleanUp(true)
            .Build();

        await Container.StartAsync();

        // Setup DI
        var services = new ServiceCollection();

        services.AddLogging(builder => builder.AddConsole());

        services.AddDbContext<ChoreMasterDbContext>(options =>
            options.UseNpgsql(Container.ConnectionString));

        services.AddScoped<IUserManagementService, UserManagementService>();
        services.AddScoped<IChoreManagementService, ChoreManagementService>();

        Provider = services.BuildServiceProvider();

        // Apply migrations
        using var scope = Provider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ChoreMasterDbContext>();
        await db.Database.MigrateAsync();
    }

    public IChoreManagementService? GetChoreManagementService()
    {
        return Provider?.GetRequiredService<IChoreManagementService>() ?? default;
    }

    public IUserManagementService? GetUserManagementService()
    {
        return Provider?.GetRequiredService<IUserManagementService>() ?? default;
    }

    public async Task DisposeAsync()
    {
        if (Container is not null) await Container.DisposeAsync();
        if (Provider is not null) await Provider.DisposeAsync();
    }
}

