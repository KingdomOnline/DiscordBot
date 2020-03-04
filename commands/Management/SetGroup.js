const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');

module.exports.run = async(bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a role or user (mention or id)").send(message.channel);

    let typeName = "user";
    let memOrRole = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(memOrRole != null) if(memOrRole.username == undefined) memOrRole = memOrRole.user;

    if(!memOrRole) {
        memOrRole = message.mentions.roles.first() || message.guild.roles.get(args[0]) || message.guild.roles.find(val => val.name.toLowerCase() == args[0].toLowerCase());
        typeName = "role";
    }

    if(!memOrRole) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid role or user (mention or id)").send(message.channel);
    
    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a group (default, mod, admin)").send(message.channel);

    let groupName = args[1].toUpperCase();

    var group;

    switch(groupName){
        case("DEFAULT"):{
            group = Groups.DEFAULT;
            break;
        }
        case("MOD"):{
            group = Groups.MOD;
            break;
        }
        case("ADMIN"):{
            group = Groups.ADMIN;
            break;
        }
        default:{
            return new _NoticeEmbed(Colors.ERROR, "This group does not exist - Available groups: default, mod, admin").send(message.channel);
        }
    }

    var type;
    var name;

    if(typeName == "user"){
        type = new _User(memOrRole.id);
        name = memOrRole.username;
    } else {
        type = new _Role(memOrRole.id);
        name = memOrRole.name;
    }

    name = `<@${memOrRole.id}>`

    if(typeName == "role") name = name.replace("@", "@&");

    type.setGroup(group);

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`Successfully set ${name}'s group to ${groupName.toLowerCase()}`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "setgroup",
    aliases: ["set-group", "group"],
    permission: Groups.ADMIN,
    description: "Sets a permission group for a role or user",
    usage: "setgroup <role|user> <group>"
}