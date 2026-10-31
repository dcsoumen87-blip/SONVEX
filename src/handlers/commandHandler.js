import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function loadCommands(client) {
    const folders = fs.readdirSync("./src/commands");

    for (const folder of folders) {
        const files = fs.readdirSync(`./src/commands/${folder}`)
            .filter(file => file.endsWith(".js"));

        for (const file of files) {
            const module = await import(
                pathToFileURL(path.resolve(`./src/commands/${folder}/${file}`)).href
            );

            if (module.default?.data && module.default?.execute) {
                client.commands.set(module.default.data.name, module.default);
            }
        }
    }

    console.log(`Loaded ${client.commands.size} commands.`);
}
