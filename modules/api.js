const axios = require('axios').default;

const jeopardyAPI = 'https://jeopardy.bentleyherron.dev/api';


async function getQuestionsFromDate(date) {
    const splitDate = date.split('-');
    try {
        const response = await axios.get(jeopardyAPI + `/shows/date/${splitDate[0]}/${splitDate[1]}`);
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}

async function getQuestionsForRound(showNumber, roundNumber) {
    try {
        const response = await axios.get(jeopardyAPI + `/shows/${showNumber}/${roundNumber}`);
        return response.data.questions;
    } catch (error) {
        // console.error(error);
    }
}





module.exports = {
    getQuestionsFromDate,
    getQuestionsForRound
}