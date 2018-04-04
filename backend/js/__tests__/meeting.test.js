const Meeting = require('./../Meeting');
const meeting = new Meeting();
const Player = require('./../Player');
const player = new Player();
const path = require("path");
const meetingsFilepath = path.join(__dirname, './test_data/meetings.json');;
meeting.filepath = meetingsFilepath;
const playersFilepath = path.join(__dirname, './test_data/players.json');
player.filepath = playersFilepath;
meeting.player = player;

const fs = require('fs');
const promisify = require('./../utils/promisify');


test('Get all meetings', async () => {
    expect.assertions(1);
    const actual = await meeting.getAllMeetings();
    expect(actual).toMatchSnapshot();
});

test('Get results for meeting with id=1', async () => {
    expect.assertions(1);
    const actual = await meeting.getResults(1);
    expect(actual).toMatchSnapshot();
});

test('Get results for no existing meeting in the future wth id=2', async () => {
    expect.assertions(1);
    const actual = await meeting.getResults(2);
    expect(actual).toHaveLength(0);
});


describe('Tests for adding meeting', () => {
    const tmpFilepath = path.join(__dirname, './test_data/meetings_tmp.json');

    beforeAll(() => {
        meeting.filepath = tmpFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, meetingsFilepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
    });

    test('addNewMeeting adding single future meeting', async () => {
        expect.assertions(2);

        const newMeeting = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10 };
        await meeting.addNewMeeting(newMeeting);

        const meetings = await meeting.getAllMeetings();
        expect(meetings).toMatchSnapshot();

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewMeeting adding single meeting with some players', async () => {
        expect.assertions(2);

        const newMeeting = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10, players: [1, 2] };
        await meeting.addNewMeeting(newMeeting);

        const meetings = await meeting.getAllMeetings();
        expect(meetings).toMatchSnapshot();

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewMeeting adding single event with incorrect players', async () => {
        expect.assertions(1);

        const newMeeting = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10, players: [1, 2, 200] };
        const expectedError = new Error('Incorrect ids of players: ' + newMeeting.players.toString() + '; ids do not exist in general list of players');
        await expect(meeting.addNewMeeting(newMeeting)).rejects.toEqual(expectedError);
    });

    test('addNewMeeting adding single event with incorrect properties', async () => {
        expect.assertions(1);

        const newMeeting = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10, results: 'some result' };

        const expectedError = new Error('Incorrect properties of new meeting playload (name, date, numOfBoulders, players)');
        await expect(meeting.addNewMeeting(newMeeting)).rejects.toEqual(expectedError);
    });
});


describe('Tests for adding boulders to meeting with given id', () => {
    const tmpFilepath = path.join(__dirname, './test_data/meetings_tmp.json');

    beforeAll(() => {
        meeting.filepath = tmpFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, meetingsFilepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
        meeting.meetings = null;
    });


    test('addNewBoulders proper number and meetingId', async () => {
        expect.assertions(2);

        const newBouldersPayload = { numOfBoulders: 5 };
        await meeting.addNewBoulders(newBouldersPayload, 2);

        const numOfBoulders = await meeting.getNumberOfBoulders(2);
        expect(numOfBoulders).toBe(45);

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewBoulders -removing boulders- proper number and meetingId', async () => {
        expect.assertions(2);

        const newBouldersPayload = { numOfBoulders: -5 };
        await meeting.addNewBoulders(newBouldersPayload, 2);

        const numOfBoulders = await meeting.getNumberOfBoulders(2);
        expect(numOfBoulders).toBe(35);

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewBoulders bad meetingId', async () => {
        expect.assertions(1);

        const newBouldersPayload = { numOfBoulders: 8 }
        const expectedError = new Error(`Not existing meetingId: 5`);
        await expect(meeting.addNewBoulders(newBouldersPayload, 5)).rejects.toEqual(expectedError);
    });

    test('addNewBoulders inproper payload properties', async () => {
        expect.assertions(1);

        const newBouldersPayload = { numOfBoulders: 7, unexpected: 0 }
        const expectedError = new Error('Incorrect properties of new boulder playload - object containing numOfBoulders required');
        await expect(meeting.addNewBoulders(newBouldersPayload, 2)).rejects.toEqual(expectedError);
    });

});



