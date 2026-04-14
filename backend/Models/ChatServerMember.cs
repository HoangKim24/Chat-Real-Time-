namespace ChatApp.Api.Models;

public class ChatServerMember
{
    public int ChatServerMemberId { get; set; }

    public int ServerId { get; set; }

    public int UserId { get; set; }
}