using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models;

public class ChatChannel
{
    [Key]
    public int ChatChannelId { get; set; }

    public int ServerId { get; set; }

    [Required]
    [MaxLength(200)]
    public string ChannelName { get; set; } = string.Empty;

    public int Type { get; set; }
}