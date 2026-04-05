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
    }
}
