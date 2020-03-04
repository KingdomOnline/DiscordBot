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
    
    if(args.length == 1) return new _NoticeEmbed(Colors.WARN, "Please specify a permission (command name)").send(message.channel);

    let permName = args[1].toLowerCase();

    var perm;

    let props = bot.commands.get(permName);
    
    if(!props) return new _NoticeEmbed(Colors.ERROR, "This permission does not exist - Specify an existing command").send(message.channel);

    var type;
    var name;

    if(typeName == "user"){
        type = new _User(memOrRole.id);
        name = memOrRole.username;
    } else {
        type = new _Role(memOrRole.id);
        name = memOrRole.name;
    }

    var boolean;
    
    if(args.length >= 3){
        if(args[2].toLowerCase() != "true" && args[2].toLowerCase() != "false") return new _NoticeEmbed(Colors.WARN, "Please specify a valid boolean (true or false)");
        
        if(args[2].toLowerCase() == "false"){
            boolean = false;
        } else {
            boolean = true;
        }
    } else {
        boolean = true;
    }

    name = `<@${memOrRole.id}>`

    if(typeName == "role") name = name.replace("@", "@&");

    type.setCommandPerm(props.help.name, boolean);

    let embed = new Discord.RichEmbed()
        .setColor(Colors.SUCCESS)
        .setDescription(`Successfully set ${name}'s permission of ${permName} to ${boolean}`)

    message.channel.send(embed);

}

module.exports.help = {
    name: "setperm",
    aliases: ["setpermission", "perm", "perms", "permission"],
    permission: Groups.ADMIN,
    description: "Sets a permission for a user or role",
    usage: "setperm <role|user> <command> [true|false]"
}