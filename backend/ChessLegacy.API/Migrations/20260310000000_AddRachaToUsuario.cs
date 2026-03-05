using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations;

public partial class AddRachaToUsuario : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>("RachaActual", "Usuarios", nullable: false, defaultValue: 0);
        migrationBuilder.AddColumn<int>("MaximaRacha", "Usuarios", nullable: false, defaultValue: 0);
        migrationBuilder.AddColumn<DateTime>("UltimaActividad", "Usuarios", nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn("RachaActual", "Usuarios");
        migrationBuilder.DropColumn("MaximaRacha", "Usuarios");
        migrationBuilder.DropColumn("UltimaActividad", "Usuarios");
    }
}
