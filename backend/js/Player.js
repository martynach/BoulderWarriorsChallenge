const fs = require('fs');
const promisify = require('./promisify');

class Player {

    constructor(filepath) {
        this.filepath = filepath;
    }

    async getAllPlayers () {
        const jsonString = await promisify(fs.readFile, this.filepath, 'utf8');
        return JSON.parse(jsonString);
    }


    
}

module.exports = Player;