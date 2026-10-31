const queues = new Map();

function getQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            tracks: [],
            previous: [],
            current: null,
            loop: "off",
            autoplay: false,
            volume: 100,
            player: null,
            textChannel: null
        });
    }

    return queues.get(guildId);
}

async function playNext(client, guildId) {
    const data = getQueue(guildId);

    let track;

    if (data.loop === "track" && data.current) {
        track = data.current;
    } else {
        if (data.current) {
            data.previous.push(data.current);
            if (data.previous.length > 50) data.previous.shift();
        }

        track = data.tracks.shift();

        if (!track && data.loop === "queue" && data.previous.length) {
            data.tracks = [...data.previous];
            data.previous = [];
            track = data.tracks.shift();
        }
    }

    if (!track) {
        data.current = null;
        return;
    }

    data.current = track;

    await data.player.playTrack({
        track: { encoded: track.encoded }
    });

    if (data.textChannel) {
        await data.textChannel.send(
            `🎵 Now Playing: **${track.title}**`
        ).catch(() => {});
    }
}

export async function playMusic(client, interaction, query) {
    const guildId = interaction.guildId || interaction.guild.id;
    const member = interaction.member;
    const voice = member.voice?.channel;

    if (!voice) throw new Error("JOIN_VOICE");

    const node = client.shoukaku.options.nodeResolver(
        client.shoukaku.nodes
    );

    if (!node || node.state !== 1) {
        throw new Error("LAVALINK_OFFLINE");
    }

    const data = getQueue(guildId);

    const player = await client.shoukaku.joinVoiceChannel({
        guildId,
        channelId: voice.id,
        shardId: interaction.guild.shardId,
        deaf: true
    });

    data.player = player;
    data.textChannel = interaction.channel;

    const identifier = /^https?:\/\//i.test(query)
        ? query
        : `ytsearch:${query}`;

    const result = await player.node.rest.resolve(identifier);

    if (!result?.tracks?.length) {
        throw new Error("NO_TRACK");
    }

    const tracks = result.tracks.map(track => ({
        encoded: track.encoded,
        title: track.info.title,
        author: track.info.author,
        uri: track.info.uri,
        length: track.info.length,
        requester: interaction.user.id
    }));

    if (!data.current) {
        data.current = null;
        data.tracks.push(...tracks);
        await playNext(client, guildId);
        return { ...data.current, queued: false };
    }

    data.tracks.push(...tracks);

    return { ...tracks[0], queued: true };
}

export async function handleTrackEnd(client, player, event) {
    const data = queues.get(player.guildId);

    if (!data) return;

    if (event.reason === "FINISHED" || event.reason === "LOAD_FAILED") {
        await playNext(client, player.guildId);
    }
}

export function getQueueData(guildId) {
    return getQueue(guildId);
}

export async function skipMusic(client, guildId) {
    const data = getQueue(guildId);

    if (!data.current) throw new Error("NO_PLAYER");

    if (!data.tracks.length && data.loop !== "track") {
        data.current = null;
        await data.player.stopTrack();
        return;
    }

    await data.player.stopTrack();
    await playNext(client, guildId);
}

export async function removeTrack(guildId, position) {
    const data = getQueue(guildId);

    if (position < 1 || position > data.tracks.length) {
        throw new Error("INVALID_POSITION");
    }

    return data.tracks.splice(position - 1, 1)[0];
}

export function clearQueue(guildId) {
    const data = getQueue(guildId);
    const count = data.tracks.length;
    data.tracks = [];
    return count;
}

export function shuffleQueue(guildId) {
    const tracks = getQueue(guildId).tracks;

    for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }

    return tracks.length;
}

export function moveTrack(guildId, from, to) {
    const tracks = getQueue(guildId).tracks;

    if (
        from < 1 || to < 1 ||
        from > tracks.length || to > tracks.length
    ) {
        throw new Error("INVALID_POSITION");
    }

    const [track] = tracks.splice(from - 1, 1);
    tracks.splice(to - 1, 0, track);
}

export function setLoop(guildId, mode) {
    const data = getQueue(guildId);

    if (!["off", "track", "queue"].includes(mode)) {
        throw new Error("INVALID_LOOP");
    }

    data.loop = mode;
    return mode;
}

export function setAutoplay(guildId, enabled) {
    const data = getQueue(guildId);
    data.autoplay = enabled;
    return enabled;
}

export async function playPrevious(client, guildId) {
    const data = getQueue(guildId);

    if (!data.previous.length) {
        throw new Error("NO_PREVIOUS");
    }

    if (data.current) data.tracks.unshift(data.current);

    data.current = data.previous.pop();

    await data.player.playTrack({
        track: { encoded: data.current.encoded }
    });

    return data.current;
}
