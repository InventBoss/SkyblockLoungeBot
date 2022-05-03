const { prefix } = require("../config.json");

module.exports = {
    runSlashCommand: (interaction) => {
        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) return;

        try {
            command.execute(true, interaction);
            console.log(
                `(COMMAND) "${interaction.user.tag}" executed ${interaction.commandName} in ${interaction.guild}`
            );
        } catch (error) {
            console.log("(ERROR)", error);
            interaction.reply(
                `there was an error trying to execute \`>${interaction.commandName}\``
            );
        }
    },
    runTextCommand: (message) => {
        if (
            !message.content.startsWith(prefix) ||
            message.author.id === message.client.user.id
        )
            return;
        if (message.author.bot)
            return message.channel.send(
                "ATENTION REBELLING BOT\n\nPLEASE CEASE THIS ACTION."
            );

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const text = args.join(" ");

        const command = message.client.commands.get(commandName);

        if (!command) return;

        try {
            command.execute(false, message, args, text);

            const location = message.guild || "DM";
            console.log(
                `(COMMAND) "${message.author.tag}" executed ${commandName} in ${location}`
            );
        } catch (error) {
            console.log("(ERROR)", error);
            message.reply(
                `there was an error trying to execute \`>${commandName}\``
            );
        }
    },
};
