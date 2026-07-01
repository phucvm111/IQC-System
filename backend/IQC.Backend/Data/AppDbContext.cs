using Microsoft.EntityFrameworkCore;

namespace IQC.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Models.Product> Products { get; set; }
        public DbSet<Models.Drawing> Drawings { get; set; }
        public DbSet<Models.InspectionRecord> InspectionRecords { get; set; }
        public DbSet<Models.DefectTicket> DefectTickets { get; set; }
        public DbSet<Models.User> Users { get; set; }
    }
}
