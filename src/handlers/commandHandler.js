import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function loadCommands(client) {
    const root = path.resolve("src/commands");

    for (const folder of fs.readdirSync(root)) {
        const directory = path.join(root, folder);

        for (const file of fs.readdirSync(directory)) {
            if (!file.endsWith(".js")) continue;

            const module = await import(
                pathToFileURL(path.join(directory, file)).href
            );

            const command = module.default;

            if (command?.data && command?.execute) {
                client.commands.set(command.data.name, command);
            }
        }
    }

    console.log(`[COMMANDS] ${client.commands.size} loaded`);
}
