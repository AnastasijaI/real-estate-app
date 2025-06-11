using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImages(List<IFormFile> images)
        {
            if (images == null || !images.Any())
                return BadRequest("No images uploaded.");

            List<string> fileNames = new List<string>();

            string uploadPath = Path.Combine(_env.WebRootPath, "images", "properties");

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            foreach (var image in images)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var fullPath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                fileNames.Add("/images/properties/" + fileName); 
            }

            return Ok(fileNames); 
        }
    }
}
