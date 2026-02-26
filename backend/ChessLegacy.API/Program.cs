using ChessLegacy.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ChessLegacyContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddSingleton(new ChessLegacy.API.Engine.StockfishEngine("stockfish/stockfish.exe"));
builder.Services.AddSingleton(new ChessLegacy.API.Engine.MotorPersonalizado("stockfish/stockfish.exe"));
builder.Services.AddScoped<ChessLegacy.API.Services.AnalisisService>();
builder.Services.AddScoped<ChessLegacy.API.Services.PgnImporter>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.JugadorRepository>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.PosicionRepository>();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ChessLegacyContext>();
    await context.Database.MigrateAsync();
    await DataSeeder.SeedAsync(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();

app.Run();
