using System.ComponentModel.DataAnnotations;

namespace ShopApi.Dtos;

public class CreateProductRequest
{
    [Required, StringLength(120)]
    public string Title { get; set; } = "";

    [Required, StringLength(1000)]
    public string Description { get; set; } = "";

    [Range(0, 1_000_000)]
    public decimal Price { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }
}