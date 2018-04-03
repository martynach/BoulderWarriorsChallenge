const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");
const Player = require('./Player');
const player = new Player(); 

const FilterUtil = require('./customUtils/FilterUtil');
const SortUtil = require('./customUtils/SortUtil');

class Meeting {

    constructor() {
        this.filepath = path.join(__dirname, './../data/meetings.json');
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

    async getResults(meetingID, gender) {
        await this.loadMeetings();
        const meetingElement = this.meetings.find(element => element.id == meetingID);
        if (!meetingElement) {
            //  TODO
            console.log("meetingElement:", meetingElement);
            //error? bad meetingID?
            return undefined;
        }
        const results = meetingElement.results;
        const allPlayers = await player.getAllPlayers();

        const resultsWithPlayersData = results.map(result => {
            const playerID = result.playerID;
            const player = allPlayers.find(player => player.id === playerID);
            if (!player) {
                //  TODO
            }
            return { firstname: player.firstname, lastname: player.lastname, gender: player.gender, top: result.top, bonus: result.bonus };
        });

        resultsWithPlayersData.sort(SortUtil.compareByPoints);

        if (gender) {
            return FilterUtil.filterByGender(resultsWithPlayersData, gender);
        }

        return resultsWithPlayersData;
    }
}

module.exports = Meeting;