using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMovimientosYAperturasV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Partidas_JugadorId",
                table: "Partidas");

            migrationBuilder.AddColumn<string>(
                name: "AperturaNombre",
                table: "Partidas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CodigoECO",
                table: "Partidas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ColorJugador",
                table: "Partidas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EloJugador",
                table: "Partidas",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EloOponente",
                table: "Partidas",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha",
                table: "Partidas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Resultado",
                table: "Partidas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VarianteNombre",
                table: "Partidas",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Biografia",
                table: "Jugadores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FotoUrl",
                table: "Jugadores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PerfilEstilo",
                table: "Jugadores",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Aperturas",
                columns: table => new
                {
                    ECO = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Variante = table.Column<string>(type: "TEXT", nullable: true),
                    MovimientosIniciales = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aperturas", x => x.ECO);
                });

            migrationBuilder.CreateTable(
                name: "Movimientos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PartidaId = table.Column<int>(type: "INTEGER", nullable: false),
                    NumeroMovimiento = table.Column<int>(type: "INTEGER", nullable: false),
                    FenAntes = table.Column<string>(type: "TEXT", nullable: false),
                    FenDespues = table.Column<string>(type: "TEXT", nullable: false),
                    San = table.Column<string>(type: "TEXT", nullable: false),
                    EvaluacionStockfish = table.Column<int>(type: "INTEGER", nullable: true),
                    TipoMovimiento = table.Column<string>(type: "TEXT", nullable: true),
                    FaseJuego = table.Column<string>(type: "TEXT", nullable: false),
                    CaracteristicasEstilo = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movimientos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movimientos_Partidas_PartidaId",
                        column: x => x.PartidaId,
                        principalTable: "Partidas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Partidas_Anio",
                table: "Partidas",
                column: "Anio");

            migrationBuilder.CreateIndex(
                name: "IX_Partidas_CodigoECO",
                table: "Partidas",
                column: "CodigoECO");

            migrationBuilder.CreateIndex(
                name: "IX_Partidas_JugadorId_CodigoECO",
                table: "Partidas",
                columns: new[] { "JugadorId", "CodigoECO" });

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_Nombre",
                table: "Jugadores",
                column: "Nombre");

            migrationBuilder.CreateIndex(
                name: "IX_Aperturas_Nombre",
                table: "Aperturas",
                column: "Nombre");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_FaseJuego",
                table: "Movimientos",
                column: "FaseJuego");

            migrationBuilder.CreateIndex(
                name: "IX_Movimientos_PartidaId_NumeroMovimiento",
                table: "Movimientos",
                columns: new[] { "PartidaId", "NumeroMovimiento" });

            migrationBuilder.AddForeignKey(
                name: "FK_Partidas_Aperturas_CodigoECO",
                table: "Partidas",
                column: "CodigoECO",
                principalTable: "Aperturas",
                principalColumn: "ECO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Partidas_Aperturas_CodigoECO",
                table: "Partidas");

            migrationBuilder.DropTable(
                name: "Aperturas");

            migrationBuilder.DropTable(
                name: "Movimientos");

            migrationBuilder.DropIndex(
                name: "IX_Partidas_Anio",
                table: "Partidas");

            migrationBuilder.DropIndex(
                name: "IX_Partidas_CodigoECO",
                table: "Partidas");

            migrationBuilder.DropIndex(
                name: "IX_Partidas_JugadorId_CodigoECO",
                table: "Partidas");

            migrationBuilder.DropIndex(
                name: "IX_Jugadores_Nombre",
                table: "Jugadores");

            migrationBuilder.DropColumn(
                name: "AperturaNombre",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "CodigoECO",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "ColorJugador",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "EloJugador",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "EloOponente",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "Fecha",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "Resultado",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "VarianteNombre",
                table: "Partidas");

            migrationBuilder.DropColumn(
                name: "Biografia",
                table: "Jugadores");

            migrationBuilder.DropColumn(
                name: "FotoUrl",
                table: "Jugadores");

            migrationBuilder.DropColumn(
                name: "PerfilEstilo",
                table: "Jugadores");

            migrationBuilder.CreateIndex(
                name: "IX_Partidas_JugadorId",
                table: "Partidas",
                column: "JugadorId");
        }
    }
}
