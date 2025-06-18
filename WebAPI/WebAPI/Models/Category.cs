using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        public string? Name { get; set; } 

        public virtual ICollection<Property>? Properties { get; set; }
    }
}
