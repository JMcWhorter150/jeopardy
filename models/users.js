const db = require('./connection');
const bcrypt = require('bcryptjs');

// Create Password

function createHash(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

// Create User Entry
function create(username, password) {
    const lowerUser = username.toLowerCase();
    const hash = createHash(password);
    const newUser = {
        username: lowerUser,
        hash
    };
    return newUser;
}

// Retrieve
async function login(username, password) {
    const lowerUser = username.toLowerCase();
    const theUser = await getByUsername(lowerUser);
    return bcrypt.compareSync(password, theUser.hash);
}

async function checkUsername(username) {
    const lowerUser = username.toLowerCase();
    const theUser = await db.query(`select * from users where name=$1`, [lowerUser]);
    return theUser;
};

async function getByUsername(username) {
    const lowerUser = username.toLowerCase();
    const theUser = await db.one(`select * from users where name=$1`, [lowerUser]);
    return theUser;
};

async function addUserToDB(user) {
    const theUser = await db.one(`insert into users (name, hash) values ($1, $2) returning id`, [user.username, user.hash]);
    return theUser;
}


// Update password
async function updatePassword(id, password) {
    const result = await db.result(`update users set hash=$1 where id=$2;`, [password, id]);
    if (result.rowCount === 1) {
        return id;
    } else {
        return null;
    }
}


module.exports = {
    create,
    createHash,
    login,
    getByUsername,
    addUserToDB,
    updatePassword,
    checkUsername
}
