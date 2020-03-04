module.exports = class Groups {}

const Groups = module.exports;
Groups.DEFAULT = 0;
Groups.MOD = 1;
Groups.ADMIN = 2;
Groups.OWNER = 3;

Groups.parse = {
	0: "Default",
	1: "Mod",
	2: "Admin",
	3: "Owner"
}
