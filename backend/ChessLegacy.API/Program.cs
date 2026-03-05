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
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ChessLegacyContext>();
    await context.Database.MigrateAsync();

    // Añadir columnas que pueden faltar en BD existente
    var conn = context.Database.GetDbConnection();
    await conn.OpenAsync();
    var cols = new List<string>();
    using (var cmd = conn.CreateCommand()) {
        cmd.CommandText = "PRAGMA table_info(Usuarios)";
        using var r = await cmd.ExecuteReaderAsync();
        while (await r.ReadAsync()) cols.Add(r["name"].ToString()!);
    }
    var alter = new[] {
        ("RachaActual",    "ALTER TABLE Usuarios ADD COLUMN RachaActual INTEGER NOT NULL DEFAULT 0"),
        ("MaximaRacha",    "ALTER TABLE Usuarios ADD COLUMN MaximaRacha INTEGER NOT NULL DEFAULT 0"),
        ("UltimaActividad","ALTER TABLE Usuarios ADD COLUMN UltimaActividad TEXT NULL"),
    };
    foreach (var (col, sql) in alter)
        if (!cols.Contains(col)) {
            using var cmd = conn.CreateCommand();
            cmd.CommandText = sql;
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine($"✅ Columna añadida: {col}");
        }
    await conn.CloseAsync();

    await DataSeeder.SeedAsync(context);

    if (!context.Partidas.Any())
    {
        var importer = scope.ServiceProvider.GetRequiredService<ChessLegacy.API.Services.SimplePgnImporter>();
        var baseDir = Path.Combine(Directory.GetCurrentDirectory(), "Scripts", "pgn_files");
        var maestros = new Dictionary<string, int>
        {
            { "Tal", 1 }, { "Capablanca", 2 }, { "Kasparov", 3 }, { "Fischer", 4 },
            { "Karpov", 5 }, { "Alekhine", 6 }, { "Petrosian", 7 }, { "Carlsen", 8 }
        };
        foreach (var (nombre, jugadorId) in maestros)
        {
            var pgnPath = Path.Combine(baseDir, nombre, $"{nombre}.pgn");
            if (File.Exists(pgnPath))
            {
                Console.WriteLine($"Importando partidas de {nombre}...");
                var importadas = await importer.ImportarPgn(pgnPath, jugadorId);
                Console.WriteLine($"✅ {nombre}: {importadas} partidas importadas");
            }
            else
            {
                Console.WriteLine($"⚠️ No se encontró: {pgnPath}");
            }
        }
    }
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
