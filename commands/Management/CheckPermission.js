const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let typeName = "user";
    let memOrRole = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(memOrRole != null) if(memOrRole.username == undefined) memOrRole = memOrRole.user;

    if(!memOrRole) {
        memOrRole = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(val => val.name.toLowerCase() == args[0].toLowerCase());
        typeName = "role";
    }

    if(!memOrRole) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);

    var type;
    var name;

    if(typeName == "user"){
        type = new _User(memOrRole.id);
        name = memOrRole.username;
    } else {
        type = new _Role(memOrRole.id);
        name = memOrRole.name;
    }

    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a command").send(message.channel);

    let commandName = args[1].toLowerCase();
    let commandfile = bot.commands.get(commandName);

    if(!commandfile) {
        return new _NoticeEmbed(Colors.ERROR, "Could not find command").send(message.channel);
    }

    var outcome = `<@${memOrRole.id}> is not allowed to use this command.`

    if(type.hasPermission(commandfile)) outcome = `<@${memOrRole.id}> is allowed to use this command.`

    if(typeName == "role") outcome = outcome.replace("@", "@&")

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setDescription(outcome)

    message.channel.send(embed);

}

module.exports.help = {
    name: "checkpermission",
    aliases: ["checkperm", "checkperm", "perm", "permission"],
    permission: Groups.ADMIN,
    description: "Checks to see if a user or role has a command permission",
    usage: "checkpermission <role|user> <command>"
}