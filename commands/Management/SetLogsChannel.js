const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const ms = require('ms')
const fs = require('fs');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a channel").send(message.channel);

    let channelStr = args[0];
    channelStr = channelStr.replace("<#", "");
    channelStr = channelStr.replace(">", "");

    let channel = message.guild.channels.get(channelStr)

    if(!channel) return new _NoticeEmbed(Colors.ERROR, "Invalid channel - Specify a valid channel").send(message.channel);

    settings.logsChannelId = channel.id;

    fs.writeFile('./settings.json', JSON.stringify(settings), err => {
        if(err) console.log(err);
    })

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`You have successfully set the logs channel to <#${channel.id}>`);

    message.channel.send(embed);

}

module.exports.help = {
    name: "setlogschannel",
    aliases: ["set-logs-channel", "logschannel"],
    permission: Groups.ADMIN,
    description: "Sets the logs channel",
    usage: "setlogschannel <channel>"
}