const fs = require('fs');
const promisify = require('./promisify');

class Meeting {

    constructor(filepath) {
        this.filepath = filepath;
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