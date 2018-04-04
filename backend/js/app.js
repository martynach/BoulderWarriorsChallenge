const express = require('express');
const app = express();

const path = require("path");

const Player = require('./Player');
const player = new Player();

const Meeting = require('./Meeting');
const meeting = new Meeting();



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
app.post('/new_player', async (req, res) => {
    try {
        await player.addNewPlayers(req.body);
        res.sendStatus(200);

    } catch (error) {
        res.status(error.userError ? 400 : 500);
        res.send({ message: error.message });
    }

});

//adding new meeting
app.post('/meetings/new_meeting', async (req, res) => {
    try {
        await meeting.addNewMeeting(req.body);
        res.sendStatus(200);

    } catch (error) {
        res.status(error.userError ? 400 : 500);
        res.send({ message: error.message });
    }
});

//adding new players to the meeting
app.post('/meetings/new_players', async (req, res) => {
    try {
        await meeting.addNewPlayers(req.body);
        res.sendStatus(200);

    } catch (error) {
        res.status(error.userError ? 400 : 500);
        res.send({ message: error.message });
    }
});

//adding boulders to the meeting
app.post('/meetings/new_boulders', async (req, res) => {
    try {
        await meeting.addNewBoulders(req.body);
        res.sendStatus(200);

    } catch (error) {
        res.status(error.userError ? 400 : 500);
        res.send({ message: error.message });
    }
});


module.exports = app