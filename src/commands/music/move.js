import { SlashCommandBuilder } from "discord.js";
import { moveTrack } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Move a track in the queue")
        .addIntegerOption(o =>
            o.setName("from")
                .setDescription("Current position")
                .setMinValue(1)
                .setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("to")
                .setDescription("New position")
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            moveTrack(
                interaction.guildId,
                interaction.options.getInteger("from"),
                interaction.options.getInteger("to")
            );

            await interaction.reply("↕️ Track moved successfully.");
        } catch {
            await interaction.reply({
                content: "Invalid queue position.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args) {
        try {
            moveTrack(
                message.guild.id,
                Number(args[0]),
                Number(args[1])
            );

            await message.reply("↕️ Track moved successfully.");
        } catch {
            await message.reply("Invalid queue position.");
        }
    }
};
