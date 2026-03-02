using System.ComponentModel.DataAnnotations;

namespace ShopApi.Models;

public class Product
{
    public int Id { get; set; }

    [Required, StringLength(120)]
    public string Title { get; set; } = "";

    [Required, StringLength(1000)]
    public string Description { get; set; } = "";

    [Range(0, 1_000_000)]
    public decimal Price { get; set; }

    // FK: Product -> Category (mange-til-en)
    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    // 1 produkt -> mange billeder
    public List<ProductImage> Images { get; set; } = new();
}