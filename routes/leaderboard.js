
var express = require('express');
var router = express.Router();
const leaderboard = require('../models/leaderboardFunctions');

router.get('/', async (req, res) => {
    const topTenGames = await leaderboard.getTopTenGames();
    console.log(topTenGames);
    res.json(topTenGames);
    // res.send(topTenGames);
    // res.render('leaderboard');
})

module.exports = router;



