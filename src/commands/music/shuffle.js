import { SlashCommandBuilder } from "discord.js";
import { shuffleQueue } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the music queue"),

    async execute(interaction) {
        const count = shuffleQueue(interaction.guildId);
        await interaction.reply(`🔀 Shuffled ${count} tracks.`);
    },

    async prefixExecute(message) {
        const count = shuffleQueue(message.guild.id);
        await message.reply(`🔀 Shuffled ${count} tracks.`);
    }
};
