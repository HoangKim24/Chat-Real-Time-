using Microsoft.EntityFrameworkCore;
using ChatApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure database provider
var connectionString = builder.Configuration.GetConnectionString("OracleDb");
var hasOracleConnection = !string.IsNullOrWhiteSpace(connectionString)
  && !connectionString.Contains("YOUR_USER", StringComparison.OrdinalIgnoreCase)
  && !connectionString.Contains("YOUR_PASSWORD", StringComparison.OrdinalIgnoreCase)
  && !connectionString.Contains("YOUR_HOST", StringComparison.OrdinalIgnoreCase)
  && !connectionString.Contains("YOUR_SERVICE", StringComparison.OrdinalIgnoreCase);

builder.Services.AddDbContext<ChatDbContext>(options =>
{
    if (hasOracleConnection)
    {
        options.UseOracle(connectionString);
    }
    else
    {
        options.UseInMemoryDatabase("ChatAppApiDev");
    }
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enable CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

// Ensure database is created / migrated
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ChatDbContext>();
    try
    {
        if (hasOracleConnection)
        {
            context.Database.Migrate();
            Console.WriteLine("✅ Oracle Database connected and migrated successfully!");
        }
        else
        {
            context.Database.EnsureCreated();
            Console.WriteLine("✅ Using in-memory database for development.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database connection failed: {ex.Message}");
    }
}

app.Run();
