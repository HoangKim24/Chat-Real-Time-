using ChatApp.Api.Data;
using ChatApp.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var envConnectionString = Environment.GetEnvironmentVariable("ORACLE_DB_CONNECTION");
var appsettingsConnectionString = builder.Configuration.GetConnectionString("OracleDb");
var connectionString = !string.IsNullOrWhiteSpace(envConnectionString)
    ? envConnectionString
    : appsettingsConnectionString;

var hasValidOracleConnection = !string.IsNullOrWhiteSpace(connectionString)
    && !connectionString.Contains("YOUR_USER", StringComparison.OrdinalIgnoreCase)
    && !connectionString.Contains("YOUR_PASSWORD", StringComparison.OrdinalIgnoreCase)
    && !connectionString.Contains("YOUR_HOST", StringComparison.OrdinalIgnoreCase)
    && !connectionString.Contains("YOUR_SERVICE", StringComparison.OrdinalIgnoreCase);

builder.Services.AddDbContext<ChatDbContext>(options =>
{
    if (hasValidOracleConnection)
    {
        options.UseOracle(connectionString);
        return;
    }

    options.UseInMemoryDatabase("ChatAppDev");
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        corsBuilder =>
        {
            corsBuilder
                .WithOrigins(
                    "http://localhost:5173",
                    "https://localhost:5173",
                    "http://127.0.0.1:5173",
                    "https://127.0.0.1:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ChatDbContext>();

    try
    {
        if (context.Database.IsRelational())
        {
            context.Database.Migrate();
            Console.WriteLine("Oracle database connected and migrated successfully.");
        }
        else
        {
            await context.Database.EnsureCreatedAsync();
            Console.WriteLine("Using in-memory database for local development.");
        }

        await SeedAuthUserAsync(context);
        await SeedConversationAsync(context);
        await SeedServerAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization failed: {ex.Message}");
        throw;
    }
}

app.Run();

static async Task SeedAuthUserAsync(ChatDbContext context)
{
    const string demoEmail = "demo@chatflow.vn";

    var hasDemoUser = await context.AuthUsers.AnyAsync(user => user.Email == demoEmail);
    if (hasDemoUser)
    {
        return;
    }

    var now = DateTime.UtcNow;
    context.AuthUsers.Add(new AuthUser
    {
        Email = demoEmail,
        Username = "demo",
        Password = "Demo@123456",
        DisplayName = "Demo User",
        AvatarUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString("Demo User")}&background=06b6d4&color=fff",
        Bio = "Tài khoản demo để xem UI/UX",
        CreatedAt = now,
        UpdatedAt = now
    });

    await context.SaveChangesAsync();
}

static async Task SeedConversationAsync(ChatDbContext context)
{
    var now = DateTime.UtcNow;

    var generalConversation = await context.Conversations.FirstOrDefaultAsync(conversation => conversation.Name == "General");
    if (generalConversation is null)
    {
        generalConversation = new ChatConversation
        {
            Name = "General",
            Type = 1,
            CreatedAt = now
        };

        context.Conversations.Add(generalConversation);
        await context.SaveChangesAsync();
    }

    var demoUser = await context.AuthUsers.FirstOrDefaultAsync(user => user.Email == "demo@chatflow.vn");
    if (demoUser is null)
    {
        return;
    }

    var hasWelcomeMessage = await context.Messages.AnyAsync(message => message.ConversationId == generalConversation.ChatConversationId);
    if (hasWelcomeMessage)
    {
        return;
    }

    context.Messages.Add(new ChatMessage
    {
        ConversationId = generalConversation.ChatConversationId,
        SenderUserId = demoUser.AuthUserId,
        Content = "Chào mừng bạn đến với General.",
        CreatedAt = now,
        UpdatedAt = now,
        IsEdited = false
    });

    await context.SaveChangesAsync();
}

static async Task SeedServerAsync(ChatDbContext context)
{
    var demoUser = await context.AuthUsers.FirstOrDefaultAsync(user => user.Email == "demo@chatflow.vn");
    if (demoUser is null)
    {
        return;
    }

    var now = DateTime.UtcNow;
    var server = await context.Servers.FirstOrDefaultAsync(item => item.ServerName == "hoibaodom");
    if (server is null)
    {
        server = new ChatServer
        {
            ServerName = "hoibaodom",
            Description = "Workspace mặc định",
            IconUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString("hoibaodom")}&background=7c3aed&color=fff",
            OwnerId = demoUser.AuthUserId,
            CreatedAt = now
        };

        context.Servers.Add(server);
        await context.SaveChangesAsync();
    }

    var hasMember = await context.ServerMembers.AnyAsync(member => member.ServerId == server.ChatServerId && member.UserId == demoUser.AuthUserId);
    if (!hasMember)
    {
        context.ServerMembers.Add(new ChatServerMember
        {
            ServerId = server.ChatServerId,
            UserId = demoUser.AuthUserId
        });
        await context.SaveChangesAsync();
    }

    var hasChannel = await context.Channels.AnyAsync(channel => channel.ServerId == server.ChatServerId);
    if (!hasChannel)
    {
        context.Channels.Add(new ChatChannel
        {
            ServerId = server.ChatServerId,
            ChannelName = "general",
            Type = 0
        });
        await context.SaveChangesAsync();
    }
}
