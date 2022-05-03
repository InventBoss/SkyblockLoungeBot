const Discord = require("discord.js");
const { loadCommands } = require("./utils/loadCommands.js");
const { runSlashCommand, runTextCommand } = require("./utils/runCommand.js");
require("dotenv").config();

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
client.commands = new Discord.Collection();

client.on("ready", () => {
    client.user.setActivity("the members of SBL.", {
        type: "WATCHING",
    });
    client.commands = loadCommands(client);
    console.log(`(STARTUP) "${client.user.tag}" online`);
});

client.on("messageCreate", (message) => {
    runTextCommand(message);
});

client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) runSlashCommand(interaction);
});

client.login(process.env["TOKEN"]);
