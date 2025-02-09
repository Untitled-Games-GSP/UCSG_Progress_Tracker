
module.exports = {
    name : "dev",
    desc : "The developer interface",
    longdesc : "This command is supposed to be invisible >:(",
    examples : [
        { name: "You get NO EXAMPLES", value: "`Get owned!`" }
    ],
    visible : false,

    Run(Bot, args, message) {
        let dev = false;
        Bot.config.devIds.forEach((id) => { dev |= (message.author.id === id); }); if (!dev) { return; }
        if (args.length <= 0) { return; }
        // Run through developer commands
        switch (args[0].toLowerCase())
        {
            case "push":
            case "up":
            case "update":
                Bot.store.dev.set("update", { recent: true, issuer: `${message.author}`, channel: message.channel.id, guild: message.guildId });
                process.exit(2);
            break;
            case "eval":
                args.shift();
                eval(args.join(" "));
            break;
        }
    }
}