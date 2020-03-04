const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const settings = require('../../settings.json')

module.exports.run = async (bot,message,args,cmd) => {

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Bot Info")
        .setDescription(`\n\n
        **Username**: ${bot.user.username}
        **Servers**: ${bot.guilds.size}
        **Users**: ${bot.users.size}
        **Author**: ${settings.author}`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "botinfo",
    aliases: ["bot-info","info"],
    permission: Groups.DEFAULT,
    description: "Gets the info about the bot",
    usage: "botinfo"
}