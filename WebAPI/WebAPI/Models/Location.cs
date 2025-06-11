using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Location
    {
        [Key]
        public int LocationId { get; set; }

        public string? Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        [ForeignKey("Property")]
        public int? PropertyId { get; set; }
        public virtual Property? Property { get; set; }
    }
}
