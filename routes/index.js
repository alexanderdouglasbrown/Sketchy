var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sketchy' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chat Sample' });
});

module.exports = router;
