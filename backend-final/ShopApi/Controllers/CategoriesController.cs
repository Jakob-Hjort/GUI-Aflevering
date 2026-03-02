using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopApi.Data;
using ShopApi.Dtos;
using ShopApi.Models;

namespace ShopApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoriesController(AppDbContext db) => _db = db;

    // GET: /api/categories   (Get all categories)
    [HttpGet]
    public async Task<List<CategoryDto>> GetAll()
        => await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Title)
            .Select(c => new CategoryDto(c.Id, c.Title))
            .ToListAsync();

    // GET: /api/categories/5  (Get single category)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var cat = await _db.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
        if (cat is null) return NotFound();
        return Ok(new CategoryDto(cat.Id, cat.Title));
    }

    // GET: /api/categories/5/products  (Get products from category ID)
    [HttpGet("{id:int}/products")]
    public async Task<ActionResult<List<ProductDto>>> GetProductsForCategory(int id)
    {
        var exists = await _db.Categories.AnyAsync(c => c.Id == id);
        if (!exists) return NotFound("Category not found.");

        var items = await _db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.CategoryId == id)
            .OrderBy(p => p.Title)
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

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryRequest req)
    {
        var title = (req.Title ?? "").Trim();

        if (string.IsNullOrWhiteSpace(title))
            return BadRequest("Title is required.");

        // Case-insensitive check (pæn fejl før DB unique index)
        var exists = await _db.Categories.AnyAsync(c => c.Title.ToLower() == title.ToLower());
        if (exists)
            return Conflict("Category already exists.");

        var category = new Category { Title = title };
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, new CategoryDto(category.Id, category.Title));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoryDto>> Update(int id, [FromBody] UpdateCategoryRequest req)
    {
        var title = (req.Title ?? "").Trim();
        if (string.IsNullOrWhiteSpace(title)) return BadRequest("Title is required.");

        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category is null) return NotFound();

        var exists = await _db.Categories.AnyAsync(c => c.Id != id && c.Title.ToLower() == title.ToLower());
        if (exists) return Conflict("Category title already exists.");

        category.Title = title;
        await _db.SaveChangesAsync();

        return Ok(new CategoryDto(category.Id, category.Title));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category is null) return NotFound();

        var hasProducts = await _db.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts) return Conflict("Cannot delete category that has products.");

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}