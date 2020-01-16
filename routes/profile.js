const express = require('express');
const router = express.Router();

const user = require('../modules/user');
const data = require('../modules/data');



router.get('/', async (req, res) => {
    const games = await user.getUserGames(req.session.user.id)
    const gamesList = games.map((game) => {
        const date = data.dateToFormattedString(game.dateplayed)
        return `<tr>
            <td>${date}</td>\n
            <td>${game.episodeplayed}</td>\n
            <td></td>\n
        </tr>\n
        `
    });
    res.render('profile', {
        locals: {
            pagetitle: `${req.session.user.name}'s Profile`,
            username: req.session.user.name,
            gamesList: gamesList.join('')
        },
        partials: {
            navbar: req.session.navbar.value
        }
    });
});


module.exports = router;