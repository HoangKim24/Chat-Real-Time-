using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Api.Data;
using ChatApp.Api.Models;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ChatDbContext _context;

    public AdminController(ChatDbContext context)
    {
        _context = context;
    }

    [HttpGet("top-products")]
    public async Task<ActionResult<IEnumerable<Product>>> GetTopProducts()
    {
        return await _context.Products
            .OrderByDescending(p => p.SalesCount)
            .Take(5)
            .ToListAsync();
    }

    [HttpGet("vouchers")]
    public async Task<ActionResult<IEnumerable<Voucher>>> GetVouchers()
    {
        return await _context.Vouchers.ToListAsync();
    }

    [HttpPost("vouchers")]
    public async Task<ActionResult<Voucher>> CreateVoucher(Voucher voucher)
    {
        _context.Vouchers.Add(voucher);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetVouchers), new { id = voucher.VoucherId }, voucher);
    }
    
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetSystemStats()
    {
        var userCount = 12458; // Mocked for now to match UI
        var activeClusters = 842;
        var trafficVol = "1.2M";
        
        return new { 
            GlobalUsers = userCount, 
            ActiveClusters = activeClusters, 
            TrafficVolume = trafficVol,
            ComputeLoad = 45
        };
    }
}
