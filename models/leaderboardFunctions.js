const db = require('./connection');

async function getUsernameById(user_id) {
    const user_name = await db.query(`
        select name from users where id=$1
    `, [user_id])
        .then(data => {
            // console.log(data);
            return data
        })
        .catch (err => {
            console.log(err);
            return [];
        })
    // console.log(user_name);
    return user_name;
}

async function getTopTenGames() {
    const topGamesArray = await db.query(`
        select * from scores 
        order by score desc
        limit 10;
    `)
        .then(data => {
            // console.log(data);
            return data;
        })
        .catch (err => {
            console.log(err);
            return [];
        })
    return topGamesArray;
}

async function getTopTotalScores() {
    const topScoresArray = await db.query(`
        select user_id, sum(score)
        from scores
        group by user_id
        order by sum desc
        limit 10;
    `)
        .then(data => {
            console.log(data);
            return data;
        })
        .catch (err => {
            console.log(err);
            return [];
        })
    return topScoresArray;
}

module.exports = {
    getUsernameById,
    getTopTenGames,
    getTopTotalScores
};

