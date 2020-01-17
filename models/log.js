const db = require('./connection');

async function logGameToDatabase(winner_id, datePlayed, episodePlayed) {
    try {
        const gameLog = await db.one(`
        insert into gamesLog
            (winner_id, datePlayed, episodePlayed)
        values
            ($1, $2, $3)
        `, [winner_id, datePlayed, episodePlayed]);
    } catch (err) {
        console.log(err);
    }
}

async function logScoreToDatabase(user_id, game_id, score) {
    try {
        const scoreLog = await db.one(`
        insert into scores
            (user_id, game_id, score)
        values
            ($1, $2, $3)
        `, [user_id, game_id, score]);
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    logGameToDatabase,
    logScoreToDatabase
}