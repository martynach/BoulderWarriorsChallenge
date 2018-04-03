const request = require('supertest');
const app = require('./../app');


test('Test /players endpoint', async () => {
    return request(app).get('/players').expect(200);
});

test('Test /players?gender=f endpoint', async () => {
    return request(app).get('/players').expect(200);
});

test('Test /players/top endpoint', async () => {
    return request(app).get('/players').expect(200);
});

test('Test /players/top?gender=male endpoint', async () => {
    return request(app).get('/players').expect(200);
});

//TODO
// test('Test /players/top?gender=k endpoint', async () => {
//     return request(app).get('/players').expect(400);
// });

test('Test /meetings endpoint', async () => {
    return request(app).get('/meetings').expect(200);
});

test('Test /meetings/:1/results endpoint', async () => {
    return request(app).get('/meetings/1/results').expect(200);
});

test('Test /meetings/:1/results?gender=m endpoint', async () => {
    return request(app).get('/meetings/1/results?gender=m').expect(200);
});

test('Test /meetings/:1/results?gender=f endpoint', async () => {
    return request(app).get('/meetings/1/results?gender=f').expect(200);
});

// //TODO 
// test('Test /meetings/:2/results?gender=ff endpoint', async () => {
//     return request(app).get('/meetings/2/results?gender=ff').expect(400);
// });

