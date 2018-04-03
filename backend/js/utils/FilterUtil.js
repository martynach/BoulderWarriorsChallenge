
/**
 * Helper methods to filter array of players of certain gender
 * @param {*} array - array of elements to filter from;
 * it is required that every element of array has gender property
 * @param {*} gender - possible values: female, f, male, m
 */
function filterByGender(array, gender) {
    gender = gender.toLowerCase();

    if (gender === 'female' || gender === 'f') {
        gender = 'f';

    } else if (gender === "male" || gender === 'm') {
        gender = 'm';
    } else {
        return undefined;
    }

    return array.filter(elem => elem.gender === gender);
}

module.exports.filterByGender = filterByGender;
