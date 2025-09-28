using Microsoft.EntityFrameworkCore;
using ChoreMaster.Data;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

var builder = WebApplication.CreateBuilder(args);

var clientId = builder.Configuration["ClientId"];
var keyVaultUri = builder.Configuration["KEYVAULT_URI"];
var frontendUrl = builder.Configuration["FrontendUrl"];

var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = clientId
});

var client = new SecretClient(new Uri(keyVaultUri!), credential);
KeyVaultSecret dbSecret = await client.GetSecretAsync("DbPassword");
string connectionString = dbSecret.Value;

// Add services to the container
builder.Services.AddDbContext<ChoreMasterDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(frontendUrl!)
            .AllowAnyHeader()
            .AllowAnyMethod();
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
