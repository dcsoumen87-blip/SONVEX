import { config } from "../config/config.js";

export default {
    name: "messageCreate",

    async execute(message, client) {
        if (message.author.bot || !message.guild) return;
        if (!message.content.startsWith(config.prefix)) return;

        const args = message.content
            .slice(config.prefix.length)
            .trim()
            .split(/\s+/);

        const name = args.shift()?.toLowerCase();
        if (!name) return;

        const command = client.commands.get(name);
        if (!command?.prefixExecute) return;

        try {
            await command.prefixExecute(message, args, client);
        } catch (error) {
            console.error("[PREFIX ERROR]", error);
            await message.reply("An error occurred.");
        }
    }
};
