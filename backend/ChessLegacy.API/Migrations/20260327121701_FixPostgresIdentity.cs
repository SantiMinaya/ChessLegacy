using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    public partial class FixPostgresIdentity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Añadir secuencias SERIAL a todas las tablas que las necesitan en PostgreSQL
            // Esto solo afecta a PostgreSQL; en SQLite no hace nada
            var tables = new[]
            {
                "Jugadores", "Partidas", "Posiciones", "Intentos", "Movimientos",
                "Usuarios", "Progresos", "Logros", "ActividadesDiarias",
                "PartidasJugadas", "Amistades"
            };

            foreach (var table in tables)
            {
                migrationBuilder.Sql($@"
                    DO $$
                    BEGIN
                        IF NOT EXISTS (
                            SELECT 1 FROM information_schema.columns
                            WHERE table_name = '{table.ToLower()}'
                            AND column_name = 'Id'
                            AND column_default LIKE 'nextval%'
                        ) THEN
                            CREATE SEQUENCE IF NOT EXISTS ""{table}_Id_seq"";
                            ALTER TABLE ""{table}"" ALTER COLUMN ""Id"" SET DEFAULT nextval('""{table}_Id_seq""');
                            SELECT setval('""{table}_Id_seq""', COALESCE((SELECT MAX(""Id"") FROM ""{table}""), 0) + 1, false);
                        END IF;
                    END $$;
                ");
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
