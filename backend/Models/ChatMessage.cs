using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models;

public class ChatMessage
{
    [Key]
    public int ChatMessageId { get; set; }

    public int ConversationId { get; set; }

    public int SenderUserId { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool IsEdited { get; set; }
}