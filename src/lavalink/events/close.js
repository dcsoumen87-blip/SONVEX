export default {
    name: "close",

    execute(code, reason) {
        console.log(`[LAVALINK CLOSED] ${code}: ${reason}`);
    }
};
