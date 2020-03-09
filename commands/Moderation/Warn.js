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
        .setDescription(`<@${user.id}> has been warned by <@${message.author.id}> for ${reason}`)

    message.channel.send(embed).then(m => {
		message.delete().catch(O_o=>{});
		m.delete(5000);
	});

    if(logsEnabled) {
        let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
        let logEmbed = new Discord.RichEmbed()
            .setColor('GOLD')
            .setAuthor('Warn')
            .setDescription(`
            **User**: <@${user.id}>
            **Moderator**: <@${message.author.id}>
            **Reason**: ${reason}`)
            .setTimestamp(new Date())
            .setThumbnail(user.avatarURL);
        
        channel.send(logEmbed);

    }

}

module.exports.help = {
    name: "warn",
    aliases: ["addwarn"],
    permission: Groups.MOD,
    description: "Warns a user",
    usage: "warn <user> <reason>"
}