const fs = require('fs');
const promisify = require('./utils/promisify');
const path = require("path");
const Player = require('./Player');

const filterPlayers = require('./utils/filterPlayers');
const comparePlayers = require('./utils/comparePlayers');

const Joi = require('joi');

class Meeting {

    constructor() {
        this.player = new Player(); 
        this.filepath = path.join(__dirname, './../data/meetings.json');
        this.meetingSchema = Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
            date: Joi.string().min(6).max(30).required(),
            numOfBoulders: Joi.number().integer().min(0).max(100).required(),
            players: Joi.array().items(Joi.number()).required()
        });

        this.newBouldersSchema = Joi.object().keys({
            meetingId: Joi.number().integer().required(),
            numOfBoulders: Joi.number().integer().required(),
        });

        this.newPlayersSchema = Joi.object().keys({
            meetingId: Joi.number().integer().required(),
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

        this.validateMeetingId(meetingID);

        const meetingElement = this.meetings.find(element => element.id == meetingID);

        const results = meetingElement.results;
        const allPlayers = await this.player.getAllPlayers();

        const resultsWithPlayersData = results.map(result => {
            const playerID = result.playerID;
            const player = allPlayers.find(player => player.id === playerID);

            return { firstname: player.firstname, lastname: player.lastname, gender: player.gender, top: result.top, bonus: result.bonus };
        });

        resultsWithPlayersData.sort(comparePlayers.compareByPoints);

        if (gender) {
            return filterPlayers.filterByGender(resultsWithPlayersData, gender);
        }

        return resultsWithPlayersData;
    }

    async addNewMeeting(newMeeting) {
        await this.loadMeetings();

        if (!newMeeting.players) {
            newMeeting.players = [];
        }

        if (!newMeeting.numOfBoulders) {
            newMeeting.numOfBoulders = [];
        }

        this.validateNewMeetingProperties(newMeeting);
        this.validatePlayersIds(newMeeting.players);


        let maxMeetingID = this.meetings.reduce((prev, curr) => curr.id > prev ? curr.id : prev, 1);
        this.meetings.push({ id: ++maxMeetingID, name: newMeeting.name, date: newMeeting.date, numOfBoulders: newMeeting.numOfBoulders, players: newMeeting.players, results: [] })

        await promisify(fs.writeFile, this.filepath, JSON.stringify(this.meetings));
        //TODO write to file synchronously
    }

    async addNewBoulders(newBouldersPayload) {
        await this.loadMeetings();

        this.validateNewBouldersProperties(newBouldersPayload);
        this.validateMeetingId(newBouldersPayload.meetingId)

        const meetingElement = this.meetings.find(element => element.id === newBouldersPayload.meetingId);
        meetingElement.numOfBoulders += newBouldersPayload.numOfBoulders;

        await promisify(fs.writeFile, this.filepath, JSON.stringify(this.meetings));
        //TODO write to file synchronously
    }

    async getNumberOfBoulders(meetingId) {
        await this.loadMeetings();
        this.validateMeetingId(meetingId);

        const meetingElement = this.meetings.find(element => element.id == meetingId);
        return meetingElement.numOfBoulders;
    }

    async getPlayersIds(meetingId) {
        await this.loadMeetings();
        this.validateMeetingId(meetingId);

        const meetingElement = this.meetings.find(element => element.id == meetingId);
        return meetingElement.players;
    }

    async addNewPlayers(newPlayersPayload) {
        await this.loadMeetings();

        this.validateNewPlayersProperties(newPlayersPayload);
        this.validateMeetingId(newPlayersPayload.meetingId)

        const meetingElement = this.meetings.find(element => element.id === newPlayersPayload.meetingId);
        this.validatePlayersIds(newPlayersPayload.players, meetingElement.players);

        meetingElement.players.push(...newPlayersPayload.players);

        await promisify(fs.writeFile, this.filepath, JSON.stringify(this.meetings));
        //TODO write to file synchronously
    }


    validateNewMeetingProperties(newMeeting) {
        const { error } = Joi.validate(newMeeting, this.meetingSchema);
        if (error) {
            let userError = new Error('Incorrect properties of new meeting playload (name, date, numOfBoulders, players)');
            userError.userError = true;
            throw userError;
        }
    }

    validatePlayersIds(newPlayerIds, alreadySignedPlayersIds) {
        const generalListOfPlayersIds = this.player.getPlayersIds();
        if (!newPlayerIds.every(id => generalListOfPlayersIds.includes(id))) {
            let userError = Error('Incorrect ids of players: ' + newPlayerIds.toString() + '; ids do not exist in general list of players');
            userError.userError = true;
            throw userError;
        }

        if (alreadySignedPlayersIds) {
            if (newPlayerIds.some(id => alreadySignedPlayersIds.includes(id))) {
                let userError = new Error('Incorrect ids of players: ' + newPlayerIds.toString() + '; ids already exist in this meeting');
                userError.userError = true;
                throw userError;
            }
        }
    }

    validateNewBouldersProperties(newBouldersPayload) {
        const { error } = Joi.validate(newBouldersPayload, this.newBouldersSchema);
        if (error) {
            let userError = new Error('Incorrect properties of new boulder playload (meetingId, numOfBoulders)');
            userError.userError = true;
            throw userError;
        }
    }

    validateMeetingId(meetingId) {
        const meetingIds = this.meetings.map(meeting => meeting.id);
        if (!meetingIds.includes(parseInt(meetingId))) {
            let userError = new Error(`Not existing meetingId: ${meetingId}`);
            userError.userError = true;
            throw userError;
        }
    }


    validateNewPlayersProperties(newPlayersPayload) {
        const { error } = Joi.validate(newPlayersPayload, this.newPlayersSchema);
        if (error) {
            throw new Error('Incorrect properties of new players playload (meetingId, players)');
            userError.userError = true;
            throw userError;
        }
    }


}

module.exports = Meeting;