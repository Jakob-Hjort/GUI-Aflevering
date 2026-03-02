using System.ComponentModel.DataAnnotations;

namespace ShopApi.Dtos;

public class UpdateCategoryRequest
{
    [Required, StringLength(80)]
    public string Title { get; set; } = "";
}