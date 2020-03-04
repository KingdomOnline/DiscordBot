const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')

module.exports.run = async (bot,message,args,cmd) => {

    let embed = new Discord.RichEmbed()
        .setColor(Colors.INFO)
        .setAuthor("Server Info")
        .setDescription(`\n\n
        **Name**: ${message.guild.name}
        **Owner**: ${message.guild.owner.user.username}
        **Members**: ${message.guild.memberCount}
        **Online**: ${message.guild.members.filter(m => m.user.presence.status == 'online').size}`)
        .setThumbnail(message.guild.iconURL);

    message.channel.send(embed);

}

module.exports.help = {
    name: "serverinfo",
    aliases: ["server-info", "server"],
    permission: Groups.DEFAULT,
    description: "Gets info about the discord server",
    usage: "serverinfo"
}