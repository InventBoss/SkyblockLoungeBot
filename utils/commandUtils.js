module.exports = {
    sendMessage: async (isSlash, context, content) => {
        if (isSlash) {
            await context.reply(content);
        } else {
            context.channel.send(content);
        }
    },
};
