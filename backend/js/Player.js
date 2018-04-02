const fs = require('fs');
const promisify = require('./promisify');

class Player {

    constructor(filepath) {
        this.filepath = filepath;
    }

    async getAllPlayers() {
        if (!this.playersArray) {
            const jsonString = await promisify(fs.readFile, this.filepath, 'utf8');
            this.playersArray = JSON.parse(jsonString);
        }
        return this.playersArray.sort((player1, player2) => {
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


    
}

module.exports = Player;