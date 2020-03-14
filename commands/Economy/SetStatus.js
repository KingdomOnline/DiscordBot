const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const bot = require('../../bot.js');
const db = require('../../Database').getDB();

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a status").send(message.channel);

    let status = args.join(" ");

    db.all("SELECT * FROM profiles WHERE userId = ?", [`${message.author.id}`], (err, rows) => {
        if(err) console.log(err);
        if(rows.length > 0){
            db.run("UPDATE profiles SET status = ? WHERE userId = ?", [status, `${message.author.id}`], err => {
                if(err) console.log(err);
            })
        } else {
            db.run("INSERT INTO profiles (userId, xp, money, status) VALUES (?, ?, ?, ?)", [`${message.author.id}`, 0, 0, status], err => {
                if(err) console.log(err);
            })
        }
        new _NoticeEmbed(Colors.SUCCESS, `You have successfully set your status to ${status}`).send(message.channel);
    })

}

module.exports.help = {
    name: "setstatus",
    aliases: ["set-status", "status="],
    permission: Groups.DEFAULT,
    description: "Sets your profile status",
    usage: "setstatus <status>"
}