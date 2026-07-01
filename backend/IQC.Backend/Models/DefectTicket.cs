using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IQC.Backend.Models
{
    public class DefectTicket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int InspectionRecordId { get; set; }

        [ForeignKey(nameof(InspectionRecordId))]
        public InspectionRecord? InspectionRecord { get; set; }

        [Required]
        [StringLength(100)]
        public required string VendorName { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "New";
    }
}
