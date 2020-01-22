const db = require('./connection');

async function getUsernameById(user_id) {
    const user_name = await db.query(`
        select name from users where id=$1
    `, [user_id])
        .then(data => {
            return data
        })
        .catch (err => {
            // console.log(err);
            return [];
        })
    return user_name;
}

async function getTopTenGames() {
    const topGamesArray = await db.query(`
        select * from gamesLog 
        order by score desc
        limit 10;
    `)
        .then(data => {
            return data;
        })
        .catch (err => {
            // console.log(err);
            return [];
        })
    return topGamesArray;
}

async function getTopTotalScores() {
    const topScoresArray = await db.query(`
        select user_id, sum(score)
        from gamesLog
        group by user_id
        order by sum desc
        limit 10;
    `)
        .then(data => {
            return data;
        })
        .catch (err => {
            // console.log(err);
            return [];
        })
    return topScoresArray;
}

module.exports = {
    getUsernameById,
    getTopTenGames,
    getTopTotalScores
};

