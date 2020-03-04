const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a message").send(message.channel);

    let messageToSend = args.join(" ");

    message.channel.send(messageToSend);
    message.delete().catch(O_o=>{});
}

module.exports.help = {
    name: "say",
    aliases: ["bc", "broadcast", "send"],
    permission: Groups.MOD,
    description: "Sends a message through the bot",
    usage: "say <message>"
}