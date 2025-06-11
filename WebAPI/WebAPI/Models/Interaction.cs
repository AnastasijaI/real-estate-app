namespace WebAPI.Models
{
    public class Interaction
    {
        public int InteractionId { get; set; }
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Method { get; set; }
    }
}
