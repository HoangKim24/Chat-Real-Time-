using ChatApp.Api.Data;
using ChatApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ChatDbContext _context;

    public AuthController(ChatDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] AuthLoginRequest request)
    {
        var email = NormalizeEmail(request.Email);
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email và mật khẩu không được để trống." });
        }

        var account = await _context.AuthUsers
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email == email);

        if (account is null || !string.Equals(account.Password, request.Password, StringComparison.Ordinal))
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
        }

        return Ok(CreateAuthResponse(account));
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] AuthRegisterRequest request)
    {
        var email = NormalizeEmail(request.Email);
        var username = request.Username?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email, tên người dùng và mật khẩu không được để trống." });
        }

        var existingAccount = await _context.AuthUsers
            .AsNoTracking()
            .AnyAsync(user => user.Email == email);

        if (existingAccount)
        {
            return Conflict(new { message = "Email này đã tồn tại." });
        }

        var now = DateTime.UtcNow;
        var account = new AuthUser
        {
            Email = email,
            Username = username,
            Password = request.Password,
            DisplayName = username,
            AvatarUrl = BuildAvatarUrl(username),
            Bio = string.Empty,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.AuthUsers.Add(account);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Login), CreateAuthResponse(account));
    }

    [HttpPut("update")]
    public async Task<ActionResult<AuthUserResponse>> UpdateProfile([FromBody] AuthUpdateRequest request)
    {
        var email = GetEmailFromToken();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        var account = await _context.AuthUsers.FirstOrDefaultAsync(user => user.Email == email);
        if (account is null)
        {
            return Unauthorized(new { message = "Phiên đăng nhập không hợp lệ." });
        }

        if (request.DisplayName is not null)
        {
            account.DisplayName = request.DisplayName;
        }

        if (request.Bio is not null)
        {
            account.Bio = request.Bio;
        }

        if (request.AvatarUrl is not null)
        {
            account.AvatarUrl = request.AvatarUrl;
        }

        account.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(CreateUserResponse(account));
    }

    private static string NormalizeEmail(string? email)
    {
        return email?.Trim().ToLowerInvariant() ?? string.Empty;
    }

    private string? GetEmailFromToken()
    {
        var authorizationHeader = Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(authorizationHeader) || !authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var token = authorizationHeader[7..].Trim();
        if (!token.StartsWith("demo-auth:", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return token[10..].Trim();
    }

    private static AuthResponse CreateAuthResponse(AuthUser account)
    {
        return new AuthResponse
        {
            Token = BuildToken(account.Email),
            User = CreateUserResponse(account)
        };
    }

    private static AuthUserResponse CreateUserResponse(AuthUser account)
    {
        return new AuthUserResponse
        {
            Id = account.AuthUserId,
            Email = account.Email,
            Username = account.Username,
            DisplayName = account.DisplayName,
            AvatarUrl = account.AvatarUrl,
            Bio = account.Bio
        };
    }

    private static string BuildToken(string email)
    {
        return $"demo-auth:{email}";
    }

    private static string BuildAvatarUrl(string name)
    {
        return $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(name)}&background=06b6d4&color=fff";
    }
}

public sealed class AuthLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public sealed class AuthRegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public sealed class AuthUpdateRequest
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
}

public sealed class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public AuthUserResponse User { get; set; } = new();
}

public sealed class AuthUserResponse
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
}
