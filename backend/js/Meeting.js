const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");

class Meeting {

    constructor() {
        this.filepath = path.join(__dirname, './../data/players.json');
    }

    async loadMeetings() {
        if (!this.meetings) {
            const jsonString = await promisify(fs.readFile, this.filepath, 'utf8');
            this.meetings = JSON.parse(jsonString);
        }
    }

    async getAllMeetings() {
        await this.loadMeetings();
        return this.meetings;
    }
}

module.exports = Meeting;