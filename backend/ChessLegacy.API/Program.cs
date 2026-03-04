using ChessLegacy.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ChessLegacyContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<ChessLegacyContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var stockfishPath = Path.Combine(AppContext.BaseDirectory, "stockfish", "stockfish.exe");
builder.Services.AddSingleton(new ChessLegacy.API.Engine.StockfishEngine(stockfishPath));
builder.Services.AddSingleton(new ChessLegacy.API.Engine.MotorPersonalizado(stockfishPath));
builder.Services.AddSingleton<ChessLegacy.API.Engine.SimpleChessEngine>();
builder.Services.AddScoped<ChessLegacy.API.Services.AnalisisService>();
builder.Services.AddScoped<ChessLegacy.API.Services.PgnImporter>();
builder.Services.AddScoped<ChessLegacy.API.Services.SimplePgnImporter>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.JugadorRepository>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.PosicionRepository>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.PartidaRepository>();
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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
