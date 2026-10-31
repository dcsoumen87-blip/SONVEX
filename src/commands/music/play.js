import { SlashCommandBuilder } from "discord.js";
import { playMusic } from "../../services/musicService.js";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Song name or URL")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        await interaction.deferReply();

        try {
            const query = interaction.options.getString("query");

            const track = await playMusic(
                client,
                interaction,
                query
            );

            await interaction.editReply(
                `🎵 Now Playing: **${track.title}**`
            );
        } catch (error) {
            await interaction.editReply(getError(error));
        }
    },

    async prefixExecute(message, args, client) {
        const query = args.join(" ");

        if (!query) {
            return message.reply("Provide a song name or URL.");
        }

        try {
            const track = await playMusic(client, message, query);

            await message.reply(
                `🎵 Now Playing: **${track.title}**`
            );
        } catch (error) {
            await message.reply(getError(error));
        }
    }
};

function getError(error) {
    const errors = {
        JOIN_VOICE: "Join a voice channel first.",
        LAVALINK_OFFLINE: "Music server is currently unavailable.",
        NO_TRACK: "No matching song found.",
        NO_PLAYER: "No active music player."
    };

    return errors[error.message] || "Music playback failed.";
}
