const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const settings = require('../../settings.json')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const fs = require('fs');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a new prefix").send(message.channel);

    if(args[0] == settings.prefix) return new _NoticeEmbed(Colors.WARN, "This prefix is already the bot's prefix").send(message.channel);

    settings.prefix = args[0];

    fs.writeFile('./settings.json', JSON.stringify(settings), (err) => {
        if(err) console.log(err);
    })

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor(`Successfully set the bot prefix to ${args[0]}`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "setprefix",
    aliases: ["set-prefix","info"],
    permission: Groups.OWNER,
    description: "Sets the prefix for the bot",
    usage: "setprefix <prefix>"
}