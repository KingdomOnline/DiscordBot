const Groups = require('../../util/Enums/Groups')
const Colors = require('../../util/Enums/Colors.js')
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed')

module.exports.run = async (bot,message,args,cmd) => {

  function clean(text) {
    if (typeof(text) == "string") {
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
      return text;
    }
}

  try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled != "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"}).catch(err => message.channel.send(`\`\`\`${err}\`\`\``));
    } catch (err) {
		message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }

    /*if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify either true or false").send(message.channel);
    
	
	try {
		let outcome = eval(args.join(" "));
		
		if(outcome == undefined) return message.channel.send('```undefined```');
		
		//console.log(typeof outcome);
	
		if((typeof outcome) == 'object') outcome = JSON.stringify(outcome);
	
		message.channel.send('```' + outcome + '```');
	} catch(err) {
		message.channel.send('```' + err + '```');
	}*/

}

module.exports.help = {
    name: "eval",
    aliases: ["evalcode"],
    permission: Groups.OWNER,
    description: "Evaluates a code string",
    usage: "eval <code>"
}
