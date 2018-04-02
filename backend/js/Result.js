const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");

class Result {

    constructor() {
        this.filepath = path.join(__dirname, './../data/results.json');
    }

    async loadResults() {
        if (!this.results) {
            const jsonString = await promisify(fs.readFile, this.filepath, 'utf8');
            this.results = JSON.parse(jsonString);
        }
    }

    async getResults(meetingID) {
        await this.loadResults();

        let demandedResult;

        this.results.forEach(element => {
            if (element.meetingID === meetingID) {
                demandedResult = element;
            }
        });

        return demandedResult;
    }
}

module.exports = Result;