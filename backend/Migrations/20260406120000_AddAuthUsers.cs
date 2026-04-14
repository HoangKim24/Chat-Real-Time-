using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Api.Migrations
{
    public partial class AddAuthUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AUTH_USERS",
                columns: table => new
                {
                    AUTH_USER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    EMAIL = table.Column<string>(type: "NVARCHAR2(256)", maxLength: 256, nullable: false),
                    USERNAME = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    PASSWORD = table.Column<string>(type: "NVARCHAR2(256)", maxLength: 256, nullable: false),
                    DISPLAY_NAME = table.Column<string>(type: "NVARCHAR2(150)", maxLength: 150, nullable: true),
                    AVATAR_URL = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: true),
                    BIO = table.Column<string>(type: "NVARCHAR2(1000)", maxLength: 1000, nullable: true),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    UPDATED_AT = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AUTH_USERS", x => x.AUTH_USER_ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AUTH_USERS_EMAIL",
                table: "AUTH_USERS",
                column: "EMAIL",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AUTH_USERS");
        }
    }
}