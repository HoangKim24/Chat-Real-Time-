using ChatApp.Api.Data;
using ChatApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServerController : ControllerBase
{
    private readonly ChatDbContext _context;

    public ServerController(ChatDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-servers")]
    public async Task<ActionResult<IEnumerable<ServerResponse>>> GetServers()
    {
        var servers = await _context.Servers
            .AsNoTracking()
            .Include(server => server.Channels)
            .OrderBy(server => server.ChatServerId)
            .Select(server => new ServerResponse
            {
                Id = server.ChatServerId,
                ServerName = server.ServerName,
                Description = server.Description,
                IconUrl = server.IconUrl,
                OwnerId = server.OwnerId,
                Channels = server.Channels
                    .OrderBy(channel => channel.ChatChannelId)
                    .Select(channel => new ChannelResponse
                    {
                        Id = channel.ChatChannelId,
                        ChannelName = channel.ChannelName,
                        Type = channel.Type,
                        ServerId = channel.ServerId
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(servers);
    }

    [HttpGet("get-server-members/{serverId:int}")]
    public async Task<ActionResult<IEnumerable<ServerMemberResponse>>> GetServerMembers(int serverId)
    {
        var members = await _context.ServerMembers
            .AsNoTracking()
            .Where(member => member.ServerId == serverId)
            .Join(_context.AuthUsers.AsNoTracking(), member => member.UserId, user => user.AuthUserId, (member, user) => new ServerMemberResponse
            {
                Id = user.AuthUserId,
                UserId = user.AuthUserId,
                Username = user.Username,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl
            })
            .ToListAsync();

        members = members.DistinctBy(member => member.UserId).ToList();
        return Ok(members);
    }

    [HttpPost("create-server")]
    public async Task<ActionResult<ServerResponse>> CreateServer([FromBody] CreateServerRequest request)
    {
        var email = GetEmailFromToken();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var owner = await _context.AuthUsers.FirstOrDefaultAsync(user => user.Email == email);
        if (owner is null)
        {
            return Unauthorized(new { message = "Không tìm thấy người dùng." });
        }

        var serverName = request.ServerName?.Trim();
        if (string.IsNullOrWhiteSpace(serverName))
        {
            return BadRequest(new { message = "Tên workspace không được để trống." });
        }

        var now = DateTime.UtcNow;
        var server = new ChatServer
        {
            ServerName = serverName,
            Description = request.Description?.Trim(),
            IconUrl = BuildIconUrl(serverName),
            OwnerId = owner.AuthUserId,
            CreatedAt = now
        };

        _context.Servers.Add(server);
        await _context.SaveChangesAsync();

        _context.ServerMembers.Add(new ChatServerMember
        {
            ServerId = server.ChatServerId,
            UserId = owner.AuthUserId
        });

        await _context.SaveChangesAsync();

        return Ok(await MapServerAsync(server.ChatServerId));
    }

    [HttpPost("add-member")]
    public async Task<ActionResult> AddMember([FromBody] AddMemberRequest request)
    {
        var existing = await _context.ServerMembers.AnyAsync(member => member.ServerId == request.ServerId && member.UserId == request.UserId);
        if (existing)
        {
            return Ok(new { success = true });
        }

        _context.ServerMembers.Add(new ChatServerMember
        {
            ServerId = request.ServerId,
            UserId = request.UserId
        });

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpPost("create-channel")]
    public async Task<ActionResult<ChannelResponse>> CreateChannel([FromBody] CreateChannelRequest request)
    {
        var channelName = request.ChannelName?.Trim();
        if (string.IsNullOrWhiteSpace(channelName))
        {
            return BadRequest(new { message = "Tên kênh không được để trống." });
        }

        var serverExists = await _context.Servers.AnyAsync(server => server.ChatServerId == request.ServerId);
        if (!serverExists)
        {
            return NotFound(new { message = "Không tìm thấy workspace." });
        }

        var channel = new ChatChannel
        {
            ServerId = request.ServerId,
            ChannelName = channelName,
            Type = request.Type
        };

        _context.Channels.Add(channel);
        await _context.SaveChangesAsync();

        return Ok(new ChannelResponse
        {
            Id = channel.ChatChannelId,
            ChannelName = channel.ChannelName,
            Type = channel.Type,
            ServerId = channel.ServerId
        });
    }

    private async Task<ServerResponse> MapServerAsync(int serverId)
    {
        var server = await _context.Servers
            .AsNoTracking()
            .Include(item => item.Channels)
            .FirstAsync(item => item.ChatServerId == serverId);

        return new ServerResponse
        {
            Id = server.ChatServerId,
            ServerName = server.ServerName,
            Description = server.Description,
            IconUrl = server.IconUrl,
            OwnerId = server.OwnerId,
            Channels = server.Channels
                .OrderBy(channel => channel.ChatChannelId)
                .Select(channel => new ChannelResponse
                {
                    Id = channel.ChatChannelId,
                    ChannelName = channel.ChannelName,
                    Type = channel.Type,
                    ServerId = channel.ServerId
                })
                .ToList()
        };
    }

    private string? GetEmailFromToken()
    {
        var authorizationHeader = Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(authorizationHeader) || !authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var token = authorizationHeader[7..].Trim();
        if (!token.StartsWith("demo-auth:", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return token[10..].Trim();
    }

    private static string BuildIconUrl(string name)
    {
        return $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(name)}&background=7c3aed&color=fff";
    }
}

public sealed class ServerResponse
{
    public int Id { get; set; }
    public string ServerName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public int OwnerId { get; set; }
    public List<ChannelResponse> Channels { get; set; } = new();
}

public sealed class ChannelResponse
{
    public int Id { get; set; }
    public string ChannelName { get; set; } = string.Empty;
    public int Type { get; set; }
    public int ServerId { get; set; }
}

public sealed class ServerMemberResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
}

public sealed class CreateServerRequest
{
    public string ServerName { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public sealed class AddMemberRequest
{
    public int ServerId { get; set; }
    public int UserId { get; set; }
}

public sealed class CreateChannelRequest
{
    public string ChannelName { get; set; } = string.Empty;
    public int Type { get; set; }
    public int ServerId { get; set; }
}
