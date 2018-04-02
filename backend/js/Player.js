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

    async getAllPlayers() {

        await this.loadPlayers();

        let players = this.players.map(player => {
            return { firstname: player.firstname, lastname: player.lastname, id: player.id };
        }
        );

        return players.sort((player1, player2) => {
            const lastname1 = player1.lastname.toLowerCase();
            const lastname2 = player2.lastname.toLowerCase();

            if (lastname1 < lastname2) {
                return -1;
            }

            if (lastname1 > lastname2) {
                return 1;
            }

            const firstname1 = player1.firstname.toLowerCase();
            const firstname2 = player2.firstname.toLowerCase();

            if (firstname1 < firstname2) {
                return -1;
            }

            if (firstname1 > firstname2) {
                return 1;
            }

            return 0;
        });

    }

    async getPlayersSortedByPoints() {
        await this.loadPlayers();

        return this.players.sort((player1, player2) => {
            const point1 = player1.top * 3 + player1.bonus;
            const point2 = player2.top * 3 + player2.bonus;
            return point1 - point2;
        });
    }



}

module.exports = Player;