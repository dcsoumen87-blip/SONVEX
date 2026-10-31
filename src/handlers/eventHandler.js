import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function loadEvents(client) {
    const files = fs.readdirSync("./src/events")
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        const module = await import(
            pathToFileURL(path.resolve(`./src/events/${file}`)).href
        );

        const event = module.default;

        if (!event?.name || !event?.execute) continue;

        const handler = (...args) => event.execute(...args, client);

        if (event.once) {
            client.once(event.name, handler);
        } else {
            client.on(event.name, handler);
        }
    }

    console.log(`Loaded ${files.length} events.`);
}
