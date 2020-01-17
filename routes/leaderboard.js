
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

    const topGamesHTML = topTenGames.map((game) => {
        return `<tr>
            <td>${game.user_id}</td>\n
            <td>${game.score}</td>\n
        </tr>\n
        `
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
        return `<tr>
            <td>${user.user_id}</td>\n
            <td>${user.sum}</td>\n
        </tr>\n
        `
    }).join('');

    try {
        res.render('leaderboard', {
            locals: {
                pagetitle: 'Leaderboard',
                topGamesList: topGamesHTML,
                topScoresList: topScoresHTML
            },
            partials: {
                head: '/partials/head',
                navbar: req.session.navbar.value,
                footer: 'partials/footer'
            }
        })
    } catch (e) {
        res.status(404);
        res.send('Could not load leaderboards.');
    }


});
    // consol

module.exports = router;



