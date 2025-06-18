using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Models.DTOs;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PropertiesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Properties
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
        {
            return await _context.Properties
               .Include(p => p.Images)
               .ToListAsync();
        }

        // GET: api/Properties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetProperty(int id)
        {
            var @property = await _context.Properties
                .Include(p => p.User)
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.PropertyId == id);

            if (@property == null)
            {
                return NotFound();
            }

            return @property;
        }

        // PUT: api/Properties/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProperty(int id, [FromBody] UpdatePropertyDto dto)
        {
            if (id != dto.PropertyId)
                return BadRequest();

            var property = await _context.Properties
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.PropertyId == id);

            if (property == null)
                return NotFound();

            property.Title = dto.Title;
            property.Description = dto.Description;
            property.Price = dto.Price;
            property.Rooms = dto.Rooms;
            property.Size = dto.Size;
            property.Location = dto.Location;
            property.IsSold = dto.IsSold;
            property.CategoryId = dto.CategoryId;
            property.UserId = dto.UserId;

            if (dto.ImageUrls != null)
            {
                var currentImages = property.Images.ToList();

                var newImageUrls = dto.ImageUrls.Select(url => url.StartsWith("/images/properties/")
                    ? url
                    : "/images/properties/" + url).ToList();

                var imagesToKeep = currentImages
                    .Where(img => newImageUrls.Contains(img.ImageUrl))
                    .ToList();

                var imagesToAdd = newImageUrls
                    .Where(url => !imagesToKeep.Any(img => img.ImageUrl == url))
                    .Select(url => new PropertyImage { ImageUrl = url })
                    .ToList();

                _context.PropertyImages.RemoveRange(currentImages.Except(imagesToKeep));
                property.Images = imagesToKeep.Concat(imagesToAdd)
                    .GroupBy(img => img.ImageUrl)
                    .Select(g => g.First())
                    .ToList();
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreateProperty([FromBody] CreatePropertyDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { message = "Invalid model", errors });
            }

            try
            {
                if (dto.ImageUrls == null || !dto.ImageUrls.Any())
                {
                    dto.ImageUrls = new List<string> { "/images/properties/no_image.jpg" };
                }
                var property = new Property
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Price = dto.Price,
                    Rooms = dto.Rooms,
                    Size = dto.Size,
                    Location = dto.Location,
                    IsSold = dto.IsSold,
                    CategoryId = dto.CategoryId,
                    UserId = dto.UserId,
                    Images = dto.ImageUrls?.Select(url => new PropertyImage
                    {
                        ImageUrl = url.StartsWith("/images/properties/")
                             ? url
                             : "/images/properties/" + url
                                        }).ToList()
                };
                Console.WriteLine("CREATING PROPERTY...");
                Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(dto));

                _context.Properties.Add(property);
                await _context.SaveChangesAsync();

                return Ok(property);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating property:");
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        // POST: api/Properties
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Property>> PostProperty(Property @property)
        //{
        //    _context.Properties.Add(@property);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetProperty", new { id = @property.PropertyId }, @property);
        //}

        // DELETE: api/Properties/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var @property = await _context.Properties
                .Include(p => p.Images) 
                .FirstOrDefaultAsync(p => p.PropertyId == id);
            if (@property == null)
            {
                return NotFound();
            }
            _context.PropertyImages.RemoveRange(property.Images); 
            _context.Properties.Remove(@property);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropertyExists(int id)
        {
            return _context.Properties.Any(e => e.PropertyId == id);
        }
    }
}
