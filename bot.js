const settings = require("./settings.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const _User = require("./util/Constructors/_User");
const _Role = require("./util/Constructors/_Role");
require("dotenv").config();

module.exports.reload = false;

module.exports.bot = bot;

bot.commands = new Discord.Collection();  

  fs.readdir('./commands/', (err, files) => {

    files.filter(f => f.split(".").length == 1).forEach((f2, i) => {

      fs.readdir(`./commands/${f2}/`, (err, files) => {

      if(err) console.log(err);

      let jsfile = files.filter(f => f.split(".").pop() === "js");
      if(jsfile.length <= 0){
        console.log("Couldn't find commands.");
        return;
      }
  
      jsfile.forEach((f, i) =>{
        let commandsCollection = new Discord.Collection();
        let props = require(`./commands/${f2}/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(function(val, i){
          bot.commands.set(val, props)
        })
      })
      
    })

  })

})

module.exports.commands = bot.commands;

client.on('error', console.error);
bot.on('error', e => {
  console.log(e)
})
  
bot.on("ready", async () => {
	console.log(`${bot.user.username} is online!`);
	bot.user.setPresence({ game: { name: settings.status } });
});

bot.on("message", async message => {

	if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
  let args = messageArray.slice(1);
  
  if(cmd.startsWith(settings.prefix)){
    let user = new _User(message.author.id);
    let commandfile = bot.commands.get(cmd.replace(settings.prefix, ""));
    if(!commandfile) return;
    if(settings.owners.includes(message.author.id) || user.hasPermission(commandfile) || hasPermissionRoles(message, commandfile)){
      let sett = require('./settings.json');
      if(settings.owners.includes(message.author.id) || sett.maintenance == false){
        if(commandfile) commandfile.run(bot,message,args,cmd);
      } else {
        message.channel.send("Bot is in maintenance");
      }
    }
  }
    
});

function hasPermissionRoles(message, prop){
  let member = message.guild.members.get(message.author.id);
  let outcome = false;
  member.roles.forEach((val, i, map) => {
    let role = new _Role(val.id);
    if(role.hasPermission(prop)){
      outcome = true;
      return;
    }
  })
  return outcome;
}

bot.login(process.env.TOKEN);