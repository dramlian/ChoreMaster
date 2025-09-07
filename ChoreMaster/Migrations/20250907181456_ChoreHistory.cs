using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChoreMaster.Migrations
{
    /// <inheritdoc />
    public partial class ChoreHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChoreHistories_Users_UserId",
                table: "ChoreHistories");

            migrationBuilder.DropIndex(
                name: "IX_ChoreHistories_UserId",
                table: "ChoreHistories");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ChoreHistories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "ChoreHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChoreHistories_UserId",
                table: "ChoreHistories",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChoreHistories_Users_UserId",
                table: "ChoreHistories",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
