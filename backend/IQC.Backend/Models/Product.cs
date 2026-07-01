using System.ComponentModel.DataAnnotations;

namespace IQC.Backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string PartNumber { get; set; }

        [StringLength(100)]
        public string? DrawingCode { get; set; }

        [StringLength(50)]
        public string? Quantity { get; set; }

        [StringLength(100)]
        public string? Manufacturer { get; set; }

        [StringLength(100)]
        public string? LotNumber { get; set; }

        [StringLength(100)]
        public string? TargetDate { get; set; }

        [StringLength(200)]
        public string? StatusNote { get; set; }

        [StringLength(100)]
        public string? InspectorName { get; set; }

        [StringLength(100)]
        public string? RecordCode { get; set; }

        public string? Description { get; set; }

        public string? ToleranceConfig { get; set; }

        public ICollection<Drawing> Drawings { get; set; } = new List<Drawing>();
        public ICollection<InspectionRecord> InspectionRecords { get; set; } = new List<InspectionRecord>();
    }
}
