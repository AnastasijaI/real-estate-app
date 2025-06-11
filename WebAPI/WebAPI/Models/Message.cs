using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Message
    {
        [Key]
        public int MessageId { get; set; }

        [Required]
        public string? Content { get; set; }

        public DateTime SentAt { get; set; }

        [ForeignKey("Sender")]
        public int? SenderId { get; set; }
        public virtual User? Sender { get; set; }

        [ForeignKey("Receiver")]
        public int? ReceiverId { get; set; }
        public virtual User? Receiver { get; set; }
    }
}
