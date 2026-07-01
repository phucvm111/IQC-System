using IQC.Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "https://localhost:5173", "https://192.168.0.20:5173", "http://192.168.0.20:5173") // Vite default ports + local IP
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Ensure the database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // We drop it to ensure it's completely empty and new based on user request
    // context.Database.EnsureDeleted();
    context.Database.EnsureCreated();

    // Seed Admin user
    if (!context.Users.Any())
    {
        context.Users.Add(new IQC.Backend.Models.User
        {
            Username = "admin",
            PasswordHash = "123456", // Simple password since we are just starting
            Role = "Admin"
        });
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".glb"] = "model/gltf-binary";
provider.Mappings[".gltf"] = "model/gltf+json";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});

app.UseAuthorization();
app.MapControllers();

app.Run();
