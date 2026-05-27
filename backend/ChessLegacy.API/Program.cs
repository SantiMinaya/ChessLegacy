using ChessLegacy.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Base de datos: PostgreSQL en producción, SQLite en desarrollo ──
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(databaseUrl))
{
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    var npgsqlConn = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
    builder.Services.AddDbContext<ChessLegacyContext>(options =>
        options.UseNpgsql(npgsqlConn));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<ChessLegacyContext>(options =>
        options.UseSqlite(connectionString));
}

// ── JWT ──
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
    ?? builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key no configurada");

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(frontendUrl, "http://localhost:5173", "http://localhost:4173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ── Stockfish ──
var stockfishPath = Environment.GetEnvironmentVariable("STOCKFISH_PATH")
    ?? Path.Combine(AppContext.BaseDirectory, "stockfish",
        OperatingSystem.IsWindows() ? "stockfish.exe" : "stockfish");

builder.Services.AddSingleton(new ChessLegacy.API.Engine.StockfishEngine(stockfishPath));
builder.Services.AddSingleton(new ChessLegacy.API.Engine.MotorPersonalizado(stockfishPath));
builder.Services.AddSingleton<ChessLegacy.API.Engine.SimpleChessEngine>();
builder.Services.AddScoped<ChessLegacy.API.Services.AnalisisService>();
builder.Services.AddScoped<ChessLegacy.API.Services.SimplePgnImporter>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.JugadorRepository>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.PosicionRepository>();
builder.Services.AddScoped<ChessLegacy.API.Repositories.PartidaRepository>();
builder.Services.AddControllers(options =>
{
    options.MaxIAsyncEnumerableBufferLimit = 10000;
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o => o.MultipartBodyLengthLimit = 5 * 1024 * 1024);
builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 5 * 1024 * 1024);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddOpenApi();

var app = builder.Build();

// ── Migraciones y seed ──
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ChessLegacyContext>();

    Console.WriteLine("✅ Conectando a la base de datos...");
    if (context.Database.IsSqlite())
    {
        await context.Database.EnsureCreatedAsync();
        Console.WriteLine("✅ Base de datos SQLite creada/verificada con éxito");
    }
    else
    {
        await context.Database.MigrateAsync();
        Console.WriteLine("✅ Migraciones aplicadas en producción");
    }

    await DataSeeder.SeedAsync(context);

    var importer = scope.ServiceProvider.GetRequiredService<ChessLegacy.API.Services.SimplePgnImporter>();
    var baseDir = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "pgn_files");
    var maestros = new Dictionary<string, int>
    {
        { "Tal", 1 }, { "Capablanca", 2 }, { "Kasparov", 3 }, { "Fischer", 4 },
        { "Karpov", 5 }, { "Alekhine", 6 }, { "Petrosian", 7 }, { "Carlsen", 8 },
        { "Anand", 9 }, { "Botvinnik", 10 }, { "Bronstein", 11 }, { "Kramnik", 12 },
        { "Lasker", 13 }, { "Morphy", 14 }, { "Nimzowitsch", 15 }, { "Rubinstein", 16 },
        { "Smyslov", 17 }, { "Spassky", 18 }, { "Steinitz", 19 }, { "Tarrasch", 20 }
    };
    foreach (var (nombre, jugadorId) in maestros)
    {
        if (!context.Partidas.Any(p => p.JugadorId == jugadorId))
        {
            var pgnPath = Path.Combine(baseDir, nombre, $"{nombre}.pgn");
            if (File.Exists(pgnPath))
            {
                Console.WriteLine($"Importando partidas de {nombre}...");
                var importadas = await importer.ImportarPgn(pgnPath, jugadorId);
                Console.WriteLine($"✅ {nombre}: {importadas} partidas importadas");
            }
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => "ok");

app.Run();
