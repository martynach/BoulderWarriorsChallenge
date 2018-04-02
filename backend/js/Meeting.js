const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");

class Meeting {

    constructor() {
        this.filepath = path.join( __dirname, './../data/players.json');
    }

    async getAllMeetings() {
        if (!this.meetingsArray) {
            const jsonString = await promisify(fs.readFile, this.filepath, 'utf8');
            this.meetingsArray = JSON.parse(jsonString);
        }
        return this.meetingsArray;
    }
}

module.exports = Meeting;