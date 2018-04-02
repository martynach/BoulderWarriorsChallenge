const request = require('supertest');
const app = require('./../app');


test('Test /players endpoint', async () => {
    return request(app).get('/players').expect(200);
});

test('Test /meetings endpoint', async () => {
    return request(app).get('/meetings').expect(200);
});

test('Test /meetings/:1/results endpoint', async () => {
    return request(app).get('/meetings/1/results').expect(200);
});

//todo statusCode
test('Test /meetings/:2/results endpoint', async () => {
    return request(app).get('/meetings/2/results').expect(200);
});

