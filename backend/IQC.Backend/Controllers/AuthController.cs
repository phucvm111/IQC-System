using IQC.Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IQC.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username && u.PasswordHash == request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            // Simple token simulation (In a real app, generate JWT here)
            var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{user.Username}:{user.Role}:{DateTime.UtcNow.Ticks}"));

            return Ok(new
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            });
        }
    }
}
