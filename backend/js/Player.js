const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");

const FilterUtil = require('./customUtils/FilterUtil');
const SortUtil = require('./customUtils/SortUtil');



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

    async getAllPlayers(gender) {
        await this.loadPlayers();

        let expectedPlayers = this.players.map(player =>
            ({ firstname: player.firstname, lastname: player.lastname, id: player.id, gender: player.gender })
        );

        expectedPlayers.sort(SortUtil.compareAlphabetically);

        if (gender) {
            return FilterUtil.filterByGender(expectedPlayers, gender);
        }
        return expectedPlayers;
    }

    async getPlayersSortedByPoints(gender) {
        await this.loadPlayers();

        this.players.sort(SortUtil.compareByPoints);

        if (gender) {
            return FilterUtil.filterByGender(this.players, gender);
        }
        return this.players;
    }

}

module.exports = Player;