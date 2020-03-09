const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const _User = require('../../util/Constructors/_User.js')
const settings = require('../../settings.json')
const ms = require('ms')
const fs = require('fs');

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

    var duration = 'Permanent';

    if(args.length >= 2){
        if(isNaN(args[1].charAt(0)) && args[1].toLowerCase() != "permanent") return new _NoticeEmbed(Colors.ERROR, "Invalid Duration - Specify a valid duration (1s, 2m, 3h, 4d etc)").send(message.channel);
        else if(args[1].toLowerCase() != "permanent") {
            duration = args[1];
        }
    }

    var reason = 'No Reason';

    if(args.length >= 3){
        var argss = args;
        argss.shift()
        argss.shift()
        reason = argss.join(" ");
    }

    let muterole = message.guild.roles.find('name', 'muted');

    if(!muterole) {
        muterole = await message.guild.createRole({
            name: "muted",
            color: "#000000",
            permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });
    }

    let member = message.guild.members.get(user.id);

    if(message.guild.members.get(user.id).roles.get(muterole.id)) return new _NoticeEmbed(Colors.ERROR, "This member is already muted").send(message.channel);

    await (member.addRole(muterole));

    var msg;

    if(reason == 'No Reason'){
        msg = `<@${user.id}> has been muted by <@${message.author.id}>`;
    } else if(duration == 'Permanent') {
        msg = `<@${user.id}> has been muted by <@${message.author.id}> for ${reason}`;
    } else {
        msg = `<@${user.id}> has been muted by <@${message.author.id}> for ${reason} for ${duration}`
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

    if(duration != "Permanent"){
        let punishments = require('../../storage/punishments.json');
        if(!punishments[user.id]) punishments[user.id] = {};
        let date = new Date();
        date.setMilliseconds(date.getMilliseconds() + ms(duration))
        punishments[user.id].mute = date.toString();
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), err => {
            if(err) console.log(err);
        })
    }

}

module.exports.help = {
    name: "mute",
    aliases: ["nochat"],
    permission: Groups.MOD,
    description: "Mutes a user",
    usage: "mute <user> [duration] [reason]"
}