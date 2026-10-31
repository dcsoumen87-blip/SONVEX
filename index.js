import "dotenv/config";
import {
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";

import { loadCommands } from "./src/handlers/commandHandler.js";
import { loadEvents } from "./src/handlers/eventHandler.js";
import { createLavalink } from "./src/lavalink/manager.js";

const required = [
    "DISCORD_TOKEN",
    "LAVALINK_HOST",
    "LAVALINK_PORT",
    "LAVALINK_PASSWORD"
];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`${key} is missing.`);
    }
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
