const db = require('./connection');

function dateToFormattedString(dateObject) {
    const year = dateObject.getFullYear();  // YYYY
    let month = dateObject.getMonth() + 1;  // MM
    if (month < 10) {
        month = `0${month}`;
    }
    let day = dateObject.getDate();         // DD
    if (day < 10) {
        day = `0${day}`;
    }
    const dateString = `${year}/${month}/${day}`;
    return dateString;
}

async function logGameToDatabase(user_id, datePlayed, episodePlayed, score) {
    try {
        const gameLog = await db.one(`
        insert into gamesLog
            (user_id, datePlayed, episodePlayed, score)
        values
            ($1, $2, $3, $4)
        returning id
        `, [user_id, datePlayed, episodePlayed, score]);
        return gameLog.id;
    } catch(err) {
        // console.log(err);
    }
}

async function logStatsToDatabase(game_id, jeopardyQuestionsCorrect, jeopardyQuestionsNotAnswered, dJeopardyQuestionsCorrect, dJeopardyQuestionsNotAnswered, fJeopardyCorrect) {
    try {
        const statsLog = await db.one(`
        insert into stats
        (game_id, questionsCorrectJeopardy, questionsNotAnsweredJeopardy, questionsCorrectDoubleJeopardy, questionsNotAnsweredDoubleJeopardy, questionsCorrectFinalJeopardy)
        values
            ($1, $2, $3, $4, $5, $6)
        returning game_id
        `, [game_id, jeopardyQuestionsCorrect, jeopardyQuestionsNotAnswered, dJeopardyQuestionsCorrect, dJeopardyQuestionsNotAnswered, fJeopardyCorrect]);
        return statsLog.game_id;
    } catch (err) {
        // console.log(err);
    }
}


module.exports = {
    dateToFormattedString,
    logGameToDatabase,
    logStatsToDatabase
}