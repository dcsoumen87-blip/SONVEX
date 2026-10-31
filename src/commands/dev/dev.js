import { SlashCommandBuilder } from "discord.js";
import { isDeveloper } from "../../utils/permissions.js";

export default {
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("SONVEX Developer Controls")
        .addSubcommand(sub =>
            sub.setName("help")
                .setDescription("Show developer commands")
        )
        .addSubcommand(sub =>
            sub.setName("stats")
                .setDescription("Show bot statistics")
        ),

    async execute(interaction, client) {
        if (!isDeveloper(interaction.user.id)) {
            return interaction.reply({
                content: "You are not authorized to use this command.",
                ephemeral: true
            });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === "help") {
            return interaction.reply({
                content: [
                    "**SONVEX DEVELOPER COMMANDS**",
                    "`/dev help` - Developer help",
                    "`/dev stats` - Bot statistics",
                    "`!dev help` - Prefix developer help",
                    "`!dev stats` - Prefix developer statistics"
                ].join("\n"),
                ephemeral: true
            });
        }

        if (sub === "stats") {
            return interaction.reply({
                content: [
                    "**SONVEX STATISTICS**",
                    `Servers: ${client.guilds.cache.size}`,
                    `Users (cached): ${client.users.cache.size}`,
                    `Ping: ${client.ws.ping}ms`,
                    `Uptime: ${Math.floor(client.uptime / 1000)} seconds`
                ].join("\n"),
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        if (!isDeveloper(message.author.id)) {
            return message.reply("You are not authorized to use this command.");
        }

        const sub = args[0]?.toLowerCase();

        if (sub === "help") {
            return message.reply(
                "**SONVEX DEVELOPER COMMANDS**\n" +
                "`!dev help` - Developer help\n" +
                "`!dev stats` - Bot statistics"
            );
        }

        if (sub === "stats") {
            return message.reply(
                `**SONVEX STATISTICS**\n` +
                `Servers: ${client.guilds.cache.size}\n` +
                `Users (cached): ${client.users.cache.size}\n` +
                `Ping: ${client.ws.ping}ms`
            );
        }

        return message.reply("Use `!dev help`.");
    }
};
