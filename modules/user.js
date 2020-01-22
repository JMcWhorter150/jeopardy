const db = require('../models/connection');

async function getUserGames(userID) {
    try {
        const games = await db.query(`select * from gamesLog where user_id=$1`, userID);
        return games;
    } catch (err) {
        // console.log(err);
        return [];
    }
};





module.exports = {
    getUserGames
}