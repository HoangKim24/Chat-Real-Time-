using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Api.Migrations
{
    public partial class AddServersAndChannels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CHAT_SERVERS",
                columns: table => new
                {
                    CHAT_SERVER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    SERVER_NAME = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    DESCRIPTION = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: true),
                    ICON_URL = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: true),
                    OWNER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    CREATED_AT = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHAT_SERVERS", x => x.CHAT_SERVER_ID);
                    table.ForeignKey(
                        name: "FK_CHAT_SERVERS_AUTH_USERS_OWNER_ID",
                        column: x => x.OWNER_ID,
                        principalTable: "AUTH_USERS",
                        principalColumn: "AUTH_USER_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHAT_SERVER_MEMBERS",
                columns: table => new
                {
                    CHAT_SERVER_MEMBER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    SERVER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    USER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHAT_SERVER_MEMBERS", x => x.CHAT_SERVER_MEMBER_ID);
                    table.ForeignKey(
                        name: "FK_CHAT_SERVER_MEMBERS_AUTH_USERS_USER_ID",
                        column: x => x.USER_ID,
                        principalTable: "AUTH_USERS",
                        principalColumn: "AUTH_USER_ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CHAT_SERVER_MEMBERS_CHAT_SERVERS_SERVER_ID",
                        column: x => x.SERVER_ID,
                        principalTable: "CHAT_SERVERS",
                        principalColumn: "CHAT_SERVER_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHAT_CHANNELS",
                columns: table => new
                {
                    CHAT_CHANNEL_ID = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    SERVER_ID = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    CHANNEL_NAME = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    TYPE = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHAT_CHANNELS", x => x.CHAT_CHANNEL_ID);
                    table.ForeignKey(
                        name: "FK_CHAT_CHANNELS_CHAT_SERVERS_SERVER_ID",
                        column: x => x.SERVER_ID,
                        principalTable: "CHAT_SERVERS",
                        principalColumn: "CHAT_SERVER_ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CHAT_CHANNELS_SERVER_ID",
                table: "CHAT_CHANNELS",
                column: "SERVER_ID");

            migrationBuilder.CreateIndex(
                name: "IX_CHAT_SERVER_MEMBERS_SERVER_ID_USER_ID",
                table: "CHAT_SERVER_MEMBERS",
                columns: new[] { "SERVER_ID", "USER_ID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CHAT_SERVER_MEMBERS_USER_ID",
                table: "CHAT_SERVER_MEMBERS",
                column: "USER_ID");

            migrationBuilder.CreateIndex(
                name: "IX_CHAT_SERVERS_OWNER_ID",
                table: "CHAT_SERVERS",
                column: "OWNER_ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "CHAT_CHANNELS");
            migrationBuilder.DropTable(name: "CHAT_SERVER_MEMBERS");
            migrationBuilder.DropTable(name: "CHAT_SERVERS");
        }
    }
}