let express = require('express');
let router = express.Router();
const UUID = require('uuid/v4');
var passport = require('passport')
require('../config/passport')(passport)
let random;

/* GET home page. */
router.get('/', function (req, res, next) {
  setSession(req);
  req.session.roomId = ' ';
  req.session.inGame = false;
  let playerInfo
  if (req.user == undefined)
    playerInfo = ''
  else
    playerInfo = { id: req.user.id, email: req.user.email }
  res.render('index', { title: 'Sketchy', username: req.session.username, id: req.session.id, player: playerInfo });
});
/*
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});
*/

router.get('/game/:id', function (req, res, next) {
  setSession(req)
  req.session.roomId = req.params.id
  req.session.inGame = true;
  res.render('game', { title: 'Sketchy', roomid: req.params.id, id: req.session.id, player: req.user.email, username: req.session.username })
  //res.send( 'Your game is ' + req.params.id )
});

function setSession(req) {
  random = Math.floor((Math.random() * 10000) + 1)
  if (!req.session.isSet) {
    req.session.isSet = true
    req.session.id = UUID();
    req.session.inGame = false
    req.session.roomId = ' '
  }
  if (req.user) {
    const email = req.user.email
    let splitname = email.split('@')
    req.session.username = splitname[0]
  }
  else {
    req.session.username = "- please sign in"
  }
}

router.get('/auth',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get('/auth/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

router.get('/logout', function (request, response) {
  request.logout()
  response.redirect('/')
})

router.get('/dashboard', isLoggedIn, function (req, res) {
  res.render('index', { title: 'Sketchy', username: req.session.username, id: req.session.id, player: req.user.email });
})

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  console.log(req.isAuthenticated())
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

// router.get('/sendme', function(res,rep){
//    response.send({hi : 'hello'})
// })

module.exports = router;
