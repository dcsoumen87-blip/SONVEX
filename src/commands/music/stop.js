import { SlashCommandBuilder } from "discord.js";
import { stopMusic } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop music playback"),

    async execute(interaction, client) {
        try {
            await stopMusic(client, interaction.guildId);
            await interaction.reply("⏹️ Music stopped.");
        } catch {
            await interaction.reply({
                content: "No active music player.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        try {
            await stopMusic(client, message.guild.id);
            await message.reply("⏹️ Music stopped.");
        } catch {
            await message.reply("No active music player.");
        }
    }
};