describe('Tests for adding players to meeting with given id', () => {
    const tmpFilepath = path.join(__dirname, './test_data/meetings_tmp.json');
    const tmpPlayerFilepath = path.join(__dirname, './test_data/players_tmp.json');


    beforeAll(() => {
        meeting.filepath = tmpFilepath;
        player.filepath = tmpPlayerFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, meetingsFilepath, tmpFilepath);
        await promisify(fs.copyFile, playersFilepath, tmpPlayerFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
        await promisify(fs.unlink, tmpPlayerFilepath);
        meeting.meetings = null;
    });


    test('addNewPlayers proper playersIds and meetingId', async () => {
        expect.assertions(2);

        const newPlayersPayload = [2, 3, 4];
        await meeting.addNewPlayers([2, 3, 4], 2);

        const players = await meeting.getPlayersIds(2);
        expect(players).toEqual(expect.arrayContaining([1, 2, 3, 4, 9]));

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewPlayers bad meetingId', async () => {
        expect.assertions(1);

        const expectedError = new Error(`Not existing meetingId: 4`)
        await expect(meeting.addNewPlayers([2, 3, 4], 4)).rejects.toEqual(expectedError);
    });

    test('addNewPlayers bad playerIds - they are already in the meeting', async () => {
        expect.assertions(1);

        const expectedError = new Error('Incorrect ids of players: ' + [1, 2].toString() + '; ids already exist in this meeting');
        await expect(meeting.addNewPlayers([1, 2], 2)).rejects.toEqual(expectedError);
    });

    test('addNewPlayers bad playerIds - the are not in general list of players', async () => {
        expect.assertions(1);

        const expectedError = new Error('Incorrect ids of players: ' + [2, 30].toString() + '; ids do not exist in general list of players');
        await expect(meeting.addNewPlayers([2, 30], 2)).rejects.toEqual(expectedError);
    });

});

describe('Tests for setting results of meeting with given id', () => {
    const tmpFilepath = path.join(__dirname, './test_data/meetings_tmp.json');

    beforeAll(() => {
        meeting.filepath = tmpFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, meetingsFilepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
    });

    afterAll(() => {
        meeting.filepath = filepath;
    });

    test('setResultsOfMeeting proper values', async () => {
        expect.assertions(1);

        const newResultsPayload = [
            { playerID: 1, top: 30, bonus: 40 },
            { playerID: 9, top: 34, bonus: 39 },
        ];

        await meeting.setResultsOfMeeting(newResultsPayload, 2);

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('setResultsOfMeeting incorrect properties', async () => {
        expect.assertions(1);

        const newResultsPayload = {
            meetingId: 2, resultsEE: [
                { playerID: 1, top: 30, bonus: 40 },
                { playerID: 9, top: 34, bonus: 39 },
            ]
        };

        const expectedError = new Error('Incorrect properties of new results playload - array containing objects {playerID, top, bonus}) is required');
        await expect(meeting.setResultsOfMeeting(newResultsPayload, 2)).rejects.toEqual(expectedError);
    });

    test('setResultsOfMeeting incorrect properties - no playerID', async () => {
        expect.assertions(1);

        const newResultsPayload = [
            { top: 30, bonus: 40 },
            { playerID: 9, top: 34, bonus: 39 },
        ];

        const expectedError = new Error('Incorrect properties of new results playload - array containing objects {playerID, top, bonus}) is required');
        await expect(meeting.setResultsOfMeeting(newResultsPayload, 2)).rejects.toEqual(expectedError);
    });

    test('setResultsOfMeeting incorrect value of playerID', async () => {
        expect.assertions(1);

        const newResultsPayload = [
            { playerID: 2, top: 30, bonus: 40 },
            { playerID: 9, top: 34, bonus: 39 }
        ];

        const expectedError = new Error(`Incorrect player id : 2`);
        await expect(meeting.setResultsOfMeeting(newResultsPayload, 2)).rejects.toEqual(expectedError);
    });

    test('setResultsOfMeeting incorrect value of top', async () => {
        expect.assertions(1);

        const newResultsPayload = [
            { playerID: 1, top: 50, bonus: 40 },
            { playerID: 9, top: 34, bonus: 39 },
        ];

        const expectedError = new Error(`Incorrect value of top : 50 for player with id: 1`);
        await expect(meeting.setResultsOfMeeting(newResultsPayload, 2)).rejects.toEqual(expectedError);
    });

    test('setResultsOfMeeting incorrect value of bonus', async () => {
        expect.assertions(1);

        const newResultsPayload = [
            { playerID: 1, top: 35, bonus: 40 },
            { playerID: 9, top: 34, bonus: -3 },
        ];

        const expectedError = new Error(`Incorrect value of bonus : -3 for player with id: 9`);
        await expect(meeting.setResultsOfMeeting(newResultsPayload, 2)).rejects.toEqual(expectedError);
    });

});
