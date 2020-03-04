const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');

module.exports.run = async (bot,message,args,cmd) => {
	
	var members = "";

    JSON.stringify(users).replace(/{/g, "").replace(/}/g, "").replace("\"users\":", "").replace("\"roles\":", "").split(",").forEach(val => {
		let obj = val.split(":")[0].toString().replace(/"/g, "");
		let user = message.guild.members.get(obj);
		if(user != undefined) {
			if(users.users[obj].group == 0) return
			var group = Groups.parse[users.users[obj].group];
			members += `User - ${user.displayName} - ${group}\n`;
		}
		let role = message.guild.roles.get(obj);
		if(role != undefined){
			if(users.roles[obj].group == 0) return
			group = Groups.parse[users.roles[obj].group];
			members += `Role - ${role.name} - ${group}`
		}
	})

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Staff")
        .setDescription(members);

    message.channel.send(embed);

}

module.exports.help = {
    name: "liststaff",
    aliases: ["list-staff"],
    permission: Groups.MOD,
    description: "Lists the staff",
    usage: "liststaff"
}
