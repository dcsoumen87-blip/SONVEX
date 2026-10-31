import { SlashCommandBuilder } from "discord.js";
import { resumeMusic } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume music"),

    async execute(interaction, client) {
        try {
            await resumeMusic(client, interaction.guildId);
            await interaction.reply("▶️ Music resumed.");
        } catch {
            await interaction.reply({
                content: "No active player.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        try {
            await resumeMusic(client, message.guild.id);
            await message.reply("▶️ Music resumed.");
        } catch {
            await message.reply("No active player.");
        }
    }
};
