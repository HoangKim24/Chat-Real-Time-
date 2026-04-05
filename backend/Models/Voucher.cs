using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models;

public class Voucher
{
    [Key]
    public int VoucherId { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public decimal DiscountAmount { get; set; }
    
    public decimal DiscountPercentage { get; set; }
    
    public DateTime ExpiryDate { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public int UsageLimit { get; set; }
    
    public int UsageCount { get; set; }
}
