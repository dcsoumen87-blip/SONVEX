import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";

const commands = [];

const folders = fs.readdirSync("./src/commands");

for (const folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        const module = await import(
            path.resolve(`./src/commands/${folder}/${file}`)
                .replaceAll("\\", "/")
                .replace(/^/, "file://")
        );

        if (module.default?.data) {
            commands.push(module.default.data.toJSON());
        }
    }
}

const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
);

console.log(`Registered ${commands.length} slash commands.`);
