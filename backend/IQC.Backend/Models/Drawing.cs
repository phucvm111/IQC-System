using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IQC.Backend.Models
{
    public class Drawing
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        [Required]
        [StringLength(50)]
        public required string Revision { get; set; }

        [Required]
        public required string FileUrl { get; set; }

        [Required]
        [StringLength(10)]
        public required string FileType { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
