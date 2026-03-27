using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    public partial class FixPostgresIdentityV2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                        IF EXISTS (
                            SELECT 1 FROM information_schema.tables
                            WHERE LOWER(table_name) = LOWER('{table}')
                            AND table_schema = 'public'
                        ) AND NOT EXISTS (
                            SELECT 1 FROM information_schema.columns
                            WHERE LOWER(table_name) = LOWER('{table}')
                            AND LOWER(column_name) = 'id'
                            AND column_default LIKE 'nextval%'
                            AND table_schema = 'public'
                        ) THEN
                            CREATE SEQUENCE IF NOT EXISTS ""{table}_Id_seq"";
                            ALTER TABLE ""{table}"" ALTER COLUMN ""Id"" SET DEFAULT nextval('""{table}_Id_seq""');
                            PERFORM setval('""{table}_Id_seq""', COALESCE((SELECT MAX(""Id"") FROM ""{table}""), 0) + 1, false);
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
