using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    /// <inheritdoc />
    public partial class AddColorToProgreso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // No-op: columna Color gestionada por migración PostgreSQLSync
            // Esta migración era específica de SQLite
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "Progresos",
                type: "TEXT",
                nullable: false,
                defaultValue: "white",
                oldClrType: typeof(string),
                oldType: "TEXT");
        }
    }
}
