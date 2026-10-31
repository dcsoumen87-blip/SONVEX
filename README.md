<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,50:075985,100:06B6D4&height=210&section=header&text=SONVEX&fontSize=58&fontColor=FFFFFF&fontAlignY=38&desc=YOUR%20MUSIC.%20YOUR%20VIBE.%20YOUR%20WORLD.&descAlignY=60&descSize=16"/>

### 🎵 An Advanced Discord Music Bot

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Shoukaku](https://img.shields.io/badge/Shoukaku-4.3.0-06B6D4?style=for-the-badge)](https://github.com/shipgirlproject/Shoukaku)
[![Lavalink](https://img.shields.io/badge/Audio-Lavalink-0F172A?style=for-the-badge)](https://lavalink.dev/)

**SONVEX** is a Discord music bot project built with Discord.js and powered by Lavalink through Shoukaku. It is being actively developed, with a modular command system and music playback services.

</div>

---

## 📌 Project Status

> 🚧 **Under Active Development**  
> SONVEX is a work in progress. Features, commands, configuration and setup instructions may change as development continues. Some commands may not yet be fully tested or production-ready.

---

## ✨ Current Features

The repository currently contains implementation for the following areas:

- 🎧 Discord voice-channel integration
- 🔎 Search tracks by query
- 🔗 Play tracks from supported URLs
- 🎵 Music queue management
- ⏭️ Skip the current track
- ⏮️ Play the previous track
- ⏸️ Pause and resume playback
- ⏹️ Stop playback
- 🔊 Volume control
- 🔁 Track and queue loop modes
- 🔀 Shuffle queued tracks
- 📜 View the current queue
- 🎼 Now-playing information
- ⚙️ Slash-command and prefix-command handlers
- 📡 Lavalink connection event handling and reconnection configuration

*Feature availability may change during development. See the source code and test the current build before using it in a live server.*

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) 20+ | JavaScript runtime |
| [Discord.js](https://discord.js.org/) v14 | Discord API framework |
| [Shoukaku](https://github.com/shipgirlproject/Shoukaku) 4.3.0 | Lavalink client |
| [Lavalink](https://lavalink.dev/) | Audio playback server |
| [dotenv](https://github.com/motdotla/dotenv) | Environment configuration |
| JavaScript ES Modules | Project module system |

---

## 📁 Project Structure

```text
SONVEX/
├── index.js
├── package.json
├── .env.example
├── .gitignore
├── scripts/
│   └── deploy-commands.js
├── lavalink/
│   └── application.yml
└── src/
    ├── commands/
    │   └── music/
    ├── config/
    │   └── config.js
    ├── events/
    ├── handlers/
    │   ├── commandHandler.js
    │   └── eventHandler.js
    ├── lavalink/
    │   └── manager.js
    └── services/
        └── musicService.js
```

---

## ⚙️ Requirements

Before setting up SONVEX, make sure you have:

- Node.js 20 or newer
- npm
- A Discord application and bot token
- A running Lavalink server
- Access to configure the Discord bot and invite it to a test server

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/dcsoumen87-blip/SONVEX.git
cd SONVEX
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add:

```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_application_id
PREFIX=!

LAVALINK_HOST=your_lavalink_host
LAVALINK_PORT=443
LAVALINK_PASSWORD=your_lavalink_password
LAVALINK_SECURE=true
```

Replace the example values with your own credentials and Lavalink connection details.

### 4. Configure Lavalink

SONVEX includes a Lavalink configuration template at:

```text
lavalink/application.yml
```

Configure your Lavalink server and set `LAVALINK_SERVER_PASSWORD` in the Lavalink server environment to match the password configured for the bot.

Make sure the Lavalink host, port, password and secure setting in the bot's `.env` match the actual Lavalink server configuration.

### 5. Register slash commands

```bash
npm run deploy
```

### 6. Start SONVEX

```bash
npm start
```

For development with Node's watch mode:

```bash
npm run dev
```

---

## 🎮 Commands

SONVEX has both slash-command and prefix-command handling. The default prefix is `!`.

| Command | Description |
|---|---|
| `/play <query>` · `!play <query>` | Search for or play a track |
| `/skip` · `!skip` | Skip the current track |
| `/previous` · `!previous` | Play the previous track |
| `/pause` · `!pause` | Pause playback |
| `/resume` · `!resume` | Resume playback |
| `/stop` · `!stop` | Stop playback |
| `/queue` · `!queue` | Display the music queue |
| `/nowplaying` | Show the current track |
| `/volume <amount>` · `!volume <amount>` | Set volume (1–100) |
| `/loop <mode>` · `!loop <mode>` | Set loop mode: `off`, `track`, or `queue` |
| `/shuffle` · `!shuffle` | Shuffle the queue |
| `/clear` · `!clear` | Clear queued tracks |

> **Development note:** This command list reflects command modules currently present in the repository. Some modules may need further integration or testing before all commands work as expected.

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Discord bot token |
| `CLIENT_ID` | Discord application/client ID |
| `PREFIX` | Prefix for text commands; defaults to `!` |
| `LAVALINK_HOST` | Lavalink server hostname |
| `LAVALINK_PORT` | Lavalink server port |
| `LAVALINK_PASSWORD` | Lavalink server password |
| `LAVALINK_SECURE` | Use a secure Lavalink connection (`true`/`false`) |

**Security:** Never commit your `.env` file, Discord token, Lavalink password or other private credentials. Keep secrets in your hosting provider's environment-variable settings.

---

## 🛠️ Development

Contributions, testing and constructive feedback are welcome. Since SONVEX is under active development, please check the latest repository code before opening issues or relying on a feature.

If you find a bug:

1. Check whether it is reproducible on the latest version.
2. Include the command used and the relevant error log.
3. Remove all tokens, passwords and other secrets from logs before sharing.
4. Describe the expected and actual behaviour.

---

## 👨‍💻 Developer

<div align="center">

**MOD TRYOUT**

[![GitHub](https://img.shields.io/badge/GitHub-dcsoumen87--blip-181717?style=for-the-badge&logo=github)](https://github.com/dcsoumen87-blip)

</div>

---

<div align="center">

**SONVEX — Your Music. Your Vibe. Your World.**

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,50:075985,100:0F172A&height=110&section=footer"/>

</div>
