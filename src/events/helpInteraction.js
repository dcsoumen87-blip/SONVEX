import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder
} from "discord.js";

import { isDeveloper } from "../utils/permissions.js";

const COLORS = {
    primary: 0x5865F2,
    premium: 0xF1C40F,
    dark: 0x23272A
};

const categories = {
    home: {
        title: "🎧 SONVEX Help Center",
        description:
            "**Your Music. Your Vibe. Your World.**\n\n" +
            "SONVEX is your advanced Discord music companion.\n\n" +
            "Select a category from the menu below to explore commands.",
        fields: [
            {
                name: "🎵 Music",
                value: "Play, pause, resume, skip and control music."
            },
            {
                name: "📜 Queue",
                value: "Manage your music queue."
            },
            {
                name: "⚙️ Settings",
                value: "Configure your server settings."
            },
            {
                name: "💎 Premium",
                value: "Explore SONVEX Premium features."
            }
        ]
    },

    music: {
        title: "🎵 Music Commands",
        description:
            "`/play <song>` — Play a song\n" +
            "`/pause` — Pause playback\n" +
            "`/resume` — Resume playback\n" +
            "`/skip` — Skip current track\n" +
            "`/stop` — Stop playback\n" +
            "`/volume <1-100>` — Change volume\n" +
            "`/seek <time>` — Seek to a position\n" +
            "`/nowplaying` — Current track information"
    },

    queue: {
        title: "📜 Queue Commands",
        description:
            "`/queue` — View the queue\n" +
            "`/remove <position>` — Remove a track\n" +
            "`/clear` — Clear the queue\n" +
            "`/shuffle` — Shuffle the queue\n" +
            "`/move <from> <to>` — Move a track\n" +
            "`/loop <mode>` — Change loop mode\n" +
            "`/autoplay` — Toggle autoplay\n" +
            "`/previous` — Play previous track"
    },

    filters: {
        title: "🎚️ Filter Commands",
        description:
            "Audio filters will be available in a future update."
    },

    settings: {
        title: "⚙️ Server Settings",
        description:
            "Server customization features are planned for a future update."
    },

    premium: {
        title: "💎 SONVEX Premium",
        description:
            "Unlock an enhanced music experience with SONVEX Premium.\n\n" +
            "Premium features and subscription information will be announced soon."
    },

    developer: {
        title: "🛠️ Developer Commands",
        description:
            "`/dev help` — Developer command list\n" +
            "`/dev stats` — Bot statistics\n" +
            "`/dev node` — Lavalink node status"
    }
};

function createEmbed(category) {
    const data = categories[category] || categories.home;

    const embed = new EmbedBuilder()
        .setColor(category === "premium" ? COLORS.premium : COLORS.primary)
        .setTitle(data.title)
        .setDescription(data.description)
        .setFooter({
            text: "SONVEX • Your Music. Your Vibe. Your World."
        })
        .setTimestamp();

    if (data.fields) {
        embed.addFields(data.fields);
    }

    return embed;
}

function createMenu(userIsDeveloper) {
    const options = [
        {
            label: "Home",
            value: "home",
            emoji: "🏠",
            description: "SONVEX overview"
        },
        {
            label: "Music",
            value: "music",
            emoji: "🎵",
            description: "Music playback commands"
        },
        {
            label: "Queue",
            value: "queue",
            emoji: "📜",
            description: "Queue management commands"
        },
        {
            label: "Filters",
            value: "filters",
            emoji: "🎚️",
            description: "Audio filter information"
        },
        {
            label: "Settings",
            value: "settings",
            emoji: "⚙️",
            description: "Server settings"
        },
        {
            label: "Premium",
            value: "premium",
            emoji: "💎",
            description: "Premium information"
        }
    ];

    if (userIsDeveloper) {
        options.push({
            label: "Developer",
            value: "developer",
            emoji: "🛠️",
            description: "Developer-only commands"
        });
    }

    return new StringSelectMenuBuilder()
        .setCustomId("sonvex_help_category")
        .setPlaceholder("Select a help category")
        .addOptions(options);
}

export default {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isStringSelectMenu() && !interaction.isButton()) {
            return;
        }

        const customId = interaction.customId;

        if (
            customId !== "sonvex_help_category" &&
            customId !== "sonvex_help_home" &&
            customId !== "sonvex_help_close"
        ) {
            return;
        }

        const ownerId = interaction.message.interactionMetadata?.user?.id;

        if (ownerId && interaction.user.id !== ownerId) {
            return interaction.reply({
                content: "❌ This help panel is not yours.",
                ephemeral: true
            });
        }

        const userIsDeveloper = isDeveloper(interaction.user.id);

        if (interaction.isStringSelectMenu()) {
            const selected = interaction.values[0];

            if (!categories[selected]) {
                return interaction.reply({
                    content: "Invalid help category.",
                    ephemeral: true
                });
            }

            if (selected === "developer" && !userIsDeveloper) {
                return interaction.reply({
                    content: "❌ Developer access required.",
                    ephemeral: true
                });
            }

            return interaction.update({
                embeds: [createEmbed(selected)],
                components: [
                    new ActionRowBuilder().addComponents(
                        createMenu(userIsDeveloper)
                    ),
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("sonvex_help_home")
                            .setLabel("Home")
                            .setEmoji("🏠")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId("sonvex_help_close")
                            .setLabel("Close")
                            .setEmoji("✖️")
                            .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
        }

        if (customId === "sonvex_help_home") {
            return interaction.update({
                embeds: [createEmbed("home")],
                components: [
                    new ActionRowBuilder().addComponents(
                        createMenu(userIsDeveloper)
                    ),
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("sonvex_help_home")
                            .setLabel("Home")
                            .setEmoji("🏠")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId("sonvex_help_close")
                            .setLabel("Close")
                            .setEmoji("✖️")
                            .setStyle(ButtonStyle.Danger)
                    )
                ]
            });
        }

        if (customId === "sonvex_help_close") {
            return interaction.update({
                content: "🔒 SONVEX Help Panel closed.",
                embeds: [],
                components: []
            });
        }
    }
};
