export default {
    name: "ready",
    once: true,

    execute(client) {
        console.log("--------------------------------");
        console.log(`SONVEX ONLINE: ${client.user.tag}`);
        console.log(`Servers: ${client.guilds.cache.size}`);
        console.log("--------------------------------");

        client.user.setActivity("Your Music. Your Vibe.", {
            type: 2
        });
    }
};
