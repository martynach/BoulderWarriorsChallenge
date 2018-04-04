const Meeting = require('./../Meeting');
const meeting = new Meeting();
const path = require("path");
const filepath = path.join(__dirname, './test_data/meetings.json');
meeting.filepath = filepath;

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
        await promisify(fs.copyFile, filepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
    });

    afterAll(() => {
        meeting.filepath = filepath;
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
        await promisify(fs.copyFile, filepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
        meeting.meetings = null;
    });

    afterAll(() => {
        meeting.filepath = filepath;
    });

    test('addNewBoulders proper number and meetingId', async () => {
        expect.assertions(2);

        const newBouldersPayload = { meetingId: 2, numOfBoulders: 5 };
        await meeting.addNewBoulders(newBouldersPayload);

        const numOfBoulders = await meeting.getNumberOfBoulders(newBouldersPayload.meetingId);
        expect(numOfBoulders).toBe(45);

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewBoulders -removing boulders- proper number and meetingId', async () => {
        expect.assertions(2);

        const newBouldersPayload = { meetingId: 2, numOfBoulders: -5 };
        await meeting.addNewBoulders(newBouldersPayload);

        const numOfBoulders = await meeting.getNumberOfBoulders(newBouldersPayload.meetingId);
        expect(numOfBoulders).toBe(35);

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewBoulders bad meetingId', async () => {
        expect.assertions(1);

        const newBouldersPayload = { meetingId: 5, numOfBoulders: 8 }
        const expectedError = new Error(`Not existing meetingId: ${newBouldersPayload.meetingId}`);
        await expect(meeting.addNewBoulders(newBouldersPayload)).rejects.toEqual(expectedError);
    });

    test('addNewBoulders inproper payload properties', async () => {
        expect.assertions(1);

        const newBouldersPayload = { meetingId: 2, numOfBoulders: 7, unexpected: 0 }
        const expectedError = new Error('Incorrect properties of new boulder playload (meetingId, numOfBoulders)');
        await expect(meeting.addNewBoulders(newBouldersPayload)).rejects.toEqual(expectedError);
    });

});



describe('Tests for adding players to meeting with given id', () => {
    const tmpFilepath = path.join(__dirname, './test_data/meetings_tmp.json');

    beforeAll(() => {
        meeting.filepath = tmpFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, filepath, tmpFilepath);

    });

    afterEach(async () => {
        await promisify(fs.unlink, tmpFilepath);
    });

    afterAll(() => {
        meeting.filepath = filepath;
    });

    test('addNewPlayers proper playersIds and meetingId', async () => {
        expect.assertions(2);

        const newPlayersPayload = { meetingId: 2, players: [2, 3, 4] }
        await meeting.addNewPlayers(newPlayersPayload);

        const players = await meeting.getPlayersIds(newPlayersPayload.meetingId);
        expect(players).toEqual(expect.arrayContaining([1, 2, 3, 4, 9]));

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewPlayers bad meetingId', async () => {
        expect.assertions(1);

        const newPlayersPayload = { meetingId: 4, players: [2, 3, 4] }
        const expectedError = new Error(`Not existing meetingId: ${newPlayersPayload.meetingId}`)
        await expect(meeting.addNewPlayers(newPlayersPayload)).rejects.toEqual(expectedError);
    });

    test('addNewPlayers bad playerIds - they are already in the meeting', async () => {
        expect.assertions(1);

        const newPlayersPayload = { meetingId: 2, players: [1, 2] } //player 1 already exists
        const expectedError = new Error('Incorrect ids of players: ' + newPlayersPayload.players.toString() + '; ids already exist in this meeting');
        await expect(meeting.addNewPlayers(newPlayersPayload)).rejects.toEqual(expectedError);
    });

    test('addNewPlayers bad playerIds - the are not in general list of players', async () => {
        expect.assertions(1);

        const newPlayersPayload = { meetingId: 2, players: [2, 30] } //player with id 30 does not exist
        const expectedError = new Error('Incorrect ids of players: ' + newPlayersPayload.players.toString() + '; ids do not exist in general list of players');
        await expect(meeting.addNewPlayers(newPlayersPayload)).rejects.toEqual(expectedError);
    });

});
