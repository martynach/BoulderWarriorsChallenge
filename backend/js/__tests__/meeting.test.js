const Meeting = require('./../Meeting');
const meeting = new Meeting();
const path = require("path");
const filepath = path.join( __dirname, './test_data/meetings.json');
meeting.filepath = filepath;

const fs = require('fs');
const promisify = require('./../promisify');



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


//**************************
describe('Tests for adding meeting', () => {
    const tmpFilepath = path.join(__dirname, './test_data/meetings_tmp.json');

    beforeAll(() => {
        meeting.filepath = tmpFilepath;
    });

    beforeEach(async () => {
        await promisify(fs.copyFile, filepath, tmpFilepath);

    });

    // //TODO
    // afterEach(async () => {
    //     await promisify(fs.ulink, tmpFilepath);
    // });

    afterAll(() => {
        meeting.filepath = filepath;
    });

    test('addNewMeeting adding single future event', async () => {
        expect.assertions(3);

        const newEvent = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10 };
        const addingResult = await meeting.addNewMeeting(newEvent);
        expect(addingResult).toBeTruthy();

        const meetings = await meeting.getAllMeetings();
        expect(meetings).toMatchSnapshot();

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewMeeting adding single future event with some players', async () => {
        expect.assertions(3);

        const newEvent = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10, players: [1,2] };
        const addingResult = await meeting.addNewMeeting(newEvent);
        expect(addingResult).toBeTruthy();

        const meetings = await meeting.getAllMeetings();
        expect(meetings).toMatchSnapshot();

        const tmpFileContent = await promisify(fs.readFile, tmpFilepath, 'utf8');
        expect(tmpFileContent).toMatchSnapshot();
    });

    test('addNewMeeting adding single future event with incorrect players', async () => {
        expect.assertions(1);

        const newEvent = { name: 'new meeting', date: '5.06.2018', numOfBoulders: 10, players: [1,2, 200] };
        const addingResult = await meeting.addNewMeeting(newEvent);

        expect(addingResult).toBeFalsy();

    });

});