const Player = require('./../Player');
const player = new Player();
const path = require("path");
const filepath = path.join(__dirname, './test_data/players.json');
player.filepath = filepath;


test('Get all players test', async () => {
    expect.assertions(1);
    const actual = await player.getAllPlayers();
    expect(actual).toMatchSnapshot();
});

test('getPlayersSortedByPoints test', async () => {
    expect.assertions(1);
    const actual = await player.getPlayersSortedByPoints();
    expect(actual).toMatchSnapshot();
});