using ShopApi.Models;

namespace ShopApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Categories.Any()) return;

        var electronics = new Category { Title = "Elektronik" };
        var clothing = new Category { Title = "Tøj" };
        var home = new Category { Title = "Bolig" };

        db.Categories.AddRange(electronics, clothing, home);
        db.SaveChanges();

        var p1 = new Product
        {
            Title = "Trådløse høretelefoner",
            Description = "God lyd og lang batteritid.",
            Price = 799.95m,
            CategoryId = electronics.Id
        };

        var p2 = new Product
        {
            Title = "Hoodie",
            Description = "Blød hoodie i bomuld.",
            Price = 399.00m,
            CategoryId = clothing.Id
        };

        var p3 = new Product
        {
            Title = "Bordlampe",
            Description = "Minimalistisk lampe til skrivebordet.",
            Price = 249.50m,
            CategoryId = home.Id
        };

        db.Products.AddRange(p1, p2, p3);
        db.SaveChanges();

        // Dummy image urls (læg filer i wwwroot/uploads eller upload via endpoint senere)
        db.ProductImages.AddRange(
            new ProductImage { ProductId = p1.Id, Url = "/uploads/headphones.jpg" },
            new ProductImage { ProductId = p2.Id, Url = "/uploads/hoodie.jpg" },
            new ProductImage { ProductId = p3.Id, Url = "/uploads/lamp.jpg" }
        );

        db.SaveChanges();
    }
}