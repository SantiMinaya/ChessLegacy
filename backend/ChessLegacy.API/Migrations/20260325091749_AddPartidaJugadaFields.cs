using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPartidaJugadaFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColorJugador",
                table: "PartidasJugadas",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "EsTorneo",
                table: "PartidasJugadas",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorJugador",
                table: "PartidasJugadas");

            migrationBuilder.DropColumn(
                name: "EsTorneo",
                table: "PartidasJugadas");
        }
    }
}
