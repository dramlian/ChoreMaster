using Microsoft.EntityFrameworkCore;
using ChoreMaster.Data;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    Env.Load();
}

// Add services to the container
builder.Services.AddDbContext<ChoreMasterDbContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")));

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
builder.Services.AddSwaggerGen();

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
