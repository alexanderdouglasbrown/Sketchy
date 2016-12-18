let express = require('express');
let router = express.Router();
const UUID = require('uuid/v4');
var passport = require('passport')
require('../config/passport')(passport)
let random;

/* GET home page. */
router.get('/', function (req, res, next) {
  setSession(req.session);
  req.session.roomId = ' ';
  req.session.inGame = false;
  res.render('index', { title: 'Sketchy', username: req.session.username, id: req.session.id, player: req.user });
});
/*
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});
*/

// router.get('/chat', function(req, res, next) {
//   setSession(req.session);
//   res.render('chat', { title: 'Chat Sample' }); 
//   res.send({hi : 'hello'}) 
// });

router.get('/game/:id', function (req, res, next) {
  setSession(req.session)
  req.session.roomId = req.params.id
  req.session.inGame = true;
  res.render('game', { title: 'Sketchy', roomid: req.params.id, id: req.session.id, player : req.user  })
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

router.get( '/auth', 
  passport.authenticate('google', {
    scope: ['profile', 'email'] 
  })
)

router.get( '/auth/callback', 
  passport.authenticate( 'google', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

router.get( '/logout', function( request, response ) {
  request.logout()
  response.redirect('/')
})

router.get( '/profile', isLoggedIn, function ( request, response ) {
  response.render('profile')
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
