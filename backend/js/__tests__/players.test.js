const Player = require('./../Player');
const path = require("path");
const filepath = path.join( __dirname, './test_data/players.json');
const player = new Player(filepath);



test('Get all players', async () => {
    expect.assertions(1);
    const actual = JSON.parse(await player.getAllPlayers());
    //const expected = JSON.parse('[{"id":1,"firstname":"Edyta","lastname":"Akarczyk","top":5,"bonus":6}]');
    // expect(actual).toEqual(expected);
    expect(actual).toMatchSnapshot();
});