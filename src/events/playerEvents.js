import { handleTrackEnd } from "../services/musicService.js";

export function registerPlayerEvents(client) {
    client.shoukaku.on("playerCreate", player => {
        player.on("end", event => {
            handleTrackEnd(client, player, event)
                .catch(console.error);
        });

        player.on("exception", error => {
            console.error("[MUSIC ERROR]", error);
        });

        player.on("stuck", error => {
            console.error("[MUSIC STUCK]", error);
        });
    });
}
