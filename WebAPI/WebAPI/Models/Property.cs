using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Property
    {
        [Key]
        public int PropertyId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public int? Rooms { get; set; }

        public double Size { get; set; } 

        public string Location { get; set; }

        public bool IsSold { get; set; }

        [ForeignKey("Category")]
        public int? CategoryId { get; set; }
        public virtual Category? Category { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        public virtual User? User { get; set; }

        public virtual ICollection<PropertyImage>? Images { get; set; }
    }
}
