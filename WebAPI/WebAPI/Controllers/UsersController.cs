using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Models.DTOs;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly JwtSettings _jwtSettings;

        public UsersController(AppDbContext context, IWebHostEnvironment env, IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _env = env;
            _jwtSettings = jwtOptions.Value;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromForm] User user, IFormFile? profileImage)
        {
            user.UserId = id;

            if (profileImage != null && profileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/users");
                Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = Guid.NewGuid() + Path.GetExtension(profileImage.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileImage.CopyToAsync(stream);
                }

                user.ProfileImage = "/images/users/" + uniqueFileName;
            }
            else
            {
                var existingUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);
                if (existingUser != null)
                {
                    user.ProfileImage = existingUser.ProfileImage;
                }
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser([FromForm] User user, IFormFile? profileImage)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("Email already exists.");
            }
            if (profileImage != null && profileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/users");
                Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = Guid.NewGuid() + Path.GetExtension(profileImage.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileImage.CopyToAsync(stream);
                }

                user.ProfileImage = "/images/users/" + uniqueFileName;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "images/users");
                var filePath = Path.Combine(uploadsFolder, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/images/users/{file.FileName}";
                return Ok(new { imageUrl });
            }

            return BadRequest("Invalid file.");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);

            if (request.Email == "admin@livein.com" && request.Password == "Admin123!")
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim(ClaimTypes.Name, "admin"),
                new Claim(ClaimTypes.Email, request.Email),
                new Claim(ClaimTypes.Role, "Admin")
            }),
                    Expires = DateTime.UtcNow.AddHours(3),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new
                {
                    token = tokenString,
                    user = new
                    {
                        UserId = 0,
                        FullName = "Administrator",
                        Email = request.Email,
                        Role = "Admin"
                    }
                });
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null || user.Password != request.Password)
            {
                return Unauthorized("Invalid email or password");
            }

            var userTokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        }),
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var userToken = tokenHandler.CreateToken(userTokenDescriptor);
            var userTokenString = tokenHandler.WriteToken(userToken);

            return Ok(new
            {
                token = userTokenString,
                user = new
                {
                    user.UserId,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }
        [HttpPost("log-interaction")]
        [Authorize]
        public IActionResult LogInteraction([FromBody] InteractionDto dto)
        {
            var interaction = new Interaction
            {
                BuyerId = dto.BuyerId,
                SellerId = dto.SellerId,
                Timestamp = dto.Timestamp,
                Method = dto.Method
            };

            _context.Interactions.Add(interaction);
            _context.SaveChanges();

            return Ok();
        }
    }
}
