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

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppSurveysController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppSurveysController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/AppSurveys
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppSurvey>>> GetAppSurvey()
        {
            return await _context.AppSurvey.ToListAsync();
        }

        // GET: api/AppSurveys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppSurvey>> GetAppSurvey(int id)
        {
            var appSurvey = await _context.AppSurvey.FindAsync(id);

            if (appSurvey == null)
            {
                return NotFound();
            }

            return appSurvey;
        }

        // PUT: api/AppSurveys/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppSurvey(int id, AppSurvey appSurvey)
        {
            if (id != appSurvey.Id)
            {
                return BadRequest();
            }

            _context.Entry(appSurvey).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppSurveyExists(id))
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

        // POST: api/AppSurveys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AppSurvey>> PostAppSurvey([FromBody] AppSurvey appSurvey)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.AppSurvey.Add(appSurvey);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppSurvey", new { id = appSurvey.Id }, appSurvey);
        }

        // DELETE: api/AppSurveys/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppSurvey(int id)
        {
            var appSurvey = await _context.AppSurvey.FindAsync(id);
            if (appSurvey == null)
            {
                return NotFound();
            }

            _context.AppSurvey.Remove(appSurvey);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppSurveyExists(int id)
        {
            return _context.AppSurvey.Any(e => e.Id == id);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllSurveys()
        {
            var surveys = await _context.AppSurvey
                .Include(s => s.User)
                .Select(s => new
                {
                    s.Id,
                    s.UserId,
                    FullName = s.User.FullName,
                    Email = s.User.Email,
                    s.LikesMost,
                    s.Improvements,
                    s.Rating,         
                    s.WouldRecommend,
                    s.SubmittedAt
                })
                .ToListAsync();

            return Ok(surveys);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetSurveyByUserId(int userId)
        {
            var survey = await _context.AppSurvey.FirstOrDefaultAsync(s => s.UserId == userId);
            if (survey == null) return NotFound();
            return Ok(survey);
        }
        [HttpGet("average-rating")]
        public async Task<IActionResult> GetAverageRating()
        {
            var ratings = await _context.AppSurvey
                .Where(s => s.Rating > 0)
                .Select(s => s.Rating)
                .ToListAsync();

            if (ratings.Count == 0)
                return Ok(new { averageRating = 0 });

            var averageRating = ratings.Average();
            return Ok(new { averageRating = Math.Round(averageRating, 1) });
        }

    }
}
