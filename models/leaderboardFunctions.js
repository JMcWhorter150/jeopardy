const db = require('./connection');

async function getTopTenGames() {
    const topGamesArray = await db.query(`
        select * from scores 
        order by score desc
        limit 10
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

module.exports = {
    getTopTenGames
};

