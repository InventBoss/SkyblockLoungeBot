const { SlashCommandBuilder } = require("@discordjs/builders");
const commandUtils = require("../utils/commandUtils");
const axios = require("axios");

module.exports = {
    name: "verify",
    slashData: new SlashCommandBuilder()
        .setName("verify")
        .setDescription(
            "If you've linked your Minecraft to your Discord on Hypixel, you can get a role."
        )
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Put your minecraft name here")
                .setRequired(true)
        ),
    async execute(isSlash, context, args) {
        if (typeof args?.[0] === "undefined" && !isSlash)
            return commandUtils.sendMessage(
                isSlash,
                context,
                `It seems you haven't entered a valid username.\nYou must enter your Minecraft username to verify.`
            );

        const uuidRequest = await axios.get(
            `https://api.mojang.com/users/profiles/minecraft/${
                args?.[0] || context.options?.getString("username")
            }`
        );

        if (uuidRequest.status === 204)
            return commandUtils.sendMessage(
                isSlash,
                context,
                `It seems you haven't entered a valid username.\nYou must enter your Minecraft username to verify.`
            );

        const request = await axios
            .get(
                `https://api.hypixel.net/player?key=${process.env["HYPIXEL_KEY"]}&uuid=${uuidRequest.data.id}`
            )
            .then((request) => request.data.player);

        if (typeof request === "undefined")
            return commandUtils.sendMessage(
                isSlash,
                context,
                `That player doesn't play Hypixel. Please reinput your name if you misspelled it.`
            );

        if (
            request.socialMedia?.links?.DISCORD ===
            (context.user?.tag || context.author?.tag)
        ) {
            const role = context.guild.roles.cache.find((r) => r.name === "Linked");

            if (context.member.roles.cache.has(role.id))
                return commandUtils.sendMessage(
                    isSlash,
                    context,
                    "It seems you've already had your account linked."
                );

            context.member.roles.add(role)
            try {
                context.member.setNickname(request.displayname)
            } catch (error) {
                throw error
            }
            commandUtils.sendMessage(
                isSlash,
                context,
                `You've linked the Discord account "${request.socialMedia?.links?.DISCORD}" to the Minecraft account "${request.displayname}"`
            );

        } else {
            commandUtils.sendMessage(
                isSlash,
                context,
                `Could not verify minecraft user "${request.displayname}" linked their discord account on Hypixel.
To link your Minecraft account on Hypixel to your Discord, you must:\n
- Go onto the hypixel server
- Going to your settings
- Going to socials
- Selecting the Discord icon and putting your Discord username (eg InventBoss)`
            );
        }
    },
};
