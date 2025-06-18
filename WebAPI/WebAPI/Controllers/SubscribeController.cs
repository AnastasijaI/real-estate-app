using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using WebAPI.Controllers;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscribeController : ControllerBase
    {
        private readonly IConfiguration _config;
        public SubscribeController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public IActionResult Post([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required");

            try
            {
                var smtpClient = new SmtpClient(_config["EmailSettings:SmtpServer"])
                {
                    Port = int.Parse(_config["EmailSettings:Port"]),
                    Credentials = new NetworkCredential(
                         _config["EmailSettings:FromEmail"],
                         _config["EmailSettings:AppPassword"]
                     ),
                     EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_config["EmailSettings:FromEmail"]),
                    Subject = "Thanks for your subscribe",
                    Body = 
                    
                @"Hi there,

                    Thanks for subscribing to LiveIn! 🏡

                    We're excited to have you join our community. 
                    With LiveIn, you can explore the best properties across Macedonia, save your favorites, 
                    and connect directly with sellers or landlords.

                    Stay tuned — we'll keep you updated with the latest listings and features.

                Warm regards,  
                The LiveIn Team",

                    IsBodyHtml = false,
                };
                mailMessage.To.Add(email);

                smtpClient.Send(mailMessage);
                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to send email: " + ex.Message);
            }
        }
    }
}
