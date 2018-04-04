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
    await player.addNewPlayers(req.body);
    //TODO info if adding all new players succeeded?

});


module.exports = app