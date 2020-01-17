var express = require('express');
var router = express.Router();

// const data = require('../modules/data');

const axios = require('axios').default;
const jeopardyAPI = 'https://jeopardy.bentleyherron.dev/api';

async function getQuestionsForRound(showNumber='5392', roundNumber) {
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
    // const data = await data.createArrayofArrayObject('2008-02-05');
    const data = await getQuestionsForRound();
    res.render('game', {
        locals: {
            pagetitle: 'Play Jeopardy',
            arrayArrayObject: JSON.stringify(data)
        },
        partials: {
          navbar: req.session.navbar.value
        }
    });
})



module.exports = router;