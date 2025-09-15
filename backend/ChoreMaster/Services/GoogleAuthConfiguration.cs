using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using ChoreMaster.Data;


public static class GoogleAuthConfiguration
{
    public static IServiceCollection AddGoogleJwtAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = "https://accounts.google.com";
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuers = new[] { "https://accounts.google.com", "accounts.google.com" },
                    ValidateAudience = true,
                    ValidAudiences = new[] {
                       Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
                    },
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"JWT Authentication failed: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = async context =>
                    {
                        var claimsIdentity = context.Principal?.Identity as ClaimsIdentity;
                        var email = claimsIdentity?.FindFirst(ClaimTypes.Email)?.Value
                                    ?? claimsIdentity?.FindFirst("email")?.Value;

                        var iatClaim = claimsIdentity?.FindFirst("iat")?.Value;
                        var expClaim = claimsIdentity?.FindFirst("exp")?.Value;

                        if (string.IsNullOrEmpty(iatClaim) || string.IsNullOrEmpty(expClaim))
                        {
                            context.Fail("Missing iat or exp in token");
                            return;
                        }

                        var iat = DateTimeOffset.FromUnixTimeSeconds(long.Parse(iatClaim));
                        var exp = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim));
                        var now = DateTimeOffset.UtcNow;

                        if (now < iat || now > exp)
                        {
                            context.Fail("Token is expired or not yet valid");
                            return;
                        }

                        if (string.IsNullOrEmpty(email))
                        {
                            context.Fail("No email claim found");
                            return;
                        }

                        var db = context.HttpContext.RequestServices.GetRequiredService<ChoreMasterDbContext>();
                        var userExists = await db.Users.AnyAsync(u => u.Email == email);

                        if (!userExists)
                        {
                            context.Fail("User not authorized");
                        }
                    }
                };
            });

        return services;
    }
}
