const settings = require("./settings.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const _User = require("./util/Constructors/_User");
const _Role = require("./util/Constructors/_Role");
require("dotenv").config();

var punishments = require('./storage/punishments.json');

module.exports.reload = false;

module.exports.bot = bot;

var logsEnabled

if(!settings.logsChannelId || settings.logsChannelId == '' || settings.logsChannelId.toLowerCase() == 'false'){
    logsEnabled = false;
} else {
    logsEnabled = true;
}

/*var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"//,
  //database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL connection successful!");
});*/

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

  updateModerations(message);

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

/**
 * 
 * @param {Message} message 
 */

function updateModerations(message){

  let map = new Map(Object.entries(punishments));

  let date = new Date();

  let muterole = message.guild.roles.find('name', 'muted');

  map.forEach((v, k) => {
    if(v.ban) {
      if(toConstrastDate(new Date(v.ban)) <= toConstrastDate(date)){
        bot.fetchUser(k).then(user => {
        delete v.ban;
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), err => {
          if(err) console.log(err);
        })
        if(!user) return;
        message.guild.fetchBans().then(val => {
          if(val.has(user.id)){
            message.guild.unban(user);
            if(logsEnabled){
                let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
                let logEmbed = new Discord.RichEmbed()
                    .setColor('GREEN')
                    .setAuthor('Unban')
                    .setDescription(`
                    **User**: <@${k}>
                    **Moderator**: Auto`)
                    .setTimestamp(new Date())
                    .setThumbnail(user.avatarURL);
                channel.send(logEmbed);
            }
          }
        })
      });  
      }
    }
    if(v.mute) {
      if(toConstrastDate(new Date(v.mute)) <= toConstrastDate(date)) {
        delete v.mute;
        fs.writeFile('./storage/punishments.json', JSON.stringify(punishments), err => {
          if(err) console.log(err);
        })
        let user = message.guild.members.get(k);
        if(!user) return;
        if(!message.guild.members.get(user.id).roles.get(muterole.id)) return;
        message.guild.members.get(user.id).removeRole(muterole.id);
        if(logsEnabled){
            let channel = message.guild.channels.filter((channel) => channel.type == 'text').get(settings.logsChannelId);
            let logEmbed = new Discord.RichEmbed()
                .setColor('GREEN')
                .setAuthor('Unmute')
                .setDescription(`
                **User**: <@${user.id}>
                **Moderator**: Auto`)
                .setTimestamp(new Date())
                .setThumbnail(user.avatarURL);
            channel.send(logEmbed);
        } 
      }
    }
  });

}

/**
 * 
 * @param {Date} date 
 * @returns {Number}
 */

function toConstrastDate(date){

  var month = date.getMonth();

  if(`${date.getMonth()}`.length == 1) month = `0${date.getMonth()}`;

  var day = date.getDate()

  if(`${date.getDate()}`.length == 1) day = `0${date.getDate()}`;

  var hours = date.getHours();

  if(`${date.getHours()}`.length == 1) hours = `0${date.getHours()}`;

  var minutes = date.getMinutes();

  if(`${date.getMinutes()}`.length == 1) minutes = `0${date.getMinutes()}`;

  return parseInt(`${date.getFullYear()}${month}${day}${hours}${minutes}`)

}

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