using IQC.Backend.Data;
using IQC.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IQC.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost("{id}/step")]
        public async Task<IActionResult> UploadStepFile(int id, [FromForm] IFormFile file)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();

            if (file == null || file.Length == 0) return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "drawings");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{id}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            product.DrawingCode = fileName;
            await _context.SaveChangesAsync();

            return Ok(new { product.Id, product.DrawingCode });
        }

        public class ScanRequest
        {
            public string QrData { get; set; } = string.Empty;
        }

        [HttpPost("scan")]
        public async Task<IActionResult> ScanProduct([FromBody] ScanRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.QrData))
            {
                return BadRequest("QR Data is empty.");
            }

            // Parse QR data
            // Format expected: MEC2512004, 2512004-CV1-007, 2, INTECH, NK-06-26-0547, 16/Jun/2026, N/A
            var parts = request.QrData.Split(',').Select(p => p.Trim()).ToArray();

            var partNumber = parts.Length > 0 ? parts[0] : "UNKNOWN";
            var drawingCode = parts.Length > 1 ? parts[1] : null;
            var quantity = parts.Length > 2 ? parts[2] : null;
            var manufacturer = parts.Length > 3 ? parts[3] : null;
            var lotNumber = parts.Length > 4 ? parts[4] : null;
            var targetDate = parts.Length > 5 ? parts[5] : null;
            var statusNote = parts.Length > 6 ? parts[6] : null;

            // Check if product already exists
            var existingProduct = await _context.Products
                .FirstOrDefaultAsync(p => p.PartNumber == partNumber && p.LotNumber == lotNumber);

            if (existingProduct != null)
            {
                return Ok(existingProduct);
            }

            // Create new Product since it doesn't exist
            var newProduct = new Product
            {
                PartNumber = partNumber,
                DrawingCode = drawingCode,
                Quantity = quantity,
                Manufacturer = manufacturer,
                LotNumber = lotNumber,
                TargetDate = targetDate,
                StatusNote = statusNote,
                RecordCode = $"IQC{DateTime.Now:yyMMddHHmmss}",
                Description = $"Scanned product batch: {lotNumber ?? "Unknown"}"
            };

            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();

            // Fetch the newly created product to return
            return Ok(newProduct);
        }

        public class UpdateStatusRequest
        {
            public string Status { get; set; } = string.Empty;
            public string InspectorName { get; set; } = string.Empty;
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateProductStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            product.StatusNote = request.Status;
            if (!string.IsNullOrEmpty(request.InspectorName)) 
            {
                product.InspectorName = request.InspectorName;
            }
            await _context.SaveChangesAsync();

            return Ok(product);
        }
    }
}
