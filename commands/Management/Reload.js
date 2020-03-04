const Groups = require('../../util/Enums/Groups')
const Discord = require('discord.js')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')
const settings = require('../../settings.json');
const fs = require('fs');

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify either true or false").send(message.channel);
    
    if(args[0].toLowerCase() != "true" && args[0].toLowerCase() != "false") return new _NoticeEmbed(Colors.ERROR, "Invalid boolean - Specify either true or false").send(message.channel);

	var isTrueSet = (args[0].toLowerCase() == 'true');
	
	index.reload = isTrueSet;
	
	if(isTrueSet) bot.guilds.get('533789188580048897').channels.get('615528689429381120').send("Bot maintenance in progress")
	
	settings.maintenance = isTrueSet;
	
	fs.writeFile('./settings.json', JSON.stringify(settings), (err) => {
		if(err) console.log(err);
	});
	
	return new _NoticeEmbed(Colors.SUCCESS, `Successfully set maintenance to ${isTrueSet}`).send(message.channel);

}

module.exports.help = {
    name: "maintenance",
    aliases: ["lockdown", "reload"],
    permission: Groups.OWNER,
    description: "Puts the bot in maintenance mode",
    usage: "maintenance <true|false>"
}
 
