using Microsoft.EntityFrameworkCore;
using ShopApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MSSQL
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS (nemt til skole: tillad alt)
// Hvis du senere vil stramme, kan vi låse den til dit React-domæne.
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("gui", p =>
        p.AllowAnyHeader()
         .AllowAnyMethod()
         .AllowAnyOrigin());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("gui");

// Gør wwwroot public (så /uploads virker)
app.UseStaticFiles();

app.MapControllers();

// Seed (kun hvis DB er tom)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbSeeder.Seed(db);
}

app.Run();