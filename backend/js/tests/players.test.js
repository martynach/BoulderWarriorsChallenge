const players = require('./../players');

test('get all players', async () => {
    expect.assertions(1);
    await expect(players.getAllPlayers()).resolves.toBe('[{"id":1,"firstname":"Edyta","lastname":"Akarczyk","top":5,"bonus":6}]');
});