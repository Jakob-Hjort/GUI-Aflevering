using System.ComponentModel.DataAnnotations;

namespace ShopApi.Models;

public class Category
{
    public int Id { get; set; }

    [Required, StringLength(80)]
    public string Title { get; set; } = "";

    // 1 kategori -> mange produkter
    public List<Product> Products { get; set; } = new();
}