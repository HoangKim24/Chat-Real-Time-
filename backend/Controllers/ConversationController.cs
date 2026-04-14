using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Api.Data;
using ChatApp.Api.Models;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConversationController : ControllerBase
{
    private readonly ChatDbContext _context;

    public ConversationController(ChatDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-conversations")]
    public async Task<ActionResult<IEnumerable<ConversationResponse>>> GetConversations()
    {
        var conversations = await _context.Conversations
            .AsNoTracking()
            .OrderByDescending(conversation => conversation.CreatedAt)
            .Select(conversation => new ConversationResponse
            {
                Id = conversation.ChatConversationId,
                Name = conversation.Name,
                Type = conversation.Type,
                CreatedAt = conversation.CreatedAt,
                LastMessage = _context.Messages
                    .Where(message => message.ConversationId == conversation.ChatConversationId)
                    .OrderByDescending(message => message.CreatedAt)
                    .Select(message => message.Content)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(conversations);
    }

    [HttpGet("get-conversation-members/{conversationId:int}")]
    public async Task<ActionResult<IEnumerable<ConversationMemberResponse>>> GetConversationMembers(int conversationId)
    {
        var members = await _context.Messages
            .AsNoTracking()
            .Where(message => message.ConversationId == conversationId)
            .Join(_context.AuthUsers.AsNoTracking(), message => message.SenderUserId, user => user.AuthUserId, (message, user) => new ConversationMemberResponse
            {
                Id = user.AuthUserId,
                UserId = user.AuthUserId,
                Username = user.Username,
                DisplayName = user.DisplayName,
                AvatarUrl = user.AvatarUrl
            })
            .ToListAsync();

        members = members
            .DistinctBy(member => member.UserId)
            .ToList();

        return Ok(members);
    }

    [HttpPost("create-conversation")]
    public async Task<ActionResult<ConversationResponse>> CreateConversation([FromBody] CreateConversationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Tên hội thoại không được để trống." });
        }

        var now = DateTime.UtcNow;
        var conversation = new ChatConversation
        {
            Name = request.Name.Trim(),
            Type = request.Type,
            CreatedAt = now
        };

        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();

        return Ok(new ConversationResponse
        {
            Id = conversation.ChatConversationId,
            Name = conversation.Name,
            Type = conversation.Type,
            CreatedAt = conversation.CreatedAt,
            LastMessage = null
        });
    }

    [HttpPost("join-conversation")]
    public ActionResult JoinConversation([FromBody] JoinConversationRequest request)
    {
        return Ok(new { success = true });
    }

    [HttpPost("leave-conversation")]
    public ActionResult LeaveConversation([FromBody] LeaveConversationRequest request)
    {
        return Ok(new { success = true });
    }
}

public sealed class ConversationResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? LastMessage { get; set; }
}

public sealed class ConversationMemberResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
}

public sealed class CreateConversationRequest
{
    public string Name { get; set; } = string.Empty;
    public int Type { get; set; }
}

public sealed class JoinConversationRequest
{
    public int ConversationId { get; set; }
    public int UserId { get; set; }
}

public sealed class LeaveConversationRequest
{
    public int ConversationId { get; set; }
    public int UserId { get; set; }
}