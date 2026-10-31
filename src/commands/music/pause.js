import { SlashCommandBuilder } from "discord.js";
import { pauseMusic } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause music"),

    async execute(interaction, client) {
        try {
            await pauseMusic(client, interaction.guildId);
            await interaction.reply("⏸️ Music paused.");
        } catch {
            await interaction.reply({
                content: "No active player.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        try {
            await pauseMusic(client, message.guild.id);
            await message.reply("⏸️ Music paused.");
        } catch {
            await message.reply("No active player.");
        }
    }
};
