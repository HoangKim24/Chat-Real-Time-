using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models;

public class ChatServer
{
    [Key]
    public int ChatServerId { get; set; }

    [Required]
    [MaxLength(200)]
    public string ServerName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? IconUrl { get; set; }

    public int OwnerId { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<ChatChannel> Channels { get; set; } = new List<ChatChannel>();
}