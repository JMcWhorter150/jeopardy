
var express = require('express');
var router = express.Router();
const leaderboard = require('../models/leaderboardFunctions');
const stats = require('../models/stats');

router.get('/', async (req, res) => {
    

    const topTenGames = await leaderboard.getTopTenGames();
    for (let entry of topTenGames) {
        let userName = await leaderboard.getUsernameById(entry.user_id)
        entry.user_id = await userName[0].name;
    }

    let gamesCount = 0;
    const topGamesHTML = topTenGames.map((game) => {
        gamesCount++;
        return `<tr>
            <td>${gamesCount}</td>\n
            <td>${game.user_id}</td>\n
            <td>$${game.score.toFixed(0)}</td>\n
        </tr>\n
        `
    }).join('');


    const topTotalScores = await leaderboard.getTopTotalScores();
    for (let entry of topTotalScores) {
        let userName = await leaderboard.getUsernameById(entry.user_id)
        entry.user_id = await userName[0].name;
    }

    let scoresCount = 0;
    const topScoresHTML = topTotalScores.map((user) => {
        scoresCount++;
        return `<tr>
            <td>${scoresCount}</td>\n
            <td>${user.user_id}</td>\n
            <td>$${user.sum}</td>\n
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
                analytics: 'partials/analytics',
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

module.exports = router;
