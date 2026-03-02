using Microsoft.EntityFrameworkCore;
using ShopApi.Models;

namespace ShopApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Category 1..* Products
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Product 1..* Images
        modelBuilder.Entity<ProductImage>()
            .HasOne(i => i.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Price precision
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(10, 2);
            
        // ✅ Unique: Category title må ikke gentages
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Title)
            .IsUnique();

        // ✅ Unique: Product title må ikke gentages
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Title)
            .IsUnique();

        // (valgfrit) ✅ samme URL må ikke gentages på samme produkt
        modelBuilder.Entity<ProductImage>()
            .HasIndex(i => new { i.ProductId, i.Url })
            .IsUnique();
    }
}