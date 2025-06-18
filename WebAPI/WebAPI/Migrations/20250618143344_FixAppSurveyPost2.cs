using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixAppSurveyPost2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "AppSurvey",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppSurvey_UserId1",
                table: "AppSurvey",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AppSurvey_Users_UserId1",
                table: "AppSurvey",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppSurvey_Users_UserId1",
                table: "AppSurvey");

            migrationBuilder.DropIndex(
                name: "IX_AppSurvey_UserId1",
                table: "AppSurvey");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "AppSurvey");
        }
    }
}
