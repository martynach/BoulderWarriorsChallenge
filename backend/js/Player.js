const fs = require('fs');
const promisify = require('./promisify');

class Player {

    constructor(filepath) {
        this.filepath = filepath;
    }

    async getAllPlayers () {
        return await promisify(fs.readFile, this.filepath, 'utf8');
    }


    
}

module.exports = Player;