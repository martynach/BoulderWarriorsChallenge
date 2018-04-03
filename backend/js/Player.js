const fs = require('fs');
const promisify = require('./utils/promisify');
const path = require("path");

const filterPlayers = require('./utils/filterPlayers');
const comparePlayers = require('./utils/comparePlayers');



class Player {

    constructor(filepath) {
        this.filepath = path.join(__dirname, './../data/players.json');
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

    async addNewPlayers(newPlayers) {
        await this.loadPlayers();

        let maxPlayerId = this.players.reduce((prev, curr) => curr.id > prev ? curr.id : prev, 1);

        //TODO validate new player?
        newPlayers.forEach(player => {
            this.players.push({id: ++maxPlayerId, firstname : player.firstname, lastname: player.lastname, gender: player.gender, top: 0, bonus: 0});
        });

        await promisify(fs.writeFile, this.filepath, JSON.stringify(this.players));
        // TODO writing to file synchronize?
        // TODO catch error?
    }

    getPlayersIds() {
        this.loadPlayers();
        return this.players.map(player => player.id);
    }



}

module.exports = Player;