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

    var duration = 'Permanent';

    if(args.length >= 2){
        if(isNaN(args[1].charAt(0)) && args[1].toLowerCase() != "permanent") return new _NoticeEmbed(Colors.ERROR, "Invalid Duration - Specify a valid duration (1s, 2m, 3h, 4d etc)").send(message.channel);
        else if(args[1].toLowerCase() != "permanent") {
            duration = args[1];
        }
    }

    let everyoneRole = message.guild.roles.get('437020893177446410');

    if(channel.permissionOverwrites.has('437020893177446410') && channel.permissionOverwrites.get('437020893177446410').denied.has("SEND_MESSAGES")) return new _NoticeEmbed(Colors.ERROR, "This channel is already locked down").send(message.channel);

    await (channel.overwritePermissions(everyoneRole, {
        SEND_MESSAGES: false
    }));

    var msg;

    if(duration == 'Permanent') {
        msg = `<#${channel.id}> has been locked down by <@${message.author.id}>`;
    } else {
        msg = `<#${channel.id}> has been locked down by <@${message.author.id}> for ${duration}`
    }

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
            .setColor('ORANGE')
            .setAuthor('Lockdown')
            .setDescription(`
            **Channel**: #${channel.name}
            **Moderator**: <@${message.author.id}>
            **Duration**: ${duration}`)
            .setTimestamp(new Date())
        channel.send(logEmbed);
    }

    if(duration != "Permanent"){
        setTimeout(async function(){
            if(channel.permissionsFor(everyoneRole).has("SEND_MESSAGES")) return;
            await (channel.overwritePermissions(everyoneRole, {
                SEND_MESSAGES: null
            }));
            if(logsEnabled){
                let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
                let logEmbed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor('Unlockdown')
                    .setDescription(`
                    **Channel**: #${channel.name}
                    **Moderator**: Auto`)
                    .setTimestamp(new Date());
                channel.send(logEmbed);
            }    
            //user.send(`You have been unmuted in ${message.guild.name}`);

        }, ms(duration));
    }

}

module.exports.help = {
    name: "lockdown",
    aliases: ["close", "restrict"],
    permission: Groups.MOD,
    description: "Locks down a channel",
    usage: "lockdown <channel> [duration]"
}