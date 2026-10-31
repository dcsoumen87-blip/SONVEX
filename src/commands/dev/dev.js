import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

import { isDeveloper } from "../../utils/permissions.js";
import { loadCommands } from "../../handlers/commandHandler.js";

const DEV_ID = "1521945104217280652";

let maintenanceMode = false;

function denied() {
    return {
        content: "🔒 Developer access required.",
        ephemeral: true
    };
}

function getStats(client) {
    return {
        servers: client.guilds.cache.size,
        users: client.guilds.cache.reduce(
            (total, guild) => total + guild.memberCount,
            0
        ),
        commands: client.commands.size,
        uptime: Math.floor(process.uptime())
    };
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
}

function helpEmbed() {
    return new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("🛠️ SONVEX Developer Panel")
        .setDescription(
            [
                "`/dev help` — Developer commands",
                "`/dev stats` — Bot statistics",
                "`/dev node` — Lavalink status",
                "`/dev servers` — Server information",
                "`/dev announce` — Global announcement",
                "`/dev maintenance` — Maintenance mode",
                "`/dev reload` — Reload commands"
            ].join("\n")
        )
        .setFooter({
            text: "SONVEX • Developer Only"
        });
}

export default {
    data: new SlashCommandBuilder()
        .setName("dev")
        .setDescription("SONVEX developer commands")
        .addSubcommand(sub =>
            sub.setName("help")
                .setDescription("Show developer commands")
        )
        .addSubcommand(sub =>
            sub.setName("stats")
                .setDescription("Show bot statistics")
        )
        .addSubcommand(sub =>
            sub.setName("node")
                .setDescription("Check Lavalink node status")
        )
        .addSubcommand(sub =>
            sub.setName("servers")
                .setDescription("Show connected servers")
        )
        .addSubcommand(sub =>
            sub.setName("announce")
                .setDescription("Send an announcement to all servers")
                .addStringOption(option =>
                    option.setName("message")
                        .setDescription("Announcement message")
                        .setRequired(true)
                        .setMaxLength(1500)
                )
        )
        .addSubcommand(sub =>
            sub.setName("maintenance")
                .setDescription("Toggle maintenance mode")
                .addBooleanOption(option =>
                    option.setName("enabled")
                        .setDescription("Enable or disable maintenance")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName("reload")
                .setDescription("Reload command files")
        ),

    async execute(interaction) {
        if (!isDeveloper(interaction.user.id)) {
            return interaction.reply(denied());
        }

        const client = interaction.client;
        const sub = interaction.options.getSubcommand();

        if (sub === "help") {
            return interaction.reply({
                embeds: [helpEmbed()],
                ephemeral: true
            });
        }

        if (sub === "stats") {
            const stats = getStats(client);

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("📊 SONVEX Statistics")
                .addFields(
                    { name: "Servers", value: `${stats.servers}`, inline: true },
                    { name: "Users", value: `${stats.users}`, inline: true },
                    { name: "Commands", value: `${stats.commands}`, inline: true },
                    { name: "Uptime", value: formatUptime(stats.uptime), inline: true },
                    { name: "Ping", value: `${client.ws.ping}ms`, inline: true }
                );

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (sub === "node") {
            const nodes = [...client.shoukaku.nodes.values()];

            const description = nodes.length
                ? nodes.map(node =>
                    `**${node.name}** — ${
                        node.state === 1 ? "🟢 Connected" : "🔴 Disconnected"
                    }`
                ).join("\n")
                : "No Lavalink nodes found.";

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle("🎧 Lavalink Status")
                        .setDescription(description)
                ],
                ephemeral: true
            });
        }

        if (sub === "servers") {
            const servers = client.guilds.cache;

            const description = servers.size
                ? servers.map(guild =>
                    `**${guild.name}** — \`${guild.id}\``
                ).slice(0, 25).join("\n")
                : "No servers connected.";

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle(`🌐 Connected Servers (${servers.size})`)
                        .setDescription(description)
                ],
                ephemeral: true
            });
        }

        if (sub === "announce") {
            const message = interaction.options.getString("message");
            await interaction.deferReply({ ephemeral: true });

            let success = 0;
            let failed = 0;

            for (const guild of client.guilds.cache.values()) {
                try {
                    const channel = guild.channels.cache.find(
                        ch =>
                            ch.isTextBased() &&
                            ch.permissionsFor(guild.members.me)?.has("SendMessages")
                    );

                    if (!channel) {
                        failed++;
                        continue;
                    }

                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle("📢 SONVEX Announcement")
                                .setDescription(message)
                                .setFooter({ text: "SONVEX Official" })
                        ]
                    });

                    success++;
                } catch {
                    failed++;
                }
            }

            return interaction.editReply(
                `📢 Announcement completed.\n✅ Sent: ${success}\n❌ Failed: ${failed}`
            );
        }

        if (sub === "maintenance") {
            maintenanceMode = interaction.options.getBoolean("enabled");

            return interaction.reply({
                content: maintenanceMode
                    ? "🔧 Maintenance mode enabled."
                    : "✅ Maintenance mode disabled.",
                ephemeral: true
            });
        }

        if (sub === "reload") {
            await interaction.deferReply({ ephemeral: true });

            try {
                client.commands.clear();
                await loadCommands(client);

                return interaction.editReply(
                    `✅ Reloaded ${client.commands.size} commands.`
                );
            } catch (error) {
                console.error("[DEV RELOAD]", error);

                return interaction.editReply(
                    "❌ Command reload failed. Check logs."
                );
            }
        }
    },

    async prefixExecute(message, args, client) {
        if (!isDeveloper(message.author.id)) {
            return message.reply("🔒 Developer access required.");
        }

        const sub = args.shift()?.toLowerCase();

        if (sub === "help") {
            return message.reply({ embeds: [helpEmbed()] });
        }

        if (sub === "stats") {
            const stats = getStats(client);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle("📊 SONVEX Statistics")
                        .setDescription(
                            `Servers: **${stats.servers}**\n` +
                            `Users: **${stats.users}**\n` +
                            `Commands: **${stats.commands}**\n` +
                            `Uptime: **${formatUptime(stats.uptime)}**`
                        )
                ]
            });
        }

        if (sub === "node") {
            const nodes = [...client.shoukaku.nodes.values()];

            return message.reply(
                nodes.map(node =>
                    `${node.name}: ${node.state === 1 ? "🟢 Connected" : "🔴 Disconnected"}`
                ).join("\n") || "No Lavalink nodes found."
            );
        }

        if (sub === "servers") {
            return message.reply(
                `🌐 Connected servers: **${client.guilds.cache.size}**`
            );
        }

        if (sub === "maintenance") {
            const value = args[0]?.toLowerCase();

            if (!["on", "off"].includes(value)) {
                return message.reply("Usage: `!dev maintenance <on/off>`");
            }

            maintenanceMode = value === "on";

            return message.reply(
                maintenanceMode
                    ? "🔧 Maintenance mode enabled."
                    : "✅ Maintenance mode disabled."
            );
        }

        if (sub === "announce") {
            const text = args.join(" ");

            if (!text) {
                return message.reply("Usage: `!dev announce <message>`");
            }

            let success = 0;
            let failed = 0;

            for (const guild of client.guilds.cache.values()) {
                try {
                    const channel = guild.channels.cache.find(
                        ch =>
                            ch.isTextBased() &&
                            ch.permissionsFor(guild.members.me)?.has("SendMessages")
                    );

                    if (!channel) {
                        failed++;
                        continue;
                    }

                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x5865F2)
                                .setTitle("📢 SONVEX Announcement")
                                .setDescription(text)
                        ]
                    });

                    success++;
                } catch {
                    failed++;
                }
            }

            return message.reply(
                `📢 Announcement completed.\n✅ Sent: ${success}\n❌ Failed: ${failed}`
            );
        }

        if (sub === "reload") {
            try {
                client.commands.clear();
                await loadCommands(client);

                return message.reply(
                    `✅ Reloaded ${client.commands.size} commands.`
                );
            } catch (error) {
                console.error("[DEV RELOAD]", error);
                return message.reply("❌ Command reload failed.");
            }
        }

        return message.reply("Unknown command. Use `!dev help`.");
    }
};
