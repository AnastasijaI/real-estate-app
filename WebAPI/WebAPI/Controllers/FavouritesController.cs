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
    public class FavouritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavouritesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Favourites
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Property>>> GetFavourites(int userId)
        {
            return await _context.Favourites
                .Where(f => f.UserId == userId)
                .Include(f => f.Property)
                    .ThenInclude(p => p.Images)
                .Select(f => f.Property)
                .ToListAsync();
        }

        // PUT: api/Favourites/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFavourite(int id, Favourite favourite)
        {
            if (id != favourite.FavouriteId)
            {
                return BadRequest();
            }

            _context.Entry(favourite).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FavouriteExists(id))
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

        // POST: api/Favourites
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Favourite>> PostFavourite(Favourite favourite)
        {
            _context.Favourites.Add(favourite);
            await _context.SaveChangesAsync();

            return Ok(favourite);
        }

        // DELETE: api/Favourites/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavourite(int id)
        {
            var favourite = await _context.Favourites.FindAsync(id);
            if (favourite == null)
            {
                return NotFound();
            }

            _context.Favourites.Remove(favourite);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // DELETE: api/Favourites/remove/{userId}/{propertyId}
        [HttpDelete("remove/{userId}/{propertyId}")]
        public async Task<IActionResult> RemoveFromFavourites(int userId, int propertyId)
        {
            var favourite = await _context.Favourites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

            if (favourite == null)
                return NotFound();

            _context.Favourites.Remove(favourite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FavouriteExists(int id)
        {
            return _context.Favourites.Any(e => e.FavouriteId == id);
        }
    }
}
