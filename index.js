import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { loadCommands } from "./src/handlers/commandHandler.js";
import { loadEvents } from "./src/handlers/eventHandler.js";

if (!process.env.DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN is missing.");
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

await loadCommands(client);
await loadEvents(client);

await client.login(process.env.DISCORD_TOKEN);
