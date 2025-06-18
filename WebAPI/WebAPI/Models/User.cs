using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class User
    {

        [Key]
        public int UserId { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        [Required(ErrorMessage = "FullName is required")]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string? Role { get; set; } 
        public string? ProfileImage { get; set; }
        public string? Contact { get; set; }

        public virtual ICollection<Property>? Properties { get; set; }
        public virtual ICollection<AppSurvey>? AppSurveys { get; set; }

    }
}
