const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const ms = require('ms')

module.exports.run = async (bot,message,args,cmd) => {

    var logsEnabled

    if(!settings.logsChannelId || settings.logsChannelId == '' || settings.logsChannelId.toLowerCase() == 'false'){
        logsEnabled = false;
    } else {
        logsEnabled = true;
    }

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a channel").send(message.channel);

    let channelStr = args[0];
    channelStr = channelStr.replace("<#", "");
    channelStr = channelStr.replace(">", "");

    let channel = message.guild.channels.get(channelStr)

    if(!channel) return new _NoticeEmbed(Colors.ERROR, "Invalid channel - Specify a valid channel").send(message.channel);

    let everyoneRole = message.guild.roles.get('437020893177446410');

    if(channel.permissionOverwrites.has('437020893177446410') && !channel.permissionOverwrites.get('437020893177446410').denied.has("SEND_MESSAGES")) return new _NoticeEmbed(Colors.ERROR, "This channel is not locked down").send(message.channel);

    await (channel.overwritePermissions(everyoneRole, {
        SEND_MESSAGES: null
    }));

    var msg;

    msg = `<#${channel.id}> has been unlocked down by <@${message.author.id}>`;

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(msg);

    message.channel.send(embed).then(m => {
		message.delete().catch(O_o=>{});
		m.delete(5000);
	});

    if(logsEnabled){
        let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
        let logEmbed = new Discord.RichEmbed()
            .setColor('GREEN')
            .setAuthor('Unlockdown')
            .setDescription(`
            **Channel**: #${channel.name}
            **Moderator**: <@${message.author.id}>`)
            .setTimestamp(new Date())
        channel.send(logEmbed);
    }

}

module.exports.help = {
    name: "unlockdown",
    aliases: ["unclose", "unrestrict"],
    permission: Groups.MOD,
    description: "Unlocks down a channel",
    usage: "unlockdown <channel>"
}