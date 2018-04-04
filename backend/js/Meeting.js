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
            numOfBoulders: Joi.number().integer().required(),
        });

        this.newPlayersSchema = Joi.array().items(Joi.number().required()).required();

        this.newResultsSchema = Joi.array().items(Joi.object().keys({
            playerID: Joi.number().integer().required(),
            top: Joi.number().integer().required(),
            bonus: Joi.number().integer().required()
        })).required()
    }; 

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
        const newMeeting = { id: ++maxMeetingID, name: newMeeting.name, date: newMeeting.date, numOfBoulders: newMeeting.numOfBoulders, players: newMeeting.players, results: [] };
        this.meetings.push(newMeeting);

        fs.writeFileSync(this.filepath, JSON.stringify(this.meetings));

        return newMeeting;
    }

    async addNewBoulders(newBouldersPayload, meetingId) {
        await this.loadMeetings();

        this.validateNewBouldersProperties(newBouldersPayload);
        this.validateMeetingId(meetingId)

        const meetingElement = this.meetings.find(element => element.id === meetingId);
        meetingElement.numOfBoulders += newBouldersPayload.numOfBoulders;

        fs.writeFileSync(this.filepath, JSON.stringify(this.meetings));

        return meetingElement;
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

    async addNewPlayers(newPlayersPayload, meetingId) {
        await this.loadMeetings();

        this.validateMeetingId(meetingId)

        this.validateNewPlayersProperties(newPlayersPayload);

        const meetingElement = this.meetings.find(element => element.id === meetingId);
        this.validatePlayersIds(newPlayersPayload, meetingElement.players);

        meetingElement.players.push(...newPlayersPayload);

        fs.writeFileSync(this.filepath, JSON.stringify(this.meetings));

        return meetingElement;
    }

    async setResultsOfMeeting(newResultsPayload, meetingId) {
        await this.loadMeetings();

        await this.validateNewResultsProperties(newResultsPayload);

        await this.validateMeetingId(meetingId);

        const meetingElement = this.meetings.find(element => element.id === meetingId);
        await this.validateValuesOfResults(newResultsPayload, meetingElement);

        meetingElement.results = newResultsPayload;
        fs.writeFileSync(this.filepath, JSON.stringify(this.meetings));
        return meetingElement;
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
            let userError = new Error('Incorrect properties of new boulder playload - object containing numOfBoulders required');
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
            let userError = new Error('Incorrect properties of new players playload - array containing player ids is required');
            userError.userError = true;
            throw userError;
        }
    }

    validateNewResultsProperties(newResultsPayload) {
        const { error } = Joi.validate(newResultsPayload, this.newResultsSchema);
        if (error) {
            let userError = new Error('Incorrect properties of new results playload - array containing objects {playerID, top, bonus}) is required');
            userError.userError = true;
            throw userError;
        }
    }

    async validateValuesOfResults(newResultsPayload, meetingElement) {

        const playerIds = await this.getPlayersIds(meetingElement.id);

        newResultsPayload.forEach(element => {
            if (!playerIds.includes(element.playerID)) {
                throw new Error(`Incorrect player id : ${element.playerID}`);
            }

            if (element.top > meetingElement.numOfBoulders || element.top < 0) {
                throw new Error(`Incorrect value of top : ${element.top} for player with id: ${element.playerID}`);
            }

            if (element.bonus > meetingElement.numOfBoulders || element.bonus < 0) {
                throw new Error(`Incorrect value of bonus : ${element.bonus} for player with id: ${element.playerID}`);
            }
        });


    }


}

module.exports = Meeting;