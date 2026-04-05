using System.Collections.Concurrent;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private static readonly ConcurrentDictionary<string, AuthAccount> Accounts = new(StringComparer.OrdinalIgnoreCase)
    {
        [DemoEmail] = new AuthAccount
        {
            Id = 1,
            Email = DemoEmail,
            Username = "demo",
            Password = DemoPassword,
            DisplayName = "Demo User",
            AvatarUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString("Demo User")}&background=06b6d4&color=fff",
            Bio = "Tài khoản demo để xem UI/UX"
        }
    };

    private static int _nextId = 1;

    private const string DemoEmail = "demo@chatflow.vn";
    private const string DemoPassword = "Demo@123456";

    [HttpPost("login")]
    public ActionResult<AuthResponse> Login([FromBody] AuthLoginRequest request)
    {
        if (!Accounts.TryGetValue(request.Email, out var account) || !string.Equals(account.Password, request.Password, StringComparison.Ordinal))
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
        }

        return Ok(CreateAuthResponse(account));
    }

    [HttpPost("register")]
    public ActionResult<AuthResponse> Register([FromBody] AuthRegisterRequest request)
    {
        if (Accounts.ContainsKey(request.Email))
        {
            return Conflict(new { message = "Email này đã tồn tại." });
        }

        var account = new AuthAccount
        {
            Id = Interlocked.Increment(ref _nextId),
            Email = request.Email,
            Username = request.Username,
            Password = request.Password,
            DisplayName = request.Username,
            AvatarUrl = BuildAvatarUrl(request.Username),
            Bio = string.Empty
        };

        Accounts[account.Email] = account;
        return CreatedAtAction(nameof(Login), CreateAuthResponse(account));
    }

    [HttpPut("update")]
    public ActionResult<AuthUserResponse> UpdateProfile([FromBody] AuthUpdateRequest request)
    {
        var email = GetEmailFromToken();
        if (string.IsNullOrWhiteSpace(email) || !Accounts.TryGetValue(email, out var account))
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

        return Ok(CreateUserResponse(account));
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

    private static AuthResponse CreateAuthResponse(AuthAccount account)
    {
        return new AuthResponse
        {
            Token = BuildToken(account.Email),
            User = CreateUserResponse(account)
        };
    }

    private static AuthUserResponse CreateUserResponse(AuthAccount account)
    {
        return new AuthUserResponse
        {
            Id = account.Id,
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

internal sealed class AuthAccount
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
}