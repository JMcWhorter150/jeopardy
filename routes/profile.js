const express = require('express');
const router = express.Router();

const user = require('../modules/user');
const data = require('../modules/data');

const stats = require('../models/stats');


router.get('/', async (req, res) => {
    const games = await user.getUserGames(req.session.user.id)
    const gamesList = games.map((game) => {
        const date = data.dateToFormattedString(game.dateplayed)
        return `<tr>
            <td>${date}</td>\n
            <td>${game.episodeplayed}</td>\n
            <td>${game.score}</td>\n
        </tr>\n
        `
    });

    const totalGamesPlayed = await stats.getTotalGamesPlayed(req.session.user.id);
    // console.log(totalGamesPlayed);
    const totalGamesPlayedHTML = `<tr>
            <td>Games Played</td>\n
            <td>${totalGamesPlayed[0].count}</td>\n
        </tr>\n`;
    
    const totalCorrectAnswers = await stats.getTotalCorrectAnswers(req.session.user.id);
    console.log(totalCorrectAnswers);
    const totalCorrectAnswersHTML = `<tr>
        <td>Correct Answers</td>\n
        <td>${totalCorrectAnswers[0].total}</td>\n
    </tr>\n`;


    res.render('profile', {
        locals: {
            pagetitle: `${req.session.user.name}'s Profile`,
            username: req.session.user.name,
            gamesList: gamesList.join(''),
            totalGamesPlayed: totalGamesPlayedHTML,
            totalCorrectAnswers: totalCorrectAnswersHTML
        },
        partials: {
            head: '/partials/head',
            navbar: req.session.navbar.value,
            footer: 'partials/footer'
        }
    });
});


module.exports = router;