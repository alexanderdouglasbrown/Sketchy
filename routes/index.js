var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sketchy' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});

module.exports = router;
