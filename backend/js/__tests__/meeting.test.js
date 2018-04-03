const Meeting = require('./../Meeting');
const meeting = new Meeting();
const path = require("path");
const filepath = path.join( __dirname, './test_data/meetings.json');
meeting.filepath = filepath;



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