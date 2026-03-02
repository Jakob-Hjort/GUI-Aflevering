using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopApi.Data;
using ShopApi.Dtos;
using ShopApi.Models;
using System.Linq;

namespace ShopApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public ProductsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    // GET: /api/products?page=1&pageSize=12  (Get all products + pagination)
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 12)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .OrderBy(p => p.Title);

        var total = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto(
                p.Id,
                p.Title,
                p.Description,
                p.Price,
                p.CategoryId,
                p.Category!.Title,
                p.Images.Select(i => i.Url).ToList()
            ))
            .ToListAsync();

        return Ok(new PagedResult<ProductDto>(page, pageSize, total, items));
    }

    // GET: /api/products/5  (Get single product from ID)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var p = await _db.Products
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p is null) return NotFound();

        return Ok(new ProductDto(
            p.Id,
            p.Title,
            p.Description,
            p.Price,
            p.CategoryId,
            p.Category!.Title,
            p.Images.Select(i => i.Url).ToList()
        ));
    }

    // POST: /api/products  (admin - create product)
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductRequest req)
    {
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == req.CategoryId);
        if (!categoryExists) return BadRequest("CategoryId does not exist.");

        var product = new Product
        {
            Title = req.Title.Trim(),
            Description = req.Description.Trim(),
            Price = req.Price,
            CategoryId = req.CategoryId
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        var catTitle = await _db.Categories.Where(c => c.Id == product.CategoryId).Select(c => c.Title).FirstAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, new ProductDto(
            product.Id,
            product.Title,
            product.Description,
            product.Price,
            product.CategoryId,
            catTitle,
            new List<string>()
        ));
    }

    // POST: /api/products/5/images  (upload multiple images)
    [HttpPost("{id:int}/images")]
    public async Task<ActionResult> UploadImages(int id, [FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest("No files uploaded.");

        var product = await _db.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return NotFound("Product not found.");

        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsDir);


        var saved = 0;

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            if (!file.ContentType.StartsWith("image/"))
                return BadRequest("Only image files are allowed.");

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest("File too large (max 5MB).");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            // whitelist extensions (så vi ikke får .exe osv.)
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            if (!allowed.Contains(ext))
                return BadRequest("Only .jpg, .jpeg, .png, .webp allowed.");

            var baseName = Slugify(product.Title);

            // find næste ledige navn: hoodie-1.jpg, hoodie-2.jpg ...
            var n = 1;
            string fileName;
            string fullPath;

            do
            {
                fileName = $"{baseName}-{n}{ext}";
                fullPath = Path.Combine(uploadsDir, fileName);
                n++;
            }
            while (System.IO.File.Exists(fullPath));

            using var stream = System.IO.File.Create(fullPath);
            await file.CopyToAsync(stream);

            var url = $"/uploads/{fileName}";
            product.Images.Add(new ProductImage { Url = url });

            saved++;
        }

        await _db.SaveChangesAsync();

        return Ok(new { message = "Uploaded", saved });
    }

    private static string Slugify(string input)
    {
        input = (input ?? "").Trim().ToLowerInvariant();
        input = input
            .Replace("æ", "ae")
            .Replace("ø", "oe")
            .Replace("å", "aa");

        // tillad a-z, 0-9, ellers bindestreg
        var chars = input.Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
        var slug = new string(chars);

        // ryd op i multiple bindestreger
        while (slug.Contains("--"))
            slug = slug.Replace("--", "-");

        slug = slug.Trim('-');

        return string.IsNullOrWhiteSpace(slug) ? "image" : slug;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> Update(int id, [FromBody] UpdateProductRequest req)
    {
        var title = (req.Title ?? "").Trim();
        var desc = (req.Description ?? "").Trim();

        if (string.IsNullOrWhiteSpace(title)) return BadRequest("Title is required.");
        if (string.IsNullOrWhiteSpace(desc)) return BadRequest("Description is required.");

        var product = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return NotFound();

        var titleExists = await _db.Products.AnyAsync(p => p.Id != id && p.Title.ToLower() == title.ToLower());
        if (titleExists) return Conflict("Product title already exists.");

        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == req.CategoryId);
        if (!categoryExists) return BadRequest("CategoryId does not exist.");

        product.Title = title;
        product.Description = desc;
        product.Price = req.Price;
        product.CategoryId = req.CategoryId;

        await _db.SaveChangesAsync();

        // reload category title (hvis Category nav prop ikke følger med efter CategoryId skift)
        var catTitle = await _db.Categories.Where(c => c.Id == product.CategoryId).Select(c => c.Title).FirstAsync();

        return Ok(new ProductDto(
            product.Id,
            product.Title,
            product.Description,
            product.Price,
            product.CategoryId,
            catTitle,
            product.Images.Select(i => i.Url).ToList()
        ));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return NotFound();

        // slet fysiske filer (best-effort)
        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        foreach (var img in product.Images)
        {
            // img.Url er fx "/uploads/xxx.jpg"
            var relative = img.Url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
            var fullPath = Path.Combine(webRoot, relative);

            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);
        }

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{productId:int}/images/{imageId:int}")]
    public async Task<IActionResult> DeleteImage(int productId, int imageId)
    {
        var img = await _db.ProductImages.FirstOrDefaultAsync(i => i.Id == imageId && i.ProductId == productId);
        if (img is null) return NotFound();

        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var relative = img.Url.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
        var fullPath = Path.Combine(webRoot, relative);

        if (System.IO.File.Exists(fullPath))
            System.IO.File.Delete(fullPath);

        _db.ProductImages.Remove(img);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}