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

test('Get all female players test', async () => {
    expect.assertions(1);
    const actual = await player.getAllPlayers('f');
    expect(actual).toMatchSnapshot();
});

test('Get all male players test', async () => {
    expect.assertions(1);
    const actual = await player.getAllPlayers('male');
    expect(actual).toMatchSnapshot();
});

test('Get all players of unknown gender test', async () => {
    expect.assertions(1);
    const actual = await player.getAllPlayers('k');
    expect(actual).toBeUndefined();
});

test('getPlayersSortedByPoints male and female test', async () => {
    expect.assertions(1);
    const actual = await player.getPlayersSortedByPoints();
    expect(actual).toMatchSnapshot();
});

test('getPlayersSortedByPoints female test', async () => {
    expect.assertions(1);
    const actual = await player.getPlayersSortedByPoints('female');
    expect(actual).toMatchSnapshot();
});

test('getPlayersSortedByPoints male test', async () => {
    expect.assertions(1);
    const actual = await player.getPlayersSortedByPoints('m');
    expect(actual).toMatchSnapshot();
});

test('getPlayersSortedByPoints unknown gender test', async () => {
    expect.assertions(1);
    const actual = await player.getPlayersSortedByPoints('fee');
    expect(actual).toBeUndefined();
});