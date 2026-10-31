const currentTracks = new Map();

export async function playMusic(client, message, query) {
    const guild = message.guild;
    const voice = message.member.voice.channel;

    if (!voice) throw new Error("JOIN_VOICE");

    const shoukaku = client.shoukaku;
    const node = shoukaku.options.nodeResolver(shoukaku.nodes);

    if (!node || node.state !== 1) {
        throw new Error("LAVALINK_OFFLINE");
    }

    const player = await shoukaku.joinVoiceChannel({
        guildId: guild.id,
        channelId: voice.id,
        shardId: guild.shardId,
        deaf: true
    });

    const identifier = /^(https?:\/\/)/i.test(query)
        ? query
        : `ytsearch:${query}`;

    const result = await player.node.rest.resolve(identifier);

    if (!result || !result.tracks?.length) {
        throw new Error("NO_TRACK");
    }

    const track = result.tracks[0];

    await player.playTrack({
        track: {
            encoded: track.encoded
        }
    });

    currentTracks.set(guild.id, {
        title: track.info.title,
        author: track.info.author,
        uri: track.info.uri,
        length: track.info.length,
        requester: message.author.id
    });

    return currentTracks.get(guild.id);
}

export async function pauseMusic(client, guildId) {
    const player = client.shoukaku.players.get(guildId);
    if (!player) throw new Error("NO_PLAYER");

    await player.setPaused(true);
}

export async function resumeMusic(client, guildId) {
    const player = client.shoukaku.players.get(guildId);
    if (!player) throw new Error("NO_PLAYER");

    await player.setPaused(false);
}

export async function stopMusic(client, guildId) {
    const player = client.shoukaku.players.get(guildId);
    if (!player) throw new Error("NO_PLAYER");

    await player.stopTrack();
    await client.shoukaku.leaveVoiceChannel(guildId);

    currentTracks.delete(guildId);
}

export async function skipMusic(client, guildId) {
    const player = client.shoukaku.players.get(guildId);
    if (!player) throw new Error("NO_PLAYER");

    await player.stopTrack();
    currentTracks.delete(guildId);
}

export async function setVolume(client, guildId, volume) {
    const player = client.shoukaku.players.get(guildId);
    if (!player) throw new Error("NO_PLAYER");

    await player.setGlobalVolume(volume);
}

export function getCurrentTrack(guildId) {
    return currentTracks.get(guildId);
}

export async function seekMusic(client, guildId, position) {
    const player = client.shoukaku.players.get(guildId);
    if (!player) throw new Error("NO_PLAYER");

    await player.seekTo(position);
}
