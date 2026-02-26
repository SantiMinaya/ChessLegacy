using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    public partial class AddIntentosTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Intentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PosicionId = table.Column<int>(type: "INTEGER", nullable: false),
                    MovimientoJugado = table.Column<string>(type: "TEXT", nullable: false),
                    ScorePrecision = table.Column<double>(type: "REAL", nullable: false),
                    ScoreEstilo = table.Column<double>(type: "REAL", nullable: false),
                    ScoreFinal = table.Column<double>(type: "REAL", nullable: false),
                    MejorMovimiento = table.Column<string>(type: "TEXT", nullable: false),
                    EvaluacionCentipawns = table.Column<int>(type: "INTEGER", nullable: false),
                    FechaIntento = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Intentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Intentos_Posiciones_PosicionId",
                        column: x => x.PosicionId,
                        principalTable: "Posiciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Intentos_PosicionId",
                table: "Intentos",
                column: "PosicionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Intentos");
        }
    }
}
