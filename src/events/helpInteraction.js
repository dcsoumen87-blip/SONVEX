import { isDeveloper } from "../utils/permissions.js";
import { categories, createEmbed } from "../commands/help/help.js";

export default {
    name: "interactionCreate",

    async execute(interaction) {
        if (
            !interaction.isStringSelectMenu() &&
            !interaction.isButton()
        ) return;

        if (
            interaction.customId !== "sonvex_help" &&
            !interaction.customId.startsWith("sonvex_")
        ) return;

        if (interaction.customId === "sonvex_close") {
            return interaction.update({
                content: "SONVEX Help Panel Closed.",
                embeds: [],
                components: []
            });
        }

        if (interaction.customId === "sonvex_home") {
            return interaction.update({
                embeds: [createEmbed("home")]
            });
        }

        if (interaction.customId === "sonvex_help") {
            const category = interaction.values[0];

            if (
                category === "developer" &&
                !isDeveloper(interaction.user.id)
            ) {
                return interaction.reply({
                    content: "Developer access required.",
                    ephemeral: true
                });
            }

            if (!categories[category]) return;

            return interaction.update({
                embeds: [createEmbed(category)]
            });
        }
    }
};
