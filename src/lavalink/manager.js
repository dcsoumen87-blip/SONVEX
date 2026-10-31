import { Shoukaku, Connectors } from "shoukaku";

export function createLavalink(client) {
    const nodes = [{
        name: "SONVEX-NODE-1",
        url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
        auth: process.env.LAVALINK_PASSWORD,
        secure: process.env.LAVALINK_SECURE === "true"
    }];

    const shoukaku = new Shoukaku(
        new Connectors.DiscordJS(client),
        nodes
    );

    client.shoukaku = shoukaku;

    shoukaku.on("ready", (name) => {
        console.log(`[LAVALINK] ${name} Connected`);
    });

    shoukaku.on("error", (name, error) => {
        console.error(`[LAVALINK] ${name}:`, error);
    });

    shoukaku.on("close", (name, code, reason) => {
        console.log(`[LAVALINK] ${name} Closed: ${code} ${reason}`);
    });

    shoukaku.on("disconnect", (name, count) => {
        console.log(`[LAVALINK] ${name} Disconnected: ${count}`);
    });

    return shoukaku;
}
