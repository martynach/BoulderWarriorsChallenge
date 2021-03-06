const Player = require('./../Player');
const player = new Player();
const path = require("path");
const filepath = path.join(__dirname, './test_data/players.json');
player.filepath = filepath;

const fs = require('fs');
const promisify = require('./../utils/promisify');


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



describe('Tests for adding new player', () => {
    const tmpFilepath = path.join(__dirname, './test_data/players_tmp.json');

    beforeAll(() => {
        player.filepath = tmpFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, filepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
    });

    afterAll(() => {
        player.filepath = filepath;
    });

    test('addNewPlayer method test for adding one player', async () => {
        expect.assertions(2);

        const newPlayer = { firstname: 'Marti', lastname: 'Chomik', gender: 'f' };
        await player.addNewPlayers([newPlayer]);

        const allPlayers = await player.getAllPlayers();
        expect(allPlayers).toMatchSnapshot();

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewPlayer method test for adding two proper player', async () => {
        expect.assertions(2);

        const newPlayer1 = { firstname: 'Marti', lastname: 'Chomik', gender: 'f' };
        const newPlayer2 = { firstname: 'Martin', lastname: 'Chomik', gender: 'm' };
        await player.addNewPlayers([newPlayer1, newPlayer2]);

        const allPlayers = await player.getAllPlayers();
        expect(allPlayers).toMatchSnapshot();

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    })

    test('addNewPlayer method test for adding not array', async () => {
        expect.assertions(1);

        const newPlayer1 = { firstname: 'Marti', lastname: 'Chomik', gender: 'f' };
        const expectedError = new Error('Incorrect properties of new players playload - array of objects {firstname, lastname, gender} required');
        await expect(player.addNewPlayers(newPlayer1)).rejects.toEqual(expectedError);

    })

    test('addNewPlayer method test for incorrect new players gender', async () => {
        expect.assertions(1);

        const newPlayer1 = { firstname: 'Marti', lastname: 'Chomik', gender: 'kobieta' };
        const expectedError = new Error('Incorrect properties of new players playload - array of objects {firstname, lastname, gender} required');
        await expect(player.addNewPlayers([newPlayer1])).rejects.toEqual(expectedError);
    })

    test('addNewPlayer method test for incorrect new players properties', async () => {
        expect.assertions(1);

        const newPlayer1 = { firstname: 'Marti', lastname: 'Chomik', gender: 'f', unknown: 3 };
        const expectedError = new Error('Incorrect properties of new players playload - array of objects {firstname, lastname, gender} required');
        await expect(player.addNewPlayers([newPlayer1])).rejects.toEqual(expectedError);
    })

});