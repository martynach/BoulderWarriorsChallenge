const request = require('supertest');
const app = require('./../app');


test('Test /players endpoint', async () => {
    return request(app).get('/players').expect(200);
});

test('Test /meetings endpoint', async () => {
    return request(app).get('/meetings').expect(200);
});

