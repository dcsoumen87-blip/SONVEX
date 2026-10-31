import { SlashCommandBuilder } from "discord.js";
import { removeTrack } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove a track from queue")
        .addIntegerOption(o =>
            o.setName("position")
                .setDescription("Track position")
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const position = interaction.options.getInteger("position");
            const track = removeTrack(interaction.guildId, position);

            await interaction.reply(`🗑️ Removed: **${track.title}**`);
        } catch {
            await interaction.reply({
                content: "Invalid queue position.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args) {
        try {
            const track = removeTrack(message.guild.id, Number(args[0]));
            await message.reply(`🗑️ Removed: **${track.title}**`);
        } catch {
            await message.reply("Invalid queue position.");
        }
    }
};
