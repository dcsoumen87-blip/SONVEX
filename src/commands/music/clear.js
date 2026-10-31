import { SlashCommandBuilder } from "discord.js";
import { clearQueue } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear the music queue"),

    async execute(interaction) {
        const count = clearQueue(interaction.guildId);
        await interaction.reply(`🗑️ Cleared ${count} tracks.`);
    },

    async prefixExecute(message) {
        const count = clearQueue(message.guild.id);
        await message.reply(`🗑️ Cleared ${count} tracks.`);
    }
};
