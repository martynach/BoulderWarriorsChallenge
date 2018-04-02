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