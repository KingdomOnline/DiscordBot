const Groups = require('../../util/Enums/Groups')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify either true or false").send(message.channel);
    
	
	try {
		let outcome = eval(args.join(" "));
		
		if(outcome == undefined) return message.channel.send('```undefined```');
		
		//console.log(typeof outcome);
	
		if((typeof outcome) == 'json' || (typeof outcome) == 'object') outcome = JSON.stringify(outcome);
	
		message.channel.send('```' + outcome + '```');
	} catch(err) {
		message.channel.send('```' + err + '```');
	}

}

module.exports.help = {
    name: "eval",
    aliases: ["evalcode"],
    permission: Groups.OWNER,
    description: "Evaluates a code string",
    usage: "eval <code>"
}
