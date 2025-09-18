# -------------------------------
# 1. Build stage
# -------------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy all code and publish
COPY . ./
RUN dotnet publish -c Release -o /app /p:UseAppHost=false

# -------------------------------
# 2. Runtime stage
# -------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app ./

# Run as non-root user
USER 1001

# Expose port your API uses
EXPOSE 8080

# Run the app
ENTRYPOINT ["dotnet", "ChoreMaster.dll"]
