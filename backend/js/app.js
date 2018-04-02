const express = require('express');
const app = express();

const path = require("path");

const Player = require('./Player');
const player = new Player();

const Meeting = require('./Meeting');
const meeting = new Meeting();

const Result = require('./Result');
const result = new Result();


//lista wszystkich zawodników
app.get('/players', async (req, res) => {
    res.send(await player.getAllPlayers());
    
});

//lista wszystkich eventów
app.get('/meetings', async (req, res) => {
    res.send(await meeting.getAllMeetings());

});

//lista wyników konkretnych zawodów
app.get('/meetings/:id/results', async (req, res) => {
    const meetingID = req.params.id;
    res.send(await result.getResults(meetingID));

});


module.exports = app