const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const ms = require('ms');

module.exports.run = async (bot,message,args,cmd) => {

    var logsEnabled

    if(!settings.logsChannelId || settings.logsChannelId == '' || settings.logsChannelId.toLowerCase() == 'false'){
        logsEnabled = false;
    } else {
        logsEnabled = true;
    }

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user (mention or id)").send(message.channel);

    let number = parseInt(args[0])

    if(!number) return new _NoticeEmbed(Colors.ERROR, "Invalid id - Please specify a valid id in number form").send(message.channel);

    bot.fetchUser(number.toString()).then(user => {
    
    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid user - This user does not exist").send(message.channel);

    if(user.username == undefined) user = user.user;

    var reason = 'No Reason';

    if(args.length >= 2){
        var argss = args;
        argss.shift()
        argss.shift()
        reason = argss.join(" ");
    }

    if(message.guild.members.get(user.id)) return new _NoticeEmbed(Colors.ERROR, "This user is not banned").send(message.channel);

    message.guild.unban(user);

    var msg;

    if(reason == 'No Reason'){
        msg = `<@${user.id}> has been unbanned by <@${message.author.id}>`;
    } else {
        msg = `<@${user.id}> has been unbanned by <@${message.author.id}> for ${reason}`
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
            .setAuthor('Mute')
            .setDescription(`
            **User**: <@${user.id}>
            **Moderator**: <@${message.author.id}>
            **Reason**: ${reason}
            **Duration**: ${duration}`)
            .setTimestamp(new Date())
            .setThumbnail(user.avatarURL);
        channel.send(logEmbed);
    }

    });

}

module.exports.help = {
    name: "unban",
    aliases: [""],
    permission: Groups.MOD,
    description: "Unbans a user",
    usage: "unban <user> [reason]"
}