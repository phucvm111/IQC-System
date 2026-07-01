using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IQC.Backend.Models
{
    public class InspectionRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string RecordCode { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        [Required]
        [StringLength(100)]
        public required string InspectorName { get; set; }

        [Required]
        public DateTime InspectionDate { get; set; } = DateTime.UtcNow;

        public DateTime? ResponseDate { get; set; }

        public ICollection<DefectTicket> DefectTickets { get; set; } = new List<DefectTicket>();
    }
}
