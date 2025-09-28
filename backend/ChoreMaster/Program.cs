using Microsoft.EntityFrameworkCore;
using ChoreMaster.Data;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var builder = WebApplication.CreateBuilder(args);

var clientId = "50f6b7ca-1457-477e-b0a6-f3804985c5fc";
var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = clientId
});

var client = new SecretClient(new Uri("https://choremaster-kv-ecd3a326.vault.azure.net/"), credential);
KeyVaultSecret dbSecret = await client.GetSecretAsync("DbPassword");
string connectionString = dbSecret.Value;

// Add services to the container
builder.Services.AddDbContext<ChoreMasterDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://choremaster-frontend.wonderfulpond-00f239f0.westeurope.azurecontainerapps.io"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        // .AllowCredentials();
    });
});


builder.Services.AddGoogleJwtAuth(builder.Configuration);

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ChoreMaster API",
        Version = Environment.GetEnvironmentVariable("deployment_version") ?? "local",
    });
});

builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<IChoreManagementService, ChoreManagementService>();

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
