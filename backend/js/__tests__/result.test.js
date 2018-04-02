const Result = require('./../Result');
const result = new Result();
const path = require("path");
const filepath = path.join(__dirname, './test_data/results.json');
result.filepath = filepath;


test('Get results for meeting with id=1', async () => {
    expect.assertions(1);
    const actual = await result.getResults(1);
    expect(actual).toMatchSnapshot();
});