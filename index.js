import "dotenv/config";

import {
    Client,
    Collection,
    GatewayIntentBits
} from "discord.js";

import { loadCommands } from "./src/handlers/commandHandler.js";
import { loadEvents } from "./src/handlers/eventHandler.js";
import { createLavalink } from "./src/lavalink/manager.js";
import { registerPlayerEvents } from "./src/events/playerEvents.js";

const requiredEnv = [
    "DISCORD_TOKEN",
    "CLIENT_ID",
    "LAVALINK_HOST",
    "LAVALINK_PORT",
    "LAVALINK_PASSWORD"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.error(`[ENV ERROR] ${key} is missing.`);
        process.exit(1);
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
client.prefix = process.env.PREFIX || "!";

async function startBot() {
    try {
        console.log("[SONVEX] Initializing...");

        // Load commands
        await loadCommands(client);
        console.log("[SONVEX] Commands loaded.");

        // Load Discord events
        await loadEvents(client);
        console.log("[SONVEX] Discord events loaded.");

        // Initialize Lavalink
        createLavalink(client);
        console.log("[SONVEX] Lavalink manager initialized.");

        // Register music player events
        registerPlayerEvents(client);

        // Login
        await client.login(process.env.DISCORD_TOKEN);

    } catch (error) {
        console.error("[SONVEX STARTUP ERROR]", error);
        process.exit(1);
    }
}

client.on("error", error => {
    console.error("[DISCORD CLIENT ERROR]", error);
});

process.on("unhandledRejection", error => {
    console.error("[UNHANDLED REJECTION]", error);
});

process.on("uncaughtException", error => {
    console.error("[UNCAUGHT EXCEPTION]", error);
});

startBot();
