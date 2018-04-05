const fs = require('fs');
const promisify = require('./utils/promisify');
const path = require("path");

const filterPlayers = require('./utils/filterPlayers');
const comparePlayers = require('./utils/comparePlayers');

const Joi = require('joi');

class Player {

    constructor(filepath) {
        this.filepath = path.join(__dirname, './../data/players.json');

        this.newPlayersSchema = Joi.array().items({
            firstname: Joi.string().min(3).max(30).required(),
            lastname: Joi.string().min(3).max(30).required(),
            gender: Joi.string().valid('f','m').required(),
        });
    }

    async loadPlayers() {
        if (!this.players) {
            const jsonString = await promisify(fs.readFile, this.filepath, 'utf8');
            this.players = JSON.parse(jsonString);
        }
    }

    async getAllInfoAboutPlayers() {
        await this.loadPlayers();
        return this.players;
    }

    async getAllPlayers(gender) {
        await this.loadPlayers();

        let expectedPlayers = this.players.map(player =>
            ({ firstname: player.firstname, lastname: player.lastname, id: player.id, gender: player.gender })
        );

        expectedPlayers.sort(comparePlayers.compareAlphabetically);

        if (gender) {
            return filterPlayers.filterByGender(expectedPlayers, gender);
        }
        return expectedPlayers;
    }

    async getPlayersSortedByPoints(gender) {
        await this.loadPlayers();

        this.players.sort(comparePlayers.compareByPoints);

        if (gender) {
            return filterPlayers.filterByGender(this.players, gender);
        }
        return this.players;
    }

    async addNewPlayers(newPlayersPayload) {
        await this.loadPlayers();

        this.validateNewPlayersProperties(newPlayersPayload);

        let maxPlayerId = this.players.reduce((prev, curr) => curr.id > prev ? curr.id : prev, 1);

        const newPlayers = [];
        newPlayersPayload.forEach(player => {
            newPlayers.push({id: ++maxPlayerId, firstname : player.firstname, lastname: player.lastname, gender: player.gender, top: 0, bonus: 0});
        });

        this.players.push(...newPlayers);

        fs.writeFileSync(this.filepath, JSON.stringify(this.players));

        return newPlayers;
    }

    async getPlayersIds() {
        await this.loadPlayers();
        return this.players.map(player => player.id);
    }

    validateNewPlayersProperties(newPlayersPayload) {
        const { error } = Joi.validate(newPlayersPayload, this.newPlayersSchema);
        if (error) {
            let userError = new Error('Incorrect properties of new players playload - array of objects {firstname, lastname, gender} required');
            userError.userError = true;
            throw userError;
        }
    }

}

module.exports = Player;