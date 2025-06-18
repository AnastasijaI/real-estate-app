namespace WebAPI.Models.DTOs
{
    public class CreatePropertyDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? Rooms { get; set; }
        public double Size { get; set; }
        public string Location { get; set; }
        public bool IsSold { get; set; }
        public int? CategoryId { get; set; }
        public int? UserId { get; set; }
        public List<string>? ImageUrls { get; set; }
    }

}
