import { SlashCommandBuilder } from "discord.js";
import { skipMusic } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the current song"),

    async execute(interaction, client) {
        try {
            await skipMusic(client, interaction.guildId);

            await interaction.reply("⏭️ Current track skipped.");
        } catch (error) {
            await interaction.reply({
                content: "Unable to skip the current track.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        try {
            await skipMusic(client, message.guild.id);
            await message.reply("⏭️ Current track skipped.");
        } catch {
            await message.reply("Unable to skip the current track.");
        }
    }
};
