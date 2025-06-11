namespace WebAPI.Models.DTOs
{
    public class InteractionDto
    {
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Method { get; set; }
    }
}
