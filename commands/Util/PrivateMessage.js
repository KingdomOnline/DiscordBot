const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]);

    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid user - Specify a valid user (mention or id)").send(message.channel);

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a message").send(message.channel);

    let modArgs = args;
    modArgs.shift();
    let messageToSend = modArgs.join(" ");

    user.send(messageToSend);
    message.delete().catch(O_o=>{});

}

module.exports.help = {
    name: "dm",
    aliases: ["pm", "privatemessage", "message"],
    permission: Groups.MOD,
    description: "Sends a private message to a user through the bot",
    usage: "dm <mention|id> <message>"
}