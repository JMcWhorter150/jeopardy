const db = require('./connection');
const bcrypt = require('bcryptjs');

// Create Password

function createHash(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

// Create User Entry
function create(username, password) {
    const hash = createHash(password);
    const newUser = {
        username,
        hash
    };
    return newUser;
}

// Retrieve
async function login(username, password) {
    const theUser = await getByUsername(username);
    return bcrypt.compareSync(password, theUser.hash);
}

async function getByUsername(username) {
    const theUser = await db.one(`select * from users where name=$1`, [username]);
    return theUser;
};

async function addUserToDB(user) {
    const theUser = await db.one(`insert into users (name, hash) values ($1, $2) returning id`, [user.username, user.hash]);
    return theUser;
}



module.exports = {
    create,
    createHash,
    login,
    getByUsername,
    addUserToDB
}
