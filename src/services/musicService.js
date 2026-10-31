const queues = new Map();

function createQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            tracks: [],
            previous: [],
            current: null,
            player: null,
            textChannel: null,
            voiceChannel: null,
            volume: 100,
            loop: "off",
            autoplay: false,
            processing: false,
            skipRequested: false
        });
    }

    return queues.get(guildId);
}

function getQueue(guildId) {
    return queues.get(guildId) || null;
}

function saveHistory(data, track) {
    if (!track) return;

    data.previous.push(track);

    if (data.previous.length > 50) {
        data.previous.shift();
    }
}

async function playNext(guildId) {
    const data = getQueue(guildId);

    if (!data || !data.player || data.processing) return;

    data.processing = true;

    try {
        let track;

        if (data.loop === "track" && data.current && !data.skipRequested) {
            track = data.current;
        } else {
            if (data.current) {
                saveHistory(data, data.current);
            }

            if (data.skipRequested) {
                data.skipRequested = false;
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

        await data.player.setGlobalVolume(data.volume);

        await data.player.playTrack({
            track: {
                encoded: track.encoded
            }
        });

        if (data.textChannel) {
            await data.textChannel.send({
                content: `🎵 **Now Playing:** ${track.title}`
            }).catch(() => {});
        }
    } catch (error) {
        console.error("[SONVEX PLAY ERROR]", error);

        data.current = null;

        if (data.tracks.length) {
            await playNext(guildId);
        }
    } finally {
        data.processing = false;
    }
}

export async function playMusic(client, context, query) {
    const guild = context.guild;
    const guildId = guild.id;
    const member = context.member;
    const voice = member.voice?.channel;

    if (!voice) {
        throw new Error("JOIN_VOICE");
    }

    const node = client.shoukaku.options.nodeResolver(
        client.shoukaku.nodes
    );

    if (!node || node.state !== 1) {
        throw new Error("LAVALINK_OFFLINE");
    }

    const data = createQueue(guildId);

    if (data.voiceChannel && data.voiceChannel !== voice.id) {
        if (data.current) {
            throw new Error("DIFFERENT_VOICE_CHANNEL");
        }
    }

    const player = await client.shoukaku.joinVoiceChannel({
        guildId,
        channelId: voice.id,
        shardId: guild.shardId,
        deaf: true
    });

    data.player = player;
    data.voiceChannel = voice.id;
    data.textChannel = context.channel;

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
        requester: context.user.id
    }));

    const shouldStart = !data.current;

    data.tracks.push(...tracks);

    if (shouldStart) {
        await playNext(guildId);

        return {
            ...tracks[0],
            queued: false
        };
    }

    return {
        ...tracks[0],
        queued: true
    };
}

export async function handleTrackEnd(client, player, event) {
    const data = getQueue(player.guildId);

    if (!data || data.player !== player) return;

    if (
        event.reason === "FINISHED" ||
        event.reason === "LOAD_FAILED"
    ) {
        await playNext(player.guildId);
    }
}

export function getQueueData(guildId) {
    return getQueue(guildId);
}

export async function pauseMusic(guildId) {
    const data = getQueue(guildId);

    if (!data?.player || !data.current) {
        throw new Error("NO_PLAYER");
    }

    await data.player.setPaused(true);
}

export async function resumeMusic(guildId) {
    const data = getQueue(guildId);

    if (!data?.player || !data.current) {
        throw new Error("NO_PLAYER");
    }

    await data.player.setPaused(false);
}

export async function stopMusic(guildId) {
    const data = getQueue(guildId);

    if (!data?.player) {
        throw new Error("NO_PLAYER");
    }

    data.tracks = [];
    data.previous = [];
    data.current = null;
    data.skipRequested = false;

    await data.player.stopTrack();
}

export async function skipMusic(guildId) {
    const data = getQueue(guildId);

    if (!data?.player || !data.current) {
        throw new Error("NO_PLAYER");
    }

    data.skipRequested = true;

    await data.player.stopTrack();
}

export async function playPrevious(guildId) {
    const data = getQueue(guildId);

    if (!data?.player || !data.previous.length) {
        throw new Error("NO_PREVIOUS");
    }

    const previous = data.previous.pop();

    if (data.current) {
        data.tracks.unshift(data.current);
    }

    data.current = previous;

    await data.player.playTrack({
        track: {
            encoded: previous.encoded
        }
    });

    return previous;
}

export function removeTrack(guildId, position) {
    const data = getQueue(guildId);

    if (!data || position < 1 || position > data.tracks.length) {
        throw new Error("INVALID_POSITION");
    }

    return data.tracks.splice(position - 1, 1)[0];
}

export function clearQueue(guildId) {
    const data = getQueue(guildId);

    if (!data) throw new Error("NO_QUEUE");

    data.tracks = [];
}

export function shuffleQueue(guildId) {
    const data = getQueue(guildId);

    if (!data || data.tracks.length < 2) {
        throw new Error("NOT_ENOUGH_TRACKS");
    }

    for (let i = data.tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [data.tracks[i], data.tracks[j]] = [
            data.tracks[j],
            data.tracks[i]
        ];
    }
}

export function moveTrack(guildId, from, to) {
    const data = getQueue(guildId);

    if (
        !data ||
        from < 1 ||
        to < 1 ||
        from > data.tracks.length ||
        to > data.tracks.length
    ) {
        throw new Error("INVALID_POSITION");
    }

    const [track] = data.tracks.splice(from - 1, 1);

    data.tracks.splice(to - 1, 0, track);

    return track;
}

export function setLoop(guildId, mode) {
    const data = getQueue(guildId);

    if (!data || !["off", "track", "queue"].includes(mode)) {
        throw new Error("INVALID_LOOP_MODE");
    }

    data.loop = mode;

    return mode;
}

export function setAutoplay(guildId, enabled) {
    const data = getQueue(guildId);

    if (!data) throw new Error("NO_QUEUE");

    data.autoplay = enabled;

    return enabled;
}

export async function setVolume(guildId, volume) {
    const data = getQueue(guildId);

    if (!data?.player) {
        throw new Error("NO_PLAYER");
    }

    if (!Number.isInteger(volume) || volume < 1 || volume > 100) {
        throw new Error("INVALID_VOLUME");
    }

    data.volume = volume;

    await data.player.setGlobalVolume(volume);

    return volume;
}

export function getCurrentTrack(guildId) {
    return getQueue(guildId)?.current || null;
}
