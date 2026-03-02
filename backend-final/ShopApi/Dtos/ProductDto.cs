namespace ShopApi.Dtos;

public record ProductDto(
    int Id,
    string Title,
    string Description,
    decimal Price,
    int CategoryId,
    string CategoryTitle,
    List<string> ImageUrls
);