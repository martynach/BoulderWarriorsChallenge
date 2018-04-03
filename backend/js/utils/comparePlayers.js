
/**
 * Compare function to help sort players by their points.
 * It' is required that every player has top and bonus properties.
 * Every top is equivalent to three points, and every bonus is equivalent to one point.
 * @param {*} player1 
 * @param {*} player2 
 */
function compareByPoints(player1, player2) {
    const point1 = player1.top * 3 + player1.bonus;
    const point2 = player2.top * 3 + player2.bonus;
    return point2 - point1;
}

/**
 * Compare function to help sort players alphabetically by their surnames and firstnames.
 * It' is required that every player has surname and firstname properties.
 * @param {*} player1 
 * @param {*} player2 
 */
function compareAlphabetically(player1, player2) {
    const name1 = player1.lastname.toLowerCase() + player1.firstname.toLowerCase();
    const name2 = player2.lastname.toLowerCase() + player2.firstname.toLowerCase();

    if (name1 < name2) {
        return -1;
    }
    if (name1 > name2) {
        return 1;
    }
    return 0;
}

module.exports = {compareByPoints, compareAlphabetically};
