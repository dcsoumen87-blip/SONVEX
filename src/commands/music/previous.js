import { SlashCommandBuilder } from "discord.js";
import { playPrevious } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Play the previous track"),

    async execute(interaction, client) {
        try {
            const track = await playPrevious(client, interaction.guildId);
            await interaction.reply(`⏮️ Playing: **${track.title}**`);
        } catch {
            await interaction.reply({
                content: "No previous track available.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        try {
            const track = await playPrevious(client, message.guild.id);
            await message.reply(`⏮️ Playing: **${track.title}**`);
        } catch {
            await message.reply("No previous track available.");
        }
    }
};
