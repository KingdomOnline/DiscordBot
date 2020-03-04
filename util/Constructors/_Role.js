const users = require('../../storage/permissions.json');
const Groups = require('../Enums/Groups.js');
const fs = require('fs');
const settings = require("../../settings.json");

module.exports = class _Role {

    constructor(id){
        if(!users.roles){
            users.roles = {};
        }
        if(!users.roles[id]){
            users.roles[id] = {
                group: Groups.DEFAULT,
                commands: {}
            }
        }
        fs.writeFile('./permissions.json', JSON.stringify(users), (err) => {
          if(err) console.log(err);
        })
        this.id = id;
        this.bot = require("../../bot.js");
    }

    get getGroup(){
        return parseInt(users.roles[this.id].group);
    }

    hasCommadPerm(commandName){
        if(!users.roles[this.id].commands[commandName] || users.roles[this.id].commands[commandName] == false){
            return false;
        } else {
            return true;
        }
    }

    setGroup(group){
        users.roles[this.id].group = group;
        fs.writeFile('./permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    setCommandPerm(commandName, boolean){
        users.roles[this.id].commands[commandName] = boolean;
        fs.writeFile('./permissions.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
        })
    }

    hasPermission(prop){
        return prop.help.permission <= this.getGroup || this.hasCommadPerm(prop.help.name);
    }

}