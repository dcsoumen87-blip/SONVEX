import "dotenv/config";
import {
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";

import { loadCommands } from "./src/handlers/commandHandler.js";
import { loadEvents } from "./src/handlers/eventHandler.js";
import { createLavalink } from "./src/lavalink/manager.js";

if (!process.env.DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN is missing.");
}

if (
    !process.env.LAVALINK_HOST ||
    !process.env.LAVALINK_PORT ||
    !process.env.LAVALINK_PASSWORD
) {
    throw new Error("Lavalink configuration is missing.");
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

createLavalink(client);

await client.login(process.env.DISCORD_TOKEN);
