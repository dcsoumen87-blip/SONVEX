import { SlashCommandBuilder } from "discord.js";
import { seekMusic } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Seek to a specific position")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("Position in seconds")
                .setMinValue(0)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const seconds = interaction.options.getInteger("seconds");

        try {
            await seekMusic(
                client,
                interaction.guildId,
                seconds * 1000
            );

            await interaction.reply(`⏩ Seeked to ${seconds} seconds.`);
        } catch {
            await interaction.reply({
                content: "Unable to seek this track.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        const seconds = Number(args[0]);

        if (!Number.isInteger(seconds) || seconds < 0) {
            return message.reply("Provide a valid time in seconds.");
        }

        try {
            await seekMusic(
                client,
                message.guild.id,
                seconds * 1000
            );

            await message.reply(`⏩ Seeked to ${seconds} seconds.`);
        } catch {
            await message.reply("Unable to seek this track.");
        }
    }
};
