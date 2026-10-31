import { Shoukaku, Connectors } from "shoukaku";

export function createLavalink(client) {
    const nodes = [{
        name: "SONVEX",
        url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
        auth: process.env.LAVALINK_PASSWORD,
        secure: process.env.LAVALINK_SECURE === "true"
    }];

    const shoukaku = new Shoukaku(
        new Connectors.DiscordJS(client),
        nodes,
        {
            resume: true,
            resumeTimeout: 60,
            reconnectTries: 10,
            reconnectInterval: 5
        }
    );

    client.shoukaku = shoukaku;

    shoukaku.on("ready", name => {
        console.log(`[LAVALINK] ${name} Connected`);
    });

    shoukaku.on("error", (name, error) => {
        console.error(`[LAVALINK ERROR] ${name}:`, error);
    });

    shoukaku.on("close", (name, code, reason) => {
        console.log(`[LAVALINK CLOSED] ${name}: ${code} ${reason}`);
    });

    shoukaku.on("disconnect", name => {
        console.log(`[LAVALINK DISCONNECTED] ${name}`);
    });

    shoukaku.on("reconnecting", name => {
        console.log(`[LAVALINK RECONNECTING] ${name}`);
    });

    return shoukaku;
}
