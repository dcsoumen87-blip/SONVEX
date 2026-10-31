import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getQueueData } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show the music queue"),

    async execute(interaction) {
        await showQueue(interaction);
    },

    async prefixExecute(message) {
        await showQueue(message);
    }
};

async function showQueue(context) {
    const guildId = context.guildId || context.guild.id;
    const data = getQueueData(guildId);

    const tracks = data.tracks.slice(0, 10);

    const embed = new EmbedBuilder()
        .setColor(0x172554)
        .setTitle("🎵 SONVEX Music Queue")
        .setDescription(
            tracks.length
                ? tracks.map((t, i) =>
                    `**${i + 1}.** ${t.title} — ${t.author}`
                ).join("\n")
                : "No upcoming tracks."
        )
        .addFields({
            name: "Currently Playing",
            value: data.current?.title || "Nothing"
        })
        .setFooter({
            text: `Total Tracks: ${data.tracks.length}`
        });

    if (context.isChatInputCommand()) {
        return context.reply({ embeds: [embed] });
    }

    return context.reply({ embeds: [embed] });
}
