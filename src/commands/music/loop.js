import { SlashCommandBuilder } from "discord.js";
import { setLoop } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Change loop mode")
        .addStringOption(o =>
            o.setName("mode")
                .setDescription("Loop mode")
                .setRequired(true)
                .addChoices(
                    { name: "Off", value: "off" },
                    { name: "Track", value: "track" },
                    { name: "Queue", value: "queue" }
                )
        ),

    async execute(interaction) {
        const mode = interaction.options.getString("mode");
        setLoop(interaction.guildId, mode);

        await interaction.reply(`🔁 Loop mode: **${mode}**`);
    },

    async prefixExecute(message, args) {
        const mode = args[0]?.toLowerCase();

        try {
            setLoop(message.guild.id, mode);
            await message.reply(`🔁 Loop mode: **${mode}**`);
        } catch {
            await message.reply("Use: `!loop off`, `!loop track`, `!loop queue`");
        }
    }
};
