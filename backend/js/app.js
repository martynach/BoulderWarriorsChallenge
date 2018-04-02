const express = require('express');
const app = express();

const path = require("path");

const Player = require('./Player');
const filepath = path.join( __dirname, './../data/players.json');
const player = new Player(filepath);



app.get('/players', async (req, res) => {
    res.send(await player.getAllPlayers());
    
});


module.exports = app