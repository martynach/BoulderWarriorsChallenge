const fs = require('fs');
const promisify = require('./promisify');
const path = require("path");


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
            ({ firstname: player.firstname, lastname: player.lastname, id: player.id })
        );

        expectedPlayers.sort((player1, player2) => {
            const name1 = player1.lastname.toLowerCase() + player1.firstname.toLowerCase();
            const name2 = player2.lastname.toLowerCase() + player2.firstname.toLowerCase();

            if (name1 < name2) {
                return -1;
            }
            if (name1 > name2) {
                return 1;
            }
            return 0;
        });

        if (gender) {
            return this.filterByGender(expectedPlayers, gender);
        }
        return expectedPlayers;
    }

    async getPlayersSortedByPoints(gender) {
        await this.loadPlayers();

        this.players.sort((player1, player2) => {
            const point1 = player1.top * 3 + player1.bonus;
            const point2 = player2.top * 3 + player2.bonus;
            return point2 - point1;
        });

        if (gender) {
            return this.filterByGender(this.players, gender);
        }
        return this.players;
    }

    filterByGender(playersArray, gender) {
        gender = gender.toLowerCase();

        if (gender === 'female' || gender === 'f') {
            gender = 'f';

        } else if (gender === "male" || gender === 'm') {
            gender = 'm';
        } else {
            return undefined;
        }

        return playersArray.filter(player => player.gender === gender ? true : false);
    }

}

module.exports = Player;