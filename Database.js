const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('storage/database.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

module.exports = class Database {

    /**
     * @returns {sqlite3.Database}
     */

    static getDB(){
        return db;
    }

}