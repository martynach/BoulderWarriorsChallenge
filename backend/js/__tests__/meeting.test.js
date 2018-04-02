const Meeting = require('./../Meeting');
const path = require("path");
const filepath = path.join( __dirname, './test_data/meetings.json');
const meeting = new Meeting(filepath);



test('Get all meetings', async () => {
    expect.assertions(1);
    const actual = await meeting.getAllMeetings();
    expect(actual).toMatchSnapshot();
});