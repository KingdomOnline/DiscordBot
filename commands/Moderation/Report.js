const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')

module.exports.run = async (bot,message,args,cmd) => {

    var logsEnabled

    if(!settings.logsChannelId || settings.logsChannelId == '' || settings.logsChannelId.toLowerCase() == 'false'){
        logsEnabled = false;
    } else {
        logsEnabled = true;
    }

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid user - This user does not exist").send(message.channel);

    if(user.username == undefined) user = user.user;

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a reason").send(message.channel);

    let modArgs = args;
    modArgs.shift();
    let reason = modArgs.join(" ");

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`You have successfully reported <@${user.id}> for ${reason}`)

    message.channel.send(embed);

    if(logsEnabled) {
        console.log("HI");
        let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
        let logEmbed = new Discord.RichEmbed()
            .setColor('GOLD')
            .setAuthor('Report')
            .setDescription(`
            **ID**: ${obj.id}
            **User**: <@${user.id}>
            **Reporter**: <@${message.author.id}>
            **Reason**: ${reason}`)
            .setTimestamp(new Date())
            .setThumbnail(user.avatarURL);
        
        channel.send(logEmbed);

    }

}

module.exports.help = {
    name: "report",
    aliases: [""],
    permission: Groups.MOD,
    description: "Reports a user",
    usage: "report <user> <reason>"
}