using ChatApp.Api.Data;
using ChatApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    private readonly ChatDbContext _context;

    public MessageController(ChatDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-messages/conversation/{conversationId:int}")]
    public async Task<ActionResult<IEnumerable<MessageResponse>>> GetMessages(int conversationId)
    {
        var messages = await _context.Messages
            .AsNoTracking()
            .Where(message => message.ConversationId == conversationId)
            .Join(_context.AuthUsers.AsNoTracking(), message => message.SenderUserId, user => user.AuthUserId, (message, user) => new MessageResponse
            {
                Id = message.ChatMessageId,
                SenderId = user.AuthUserId,
                SenderName = user.DisplayName ?? user.Username,
                SenderAvatar = user.AvatarUrl,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                UpdatedAt = message.UpdatedAt,
                ConversationId = message.ConversationId,
                IsEdited = message.IsEdited
            })
            .OrderBy(message => message.CreatedAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost("send-message")]
    public async Task<ActionResult<MessageResponse>> SendMessage([FromBody] SendMessageRequest request)
    {
        if (request.ConversationId is null || request.ConversationId <= 0)
        {
            return BadRequest(new { message = "Hội thoại không hợp lệ." });
        }

        var content = request.Content?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(content))
        {
            return BadRequest(new { message = "Nội dung tin nhắn không được để trống." });
        }

        var senderEmail = GetEmailFromToken();
        if (string.IsNullOrWhiteSpace(senderEmail))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var sender = await _context.AuthUsers.FirstOrDefaultAsync(user => user.Email == senderEmail);
        if (sender is null)
        {
            return Unauthorized(new { message = "Không tìm thấy người dùng." });
        }

        var now = DateTime.UtcNow;
        var message = new ChatMessage
        {
            ConversationId = request.ConversationId.Value,
            SenderUserId = sender.AuthUserId,
            Content = content,
            CreatedAt = now,
            UpdatedAt = now,
            IsEdited = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(await MapMessageAsync(message.ChatMessageId));
    }

    [HttpPut("edit-message")]
    public async Task<ActionResult<MessageResponse>> EditMessage([FromBody] EditMessageRequest request)
    {
        var content = request.Content?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(content))
        {
            return BadRequest(new { message = "Nội dung tin nhắn không được để trống." });
        }

        var senderEmail = GetEmailFromToken();
        if (string.IsNullOrWhiteSpace(senderEmail))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var sender = await _context.AuthUsers.FirstOrDefaultAsync(user => user.Email == senderEmail);
        if (sender is null)
        {
            return Unauthorized(new { message = "Không tìm thấy người dùng." });
        }

        var message = await _context.Messages.FirstOrDefaultAsync(item => item.ChatMessageId == request.MessageId);
        if (message is null)
        {
            return NotFound(new { message = "Không tìm thấy tin nhắn." });
        }

        if (message.SenderUserId != sender.AuthUserId || request.SenderId != sender.AuthUserId)
        {
            return Forbid();
        }

        message.Content = content;
        message.UpdatedAt = DateTime.UtcNow;
        message.IsEdited = true;

        await _context.SaveChangesAsync();

        return Ok(await MapMessageAsync(message.ChatMessageId));
    }

    [HttpDelete("delete-message/{messageId:int}")]
    public async Task<ActionResult> DeleteMessage(int messageId)
    {
        var senderEmail = GetEmailFromToken();
        if (string.IsNullOrWhiteSpace(senderEmail))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var sender = await _context.AuthUsers.FirstOrDefaultAsync(user => user.Email == senderEmail);
        if (sender is null)
        {
            return Unauthorized(new { message = "Không tìm thấy người dùng." });
        }

        var message = await _context.Messages.FirstOrDefaultAsync(item => item.ChatMessageId == messageId);
        if (message is null)
        {
            return NotFound(new { message = "Không tìm thấy tin nhắn." });
        }

        if (message.SenderUserId != sender.AuthUserId)
        {
            return Forbid();
        }

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpGet("read-status/{conversationId:int}")]
    public ActionResult<IEnumerable<object>> GetReadStatuses(int conversationId)
    {
        return Ok(Array.Empty<object>());
    }

    [HttpPost("message-read")]
    public ActionResult MarkMessageRead([FromBody] object request)
    {
        return Ok(new { success = true });
    }

    private async Task<MessageResponse> MapMessageAsync(int messageId)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(message => message.ChatMessageId == messageId)
            .Join(_context.AuthUsers.AsNoTracking(), message => message.SenderUserId, user => user.AuthUserId, (message, user) => new MessageResponse
            {
                Id = message.ChatMessageId,
                SenderId = user.AuthUserId,
                SenderName = user.DisplayName ?? user.Username,
                SenderAvatar = user.AvatarUrl,
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                UpdatedAt = message.UpdatedAt,
                ConversationId = message.ConversationId,
                IsEdited = message.IsEdited
            })
            .FirstAsync();
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
}

public sealed class MessageResponse
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string? SenderName { get; set; }
    public string? SenderAvatar { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? ConversationId { get; set; }
    public bool IsEdited { get; set; }
}

public sealed class SendMessageRequest
{
    public int? ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? ChannelId { get; set; }
    public int? ConversationId { get; set; }
}

public sealed class EditMessageRequest
{
    public int MessageId { get; set; }
    public int SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int ConversationId { get; set; }
}
