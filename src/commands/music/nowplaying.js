import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getCurrentTrack } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Show the currently playing song"),

    async execute(interaction) {
        const track = getCurrentTrack(interaction.guildId);

        if (!track) {
            return interaction.reply({
                content: "Nothing is currently playing.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🎵 Now Playing")
            .setDescription(`[${track.title}](${track.uri})`)
            .addFields(
                { name: "Artist", value: track.author || "Unknown" },
                { name: "Duration", value: formatTime(track.length) },
                { name: "Requested By", value: `<@${track.requester}>` }
            )
            .setFooter({ text: "SONVEX Music" });

        await interaction.reply({ embeds: [embed] });
    },

    async prefixExecute(message) {
        const track = getCurrentTrack(message.guild.id);

        if (!track) {
            return message.reply("Nothing is currently playing.");
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("🎵 Now Playing")
            .setDescription(`[${track.title}](${track.uri})`)
            .addFields(
                { name: "Artist", value: track.author || "Unknown" },
                { name: "Duration", value: formatTime(track.length) },
                { name: "Requested By", value: `<@${track.requester}>` }
            )
            .setFooter({ text: "SONVEX Music" });

        await message.reply({ embeds: [embed] });
    }
};

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
