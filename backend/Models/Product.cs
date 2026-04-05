using System.ComponentModel.DataAnnotations;

namespace ChatApp.Api.Models;

public class Product
{
    [Key]
    public int ProductId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    [Range(0, 1000000000)]
    public decimal Price { get; set; }
    
    public int StockQuantity { get; set; }
    
    public int SalesCount { get; set; }
    
    public string Category { get; set; } = string.Empty;
    
    public string ImageUrl { get; set; } = string.Empty;
}
