using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyImagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PropertyImagesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PropertyImages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyImage>>> GetPropertyImages()
        {
            return await _context.PropertyImages.ToListAsync();
        }

        // GET: api/PropertyImages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyImage>> GetPropertyImage(int id)
        {
            var propertyImage = await _context.PropertyImages.FindAsync(id);

            if (propertyImage == null)
            {
                return NotFound();
            }

            return propertyImage;
        }

        // PUT: api/PropertyImages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPropertyImage(int id, PropertyImage propertyImage)
        {
            if (id != propertyImage.ImageId)
            {
                return BadRequest();
            }

            _context.Entry(propertyImage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyImageExists(id))
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

        // POST: api/PropertyImages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PropertyImage>> PostPropertyImage(PropertyImage propertyImage)
        {
            _context.PropertyImages.Add(propertyImage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPropertyImage", new { id = propertyImage.ImageId }, propertyImage);
        }

        // DELETE: api/PropertyImages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePropertyImage(int id)
        {
            var propertyImage = await _context.PropertyImages.FindAsync(id);
            if (propertyImage == null)
            {
                return NotFound();
            }

            _context.PropertyImages.Remove(propertyImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropertyImageExists(int id)
        {
            return _context.PropertyImages.Any(e => e.ImageId == id);
        }
    }
}
