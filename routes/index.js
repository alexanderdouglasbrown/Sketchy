let express = require('express');
let router = express.Router();
const UUID = require('uuid/v4');
let random;

/* GET home page. */
router.get('/', function (req, res, next) {
  setSession(req.session);
  req.session.roomId = ' ';
  req.session.inGame = false;
  res.render('index', { title: 'Sketchy', username: req.session.username, id: req.session.id });
});
/*
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});
*/

/*router.get('/chat', function(req, res, next) {
  setSession(req.session);
  res.render('chat', { title: 'Chat Sample' }); 
  res.send({hi : 'hello'}) 
});
*/
router.get('/game/:id', function (req, res, next) {
  setSession(req.session)
  req.session.roomId = req.params.id
  req.session.inGame = true;
  res.render('game', { title: 'Sketchy', roomid: req.params.id, id: req.session.id })
  //res.send( 'Your game is ' + req.params.id )
});

function setSession(session) {
  random = Math.floor((Math.random() * 10000) + 1)
  if (!session.isSet) {
    session.isSet = true
    session.id = UUID();
    session.username = 'Anon' + random
    session.inGame = false
    session.roomId = ' '
  }
}

module.exports = router;
