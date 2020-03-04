const users = require('../../storage/permissions.json');
const Groups = require('../Enums/Groups.js');
const fs = require('fs');
const settings = require("../../settings.json");
const Discord = require("discord.js");

module.exports = class _NoticeEmbed {

    constructor(color, message){
        this.embed = new Discord.RichEmbed()
            .setColor(color)
            .setAuthor(message);
    }

    send(channel){
        channel.send(this.embed);
    }

}