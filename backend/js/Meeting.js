const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");
const Player = require('./Player');
const player = new Player(); 

const FilterUtil = require('./customUtils/FilterUtil');
const SortUtil = require('./customUtils/SortUtil');

const Joi = require('joi');

class Meeting {

    constructor() {
        this.filepath = path.join(__dirname, './../data/meetings.json');
        this.meetingSchema = Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
            date: Joi.string().min(6).max(30).required(),
            numOfBoulders: Joi.number().integer().min(0).max(100).required(),
            players: Joi.array().items(Joi.number()).required()
        });
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

    async addNewMeeting(newMeeting) {
        await this.loadMeetings();

        if(!newMeeting.name || newMeeting.length === 0 || !newMeeting.date || newMeeting.date.length === 0) {
            return false;
        }

        if(!newMeeting.players) {
            newMeeting.players = [];
        }

        if(!this.validateNewMeetingProperties(newMeeting)) {
            return false;
        }

        if(!this.validateNewMeetingPlayersIds(newMeeting)) {
            return false;
        }
       
        let maxMeetingID = this.meetings.reduce((prev, curr) => curr.id > prev ? curr.id : prev, 1);
        this.meetings.push({id: ++maxMeetingID, name: newMeeting.name, date: newMeeting.date, numOfBoulders: newMeeting.numOfBoulders, players: newMeeting.players, results: []})

        await promisify(fs.writeFile, this.filepath, JSON.stringify(this.meetings));
        //TODO write to file synchronously
        return true;
    }


    validateNewMeetingProperties(newMeeting) {
        const { error } = Joi.validate(newMeeting, this.meetingSchema);
        if (error) {
            return false;
        }
        return true;
    }

    validateNewMeetingPlayersIds(newMeeting) {
        const existingPlayersIds = player.getPlayersIds();
        return newMeeting.players.every(id => existingPlayersIds.includes(id));
    }
}

module.exports = Meeting;