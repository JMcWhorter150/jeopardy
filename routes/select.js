var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const axios = require('axios').default;
const jeopardyAPI = 'https://jeopardy.bentleyherron.dev/api';

const data = require('../modules/data');
const dateData = require('../lists/show-dates');



async function getQuestionsForRound(showNumber, roundNumber) {
    let array = [];
    let count = 1;
    while (count < 4) {
        try {
            const response = await axios.get(jeopardyAPI + `/shows/${showNumber}/${count}`);
            array.push(response.data.questions);
        } catch (error) {
            console.error(error);
        }
        count++;
    }
    return array;
}


router.get('/', async (req, res)=>{
    const dateList = dateData.map((date) => {return `<option value="${date}">${date}</option>\n`});
    res.render('select-game', {
        locals: {
            pagetitle: 'Select Jeopardy Game',
            dateList,
            submitValue: 'Select Game'
            // arrayArrayObject: JSON.stringify(data)
        },
        partials: {
            head: '/partials/head',
            navbar: req.session.navbar.value,
            footer: '/partials/footer'
        }
    });
})


// Game select post
router.post('/', parseForm, async (req, res) => {
    const { date } = req.body;
    const showNumber = data.getShowNumberFromDate(date);
    // const showQuestions = await getQuestionsForRound(showNumber);
    if (showNumber) {
        res.redirect(`/game/${showNumber}`);
    } else {
        console.log(`Error in getting show.`);
    }
});



module.exports = router;