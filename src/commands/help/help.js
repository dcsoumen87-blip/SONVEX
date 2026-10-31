import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";

import { isDeveloper } from "../../utils/permissions.js";

const categories = {
    home: {
        title: "SONVEX MUSIC",
        description:
            "**Your Music. Your Vibe. Your World.**\n\n" +
            "Experience premium music playback with SONVEX.\n\n" +
            "🎵 High Quality Audio\n" +
            "⚡ Fast Music Playback\n" +
            "📜 Advanced Queue System\n" +
            "🎚️ Audio Filters\n" +
            "💎 Premium Features"
    },

    music: {
        title: "🎵 Music Commands",
        description:
            "`/play` — Play music\n" +
            "`/pause` — Pause music\n" +
            "`/resume` — Resume music\n" +
            "`/skip` — Skip current track\n" +
            "`/stop` — Stop playback\n" +
            "`/volume` — Change volume\n" +
            "`/seek` — Seek track\n" +
            "`/nowplaying` — Current track"
    },

    queue: {
        title: "📜 Queue Management",
        description:
            "`/queue` — View queue\n" +
            "`/remove` — Remove a track\n" +
            "`/clear` — Clear queue\n" +
            "`/shuffle` — Shuffle queue\n" +
            "`/move` — Move a track\n" +
            "`/loop` — Loop settings\n" +
            "`/previous` — Previous track"
    },

    filters: {
        title: "🎚️ Audio Filters",
        description:
            "Bassboost\nNightcore\nVaporwave\n8D Audio\nKaraoke\nEqualizer"
    },

    settings: {
        title: "⚙️ Server Settings",
        description:
            "`/prefix` — Change prefix\n" +
            "`/247` — 24/7 mode\n" +
            "`/settings` — Server settings"
    },

    premium: {
        title: "💎 SONVEX Premium",
        description:
            "Unlock exclusive premium features.\n\n" +
            "Premium features will be announced soon."
    },

    developer: {
        title: "🛠️ Developer Console",
        description:
            "`/dev help` — Developer commands\n" +
            "`/dev stats` — Bot statistics\n" +
            "`/dev node` — Lavalink status\n" +
            "`!dev help` — Prefix developer help"
    }
};

function createEmbed(category) {
    const data = categories[category];

    return new EmbedBuilder()
        .setColor(0x172554)
        .setTitle(data.title)
        .setDescription(data.description)
        .setFooter({
            text: "SONVEX • Your Music. Your Vibe. Your World."
        });
}

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Explore SONVEX commands"),

    async execute(interaction) {
        const owner = isDeveloper(interaction.user.id);

        const options = Object.entries(categories)
            .filter(([key]) => key !== "developer" || owner)
            .map(([key, value]) => ({
                label: value.title,
                value: key,
                description: `Explore ${value.title}`
            }));

        const menu = new StringSelectMenuBuilder()
            .setCustomId("sonvex_help")
            .setPlaceholder("Select a category")
            .addOptions(options);

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("sonvex_home")
                .setLabel("Home")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("sonvex_close")
                .setLabel("Close")
                .setStyle(ButtonStyle.Danger)
        );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            embeds: [createEmbed("home")],
            components: [row, buttons]
        });
    },

    async prefixExecute(message) {
        await message.reply({
            embeds: [createEmbed("home")]
        });
    }
};

export { categories, createEmbed };
