let promise = require('bluebird');

let options = {
    promiseLib: promise
};

let pgp = require('pg-promise')(options);
let connectionString = process.env.DATABASE_URL//'postgres://localhost:5432/Brian';
let db = pgp(connectionString);

module.exports = {
    getWord: getWord
};

function getWord(req, res, next) {
    db.one('SELECT word from wordlist ORDER BY random() LIMIT 1')
        .then(function (data) {
            console.log(data);    // print word to console to test
            });
    })
    .catch(function (err) {
        return next(err);
    });
}