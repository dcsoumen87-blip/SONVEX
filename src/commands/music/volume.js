import { SlashCommandBuilder } from "discord.js";
import { setVolume } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change music volume")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Volume from 1 to 100")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const volume = interaction.options.getInteger("amount");

        try {
            await setVolume(client, interaction.guildId, volume);

            await interaction.reply(`🔊 Volume set to ${volume}%.`);
        } catch {
            await interaction.reply({
                content: "Unable to change volume.",
                ephemeral: true
            });
        }
    },

    async prefixExecute(message, args, client) {
        const volume = Number(args[0]);

        if (!Number.isInteger(volume) || volume < 1 || volume > 100) {
            return message.reply("Use a volume between 1 and 100.");
        }

        try {
            await setVolume(client, message.guild.id, volume);
            await message.reply(`🔊 Volume set to ${volume}%.`);
        } catch {
            await message.reply("Unable to change volume.");
        }
    }
};
