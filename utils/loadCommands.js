const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {
    loadCommands: (client) => {
        console.log("(STARTUP) Started loading commands");

        let commands = [];
        const commandFiles = fs
            .readdirSync("./commands")
            .filter((file) => file.endsWith(".js"));

        for (file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
            commands.push(command.slashData.toJSON());
        }

        const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]);

        try {
            client.guilds.cache.map((guild) =>
                rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id),
                    {
                        body: commands,
                    }
                )
            );
        } catch (error) {
            console.log(error);
        }

        console.log("(STARTUP) Successfully loaded commands");
        return client.commands;
    },
};
