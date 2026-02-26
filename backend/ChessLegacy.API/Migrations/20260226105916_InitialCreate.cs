using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Jugadores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AnioNacimiento = table.Column<int>(type: "INTEGER", nullable: false),
                    Pais = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    PesoSacrificio = table.Column<double>(type: "REAL", nullable: false),
                    PesoAtaqueRey = table.Column<double>(type: "REAL", nullable: false),
                    PesoSimplificacion = table.Column<double>(type: "REAL", nullable: false),
                    PesoFinales = table.Column<double>(type: "REAL", nullable: false),
                    PesoControlCentro = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jugadores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Partidas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    JugadorId = table.Column<int>(type: "INTEGER", nullable: false),
                    PGN = table.Column<string>(type: "TEXT", nullable: false),
                    Oponente = table.Column<string>(type: "TEXT", nullable: false),
                    Anio = table.Column<int>(type: "INTEGER", nullable: false),
                    Evento = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partidas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Partidas_Jugadores_JugadorId",
                        column: x => x.JugadorId,
                        principalTable: "Jugadores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Posiciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PartidaId = table.Column<int>(type: "INTEGER", nullable: false),
                    FEN = table.Column<string>(type: "TEXT", nullable: false),
                    MovimientoHistorico = table.Column<string>(type: "TEXT", nullable: false),
                    TipoPosicion = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posiciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posiciones_Partidas_PartidaId",
                        column: x => x.PartidaId,
                        principalTable: "Partidas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Partidas_JugadorId",
                table: "Partidas",
                column: "JugadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Posiciones_PartidaId",
                table: "Posiciones",
                column: "PartidaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Intentos");

            migrationBuilder.DropTable(
                name: "Posiciones");

            migrationBuilder.DropTable(
                name: "Partidas");

            migrationBuilder.DropTable(
                name: "Jugadores");
        }
    }
}
