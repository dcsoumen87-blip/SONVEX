import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

import { isDeveloper } from "../../utils/permissions.js";

export default {
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("SONVEX Developer Controls")
        .addSubcommand(s =>
            s.setName("help").setDescription("Developer help")
        )
        .addSubcommand(s =>
            s.setName("stats").setDescription("Bot statistics")
        )
        .addSubcommand(s =>
            s.setName("node").setDescription("Lavalink status")
        ),

    async execute(interaction, client) {
        if (!isDeveloper(interaction.user.id)) {
            return interaction.reply({
                content: "🔒 Developer access required.",
                ephemeral: true
            });
        }

        const sub = interaction.options.getSubcommand();

        if (sub === "help") {
            return interaction.reply({
                content: [
                    "**SONVEX DEVELOPER CONSOLE**",
                    "`/dev stats` — Statistics",
                    "`/dev node` — Lavalink status",
                    "`/dev help` — Developer commands"
                ].join("\n"),
                ephemeral: true
            });
        }

        if (sub === "stats") {
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("SONVEX Developer Statistics")
                .addFields(
                    {
                        name: "Servers",
                        value: `${client.guilds.cache.size}`,
                        inline: true
                    },
                    {
                        name: "Users Cached",
                        value: `${client.users.cache.size}`,
                        inline: true
                    },
                    {
                        name: "Ping",
                        value: `${client.ws.ping}ms`,
                        inline: true
                    }
                );

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (sub === "node") {
            const nodes = [...client.shoukaku.nodes.values()];

            return interaction.reply({
                content: nodes.map(node =>
                    `${node.name}: ${node.state === 1 ? "🟢 Connected" : "🔴 Offline"}`
                ).join("\n") || "No Lavalink nodes.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        if (!isDeveloper(message.author.id)) {
            return message.reply("🔒 Developer access required.");
        }

        const sub = args[0]?.toLowerCase();

        if (sub === "help") {
            return message.reply(
                "**SONVEX DEVELOPER CONSOLE**\n" +
                "`!dev stats` — Statistics\n" +
                "`!dev node` — Lavalink status"
            );
        }

        if (sub === "stats") {
            return message.reply(
                `Servers: ${client.guilds.cache.size}\n` +
                `Users: ${client.users.cache.size}\n` +
                `Ping: ${client.ws.ping}ms`
            );
        }

        if (sub === "node") {
            return message.reply(
                [...client.shoukaku.nodes.values()]
                    .map(node => `${node.name}: ${node.state === 1 ? "Online" : "Offline"}`)
                    .join("\n") || "No Lavalink nodes."
            );
        }

        return message.reply("Use `!dev help`.");
    }
};
