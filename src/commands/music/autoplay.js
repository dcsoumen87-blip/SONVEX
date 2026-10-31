import { SlashCommandBuilder } from "discord.js";
import { setAutoplay } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription("Enable or disable autoplay")
        .addBooleanOption(o =>
            o.setName("enabled")
                .setDescription("Autoplay status")
                .setRequired(true)
        ),

    async execute(interaction) {
        const enabled = interaction.options.getBoolean("enabled");
        setAutoplay(interaction.guildId, enabled);

        await interaction.reply(
            `🔄 Autoplay ${enabled ? "enabled" : "disabled"}.`
        );
    },

    async prefixExecute(message, args) {
        const value = args[0]?.toLowerCase();

        if (!["on", "off"].includes(value)) {
            return message.reply("Use `!autoplay on` or `!autoplay off`.");
        }

        setAutoplay(message.guild.id, value === "on");

        await message.reply(`🔄 Autoplay ${value}.`);
    }
};
