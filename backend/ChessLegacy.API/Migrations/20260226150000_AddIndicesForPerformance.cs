using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    public partial class AddIndicesForPerformance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Partidas_JugadorId_CodigoECO",
                table: "Partidas",
                columns: new[] { "JugadorId", "CodigoECO" });

            migrationBuilder.CreateIndex(
                name: "IX_Partidas_CodigoECO",
                table: "Partidas",
                column: "CodigoECO");

            migrationBuilder.CreateIndex(
                name: "IX_Posiciones_PartidaId",
                table: "Posiciones",
                column: "PartidaId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Partidas_JugadorId_CodigoECO",
                table: "Partidas");

            migrationBuilder.DropIndex(
                name: "IX_Partidas_CodigoECO",
                table: "Partidas");

            migrationBuilder.DropIndex(
                name: "IX_Posiciones_PartidaId",
                table: "Posiciones");
        }
    }
}
