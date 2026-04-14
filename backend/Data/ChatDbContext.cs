using Microsoft.EntityFrameworkCore;
using ChatApp.Api.Models;

namespace ChatApp.Api.Data;

public class ChatDbContext : DbContext
{
    public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Voucher> Vouchers { get; set; }
    public DbSet<AuthUser> AuthUsers { get; set; }
    public DbSet<ChatServer> Servers { get; set; }
    public DbSet<ChatChannel> Channels { get; set; }
    public DbSet<ChatServerMember> ServerMembers { get; set; }
    public DbSet<ChatConversation> Conversations { get; set; }
    public DbSet<ChatMessage> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Oracle uses uppercase table/column names by default
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("PRODUCTS");
            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.ProductId).HasColumnName("PRODUCT_ID");
            entity.Property(e => e.Name).HasColumnName("NAME").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasColumnName("DESCRIPTION").HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnName("PRICE").HasColumnType("NUMBER(18,2)");
            entity.Property(e => e.StockQuantity).HasColumnName("STOCK_QUANTITY");
            entity.Property(e => e.SalesCount).HasColumnName("SALES_COUNT");
            entity.Property(e => e.Category).HasColumnName("CATEGORY").HasMaxLength(100);
            entity.Property(e => e.ImageUrl).HasColumnName("IMAGE_URL").HasMaxLength(500);
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.ToTable("VOUCHERS");
            entity.HasKey(e => e.VoucherId);
            entity.Property(e => e.VoucherId).HasColumnName("VOUCHER_ID");
            entity.Property(e => e.Code).HasColumnName("CODE").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Description).HasColumnName("DESCRIPTION").HasMaxLength(500);
            entity.Property(e => e.DiscountAmount).HasColumnName("DISCOUNT_AMOUNT").HasColumnType("NUMBER(18,2)");
            entity.Property(e => e.DiscountPercentage).HasColumnName("DISCOUNT_PERCENTAGE").HasColumnType("NUMBER(5,2)");
            entity.Property(e => e.ExpiryDate).HasColumnName("EXPIRY_DATE");
            entity.Property(e => e.IsActive).HasColumnName("IS_ACTIVE");
            entity.Property(e => e.UsageLimit).HasColumnName("USAGE_LIMIT");
            entity.Property(e => e.UsageCount).HasColumnName("USAGE_COUNT");
        });

        modelBuilder.Entity<AuthUser>(entity =>
        {
            entity.ToTable("AUTH_USERS");
            entity.HasKey(e => e.AuthUserId);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.AuthUserId).HasColumnName("AUTH_USER_ID");
            entity.Property(e => e.Email).HasColumnName("EMAIL").HasMaxLength(256).IsRequired();
            entity.Property(e => e.Username).HasColumnName("USERNAME").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Password).HasColumnName("PASSWORD").HasMaxLength(256).IsRequired();
            entity.Property(e => e.DisplayName).HasColumnName("DISPLAY_NAME").HasMaxLength(150);
            entity.Property(e => e.AvatarUrl).HasColumnName("AVATAR_URL").HasMaxLength(500);
            entity.Property(e => e.Bio).HasColumnName("BIO").HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasColumnName("CREATED_AT");
            entity.Property(e => e.UpdatedAt).HasColumnName("UPDATED_AT");
        });

        modelBuilder.Entity<ChatServer>(entity =>
        {
            entity.ToTable("CHAT_SERVERS");
            entity.HasKey(e => e.ChatServerId);
            entity.Property(e => e.ChatServerId).HasColumnName("CHAT_SERVER_ID");
            entity.Property(e => e.ServerName).HasColumnName("SERVER_NAME").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasColumnName("DESCRIPTION").HasMaxLength(500);
            entity.Property(e => e.IconUrl).HasColumnName("ICON_URL").HasMaxLength(500);
            entity.Property(e => e.OwnerId).HasColumnName("OWNER_ID");
            entity.Property(e => e.CreatedAt).HasColumnName("CREATED_AT");
        });

        modelBuilder.Entity<ChatChannel>(entity =>
        {
            entity.ToTable("CHAT_CHANNELS");
            entity.HasKey(e => e.ChatChannelId);
            entity.Property(e => e.ChatChannelId).HasColumnName("CHAT_CHANNEL_ID");
            entity.Property(e => e.ServerId).HasColumnName("SERVER_ID");
            entity.Property(e => e.ChannelName).HasColumnName("CHANNEL_NAME").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Type).HasColumnName("TYPE");

            entity.HasOne<ChatServer>()
                .WithMany(server => server.Channels)
                .HasForeignKey(channel => channel.ServerId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChatServerMember>(entity =>
        {
            entity.ToTable("CHAT_SERVER_MEMBERS");
            entity.HasKey(e => e.ChatServerMemberId);
            entity.Property(e => e.ChatServerMemberId).HasColumnName("CHAT_SERVER_MEMBER_ID");
            entity.Property(e => e.ServerId).HasColumnName("SERVER_ID");
            entity.Property(e => e.UserId).HasColumnName("USER_ID");
            entity.HasIndex(e => new { e.ServerId, e.UserId }).IsUnique();

            entity.HasOne<ChatServer>()
                .WithMany()
                .HasForeignKey(member => member.ServerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne<AuthUser>()
                .WithMany()
                .HasForeignKey(member => member.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChatConversation>(entity =>
        {
            entity.ToTable("CHAT_CONVERSATIONS");
            entity.HasKey(e => e.ChatConversationId);
            entity.Property(e => e.ChatConversationId).HasColumnName("CHAT_CONVERSATION_ID");
            entity.Property(e => e.Name).HasColumnName("NAME").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Type).HasColumnName("TYPE");
            entity.Property(e => e.CreatedAt).HasColumnName("CREATED_AT");
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.ToTable("CHAT_MESSAGES");
            entity.HasKey(e => e.ChatMessageId);
            entity.Property(e => e.ChatMessageId).HasColumnName("CHAT_MESSAGE_ID");
            entity.Property(e => e.ConversationId).HasColumnName("CONVERSATION_ID");
            entity.Property(e => e.SenderUserId).HasColumnName("SENDER_USER_ID");
            entity.Property(e => e.Content).HasColumnName("CONTENT").HasColumnType("NCLOB").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("CREATED_AT");
            entity.Property(e => e.UpdatedAt).HasColumnName("UPDATED_AT");
            entity.Property(e => e.IsEdited).HasColumnName("IS_EDITED");

            entity.HasOne<AuthUser>()
                .WithMany()
                .HasForeignKey(e => e.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne<ChatConversation>()
                .WithMany()
                .HasForeignKey(e => e.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
