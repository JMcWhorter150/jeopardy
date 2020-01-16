
var express = require('express');
var router = express.Router();
const leaderboard = require('../models/leaderboardFunctions');

router.get('/', async (req, res) => {
    


    const topTenGames = await leaderboard.getTopTenGames();
    for (let entry of topTenGames) {
        console.log(entry);
        let userName = await leaderboard.getUsernameById(entry.user_id)
        console.log(userName);
        entry.user_id = await userName[0].name;
        console.log(entry);
    }
    // console.log(topTenGames);
    const topGamesHTML = topTenGames.map((game) => {
        return `<p>${game.user_id}: ${game.score}</p>`
    }).join('');
    
    const topTotalScores = await leaderboard.getTopTotalScores();
    for (let entry of topTotalScores) {
        console.log(entry);
        let userName = await leaderboard.getUsernameById(entry.user_id)
        console.log(userName);
        entry.user_id = await userName[0].name;
        console.log(entry);
    }
    const topScoresHTML = topTotalScores.map((user) => {
        return `<p>${user.user_id}: ${user.sum}</p>`
    }).join('');
    // console.log(topScoresHTML);

    try {
        res.render('leaderboard', {
            locals: {
                topGamesList: topGamesHTML,
                topScoresList: topScoresHTML
            }
        })
    } catch (e) {
        res.status(404);
        res.send('Could not load leaderboards.');
    }


});
    // consol

module.exports = router;



