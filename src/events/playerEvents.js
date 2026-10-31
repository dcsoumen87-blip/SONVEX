import { handleTrackEnd } from "../services/musicService.js";

export function registerPlayerEvents(client) {
    client.shoukaku.on("playerCreate", player => {

        player.on("end", async event => {
            try {
                if (event.reason !== "FINISHED") return;

                await handleTrackEnd(client, player, event);
            } catch (error) {
                console.error("[QUEUE ERROR]", error);
            }
        });

        player.on("exception", error => {
            console.error("[MUSIC EXCEPTION]", error);
        });

        player.on("stuck", error => {
            console.error("[MUSIC STUCK]", error);
        });

        player.on("closed", event => {
            console.log(
                `[PLAYER CLOSED] Guild: ${player.guildId}`,
                event
            );
        });

    });

    console.log("[MUSIC EVENTS] Player events registered.");
}
