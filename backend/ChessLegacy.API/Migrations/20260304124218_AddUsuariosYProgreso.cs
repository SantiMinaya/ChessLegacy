using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChessLegacy.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuariosYProgreso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    CreadoEn = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Logros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: false),
                    Codigo = table.Column<string>(type: "TEXT", nullable: false),
                    FechaObtenido = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logros", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Logros_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Progresos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: false),
                    Apertura = table.Column<string>(type: "TEXT", nullable: false),
                    Variante = table.Column<string>(type: "TEXT", nullable: true),
                    Intentos = table.Column<int>(type: "INTEGER", nullable: false),
                    Aciertos = table.Column<int>(type: "INTEGER", nullable: false),
                    Sesiones = table.Column<int>(type: "INTEGER", nullable: false),
                    UltimaSesion = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Progresos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Progresos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Logros_UsuarioId_Codigo",
                table: "Logros",
                columns: new[] { "UsuarioId", "Codigo" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Progresos_UsuarioId_Apertura_Variante",
                table: "Progresos",
                columns: new[] { "UsuarioId", "Apertura", "Variante" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Username",
                table: "Usuarios",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Logros");

            migrationBuilder.DropTable(
                name: "Progresos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
