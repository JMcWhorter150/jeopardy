const api = require('./api');
const airDates = require('../lists/air-date-show');


function dateToFormattedString(dateObject) {
    const year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = dateObject.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    const dateString = `${year}-${month}-${day}`;
    return dateString;
}

function getShowNumberFromDate(dateObj) {
    // const dateString = dateToFormattedString(dateObj);
    const dateString = dateObj;
    if (airDates.hasOwnProperty(dateString)) {
        return airDates[dateString];
    } else {
        return null;
    }
}

function getRoundInt(roundName) {
    if (roundName === "Jeopardy!") {
        return '1';
    } else if (roundName == "Double Jeopardy!") {
        return '2';
    } else if (roundName == "Final Jeopardy!") {
        return '3';
    } else if (roundName == "Tiebreaker") {
        return '4';
    } else {
        return null;
    }
}

async function getQuestionArray(date, roundName) {
    const showNumber = getShowNumberFromDate(date);
    const roundNumber = getRoundInt(roundName);
    if (showNumber && roundNumber) {
        const responseObj = await api.getQuestionsForRound(showNumber, roundNumber);
        return responseObj;
    } else {

    }
}

async function createArrayofArrayObject(date) {
    const showNumber = getShowNumberFromDate(date);
    let questionsArray = [];
    let roundCount = 1;
    while (roundCount < 4) {
        questionsArray.push(await api.getQuestionsForRound(showNumber, roundCount));
        roundCount++
    }
    return questionsArray;
}


module.exports = {
    dateToFormattedString,
    getShowNumberFromDate,
    getQuestionArray,
    createArrayofArrayObject
}