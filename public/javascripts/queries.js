var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/Brian';
var db = pgp(connectionString);

module.exports = {
    getWord: getWord
};

function getWord(req, res, next) {
    db.one('SELECT word from wordlist ORDER BY random() LIMIT 1')
        .then(function (data) {
        res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Word Retrieved'
            });
    })
    .catch(function (err) {
        return next(err);
    });
}