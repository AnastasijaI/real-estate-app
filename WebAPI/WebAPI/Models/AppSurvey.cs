namespace WebAPI.Models
{
    public class AppSurvey
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string LikesMost { get; set; }
        public string Improvements { get; set; }
        public double Rating { get; set; }
        public bool WouldRecommend { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.Now;
    }
}
