using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models;

public class ChatConversation
{
    [Key]
    public int ChatConversationId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public int Type { get; set; }

    public DateTime CreatedAt { get; set; }
}