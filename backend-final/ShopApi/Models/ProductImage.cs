using System.ComponentModel.DataAnnotations;

namespace ShopApi.Models;

public class ProductImage
{
    public int Id { get; set; }

    [Required, StringLength(500)]
    public string Url { get; set; } = ""; // fx "/uploads/abc.jpg"

    public int ProductId { get; set; }
    public Product? Product { get; set; }
}