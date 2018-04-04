const express = require('express');
const app = express();

const path = require("path");

const Player = require('./Player');
const player = new Player();

const Meeting = require('./Meeting');
const meeting = new Meeting();

const bodyParser = require('body-parser');

app.use(
    express.static(
        path.join(__dirname, '../../frontend')
    )
);

app.use(bodyParser.json());


//list of all players
app.get('/players', async (req, res) => {
    res.send(await player.getAllPlayers(req.query.gender));

});

//list of all players with their points
app.get('/players/top', async (req, res) => {
    res.send(await player.getPlayersSortedByPoints(req.query.gender));

});

//list of all meetings
app.get('/meetings', async (req, res) => {
    res.send(await meeting.getAllMeetings());

});

//results from one certain meeting
app.get('/meetings/:meetingID/results', async (req, res) => {
    res.send(await meeting.getResults(req.params.meetingID, req.query.gender));
});

//adding new players
app.post('/players', async (req, res) => {
    try {
        res.send(await player.addNewPlayers(req.body));
    } catch (error) {
        const statusCode = error.userError ? 400 : 500;
        res.status(statusCode);
        res.send({ message: error.message });
    }
});

//adding new meeting
app.post('/meetings', async (req, res) => {
    try {
        res.send(await meeting.addNewMeeting(req.body));

    } catch (error) {
        const statusCode = error.userError ? 400 : 500;
        res.status(statusCode);
        res.send({ message: error.message });
    }
});

//adding new players to the meeting
app.post('/meetings/:meetingId/players', async (req, res) => {
    try {
        res.send(await meeting.addNewPlayers(req.body, req.params.meetingId));
    } catch (error) {
        const statusCode = error.userError ? 400 : 500;
        res.status(statusCode);
        res.send({ message: error.message });
    }
});

//adding boulders to the meeting
app.post('/meetings/:meetingId/boulders', async (req, res) => {
    try {
        res.send(await meeting.addNewBoulders(req.body, req.params.meetingId));
    } catch (error) {
        const statusCode = error.userError ? 400 : 500;
        res.status(statusCode);
        res.send({ message: error.message });
    }
});

//setting results of the meeting
app.patch('/meetings/:meetingId/results', async (req, res) => {
    try {
        res.send(await meeting.setResultsOfMeeting(req.body, req.params.meetingId));
    } catch (error) {
        res.status(error.userError ? 400 : 500);
        res.send({ message: error.message });
    }
});

module.exports = app