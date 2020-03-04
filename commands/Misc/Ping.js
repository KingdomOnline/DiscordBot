const Groups = require('../../util/Enums/Groups')

module.exports.run = async (bot,message,args,cmd) => {

    message.channel.send(`The bot's ping is ${bot.ping}`)

}

module.exports.help = {
    name: "ping",
    aliases: ["pong"],
    permission: Groups.DEFAULT,
    description: "Pings the bot",
    usage: "ping"
}