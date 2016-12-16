var express = require('express');
var passport = require('passport')
require('../config/passport')(passport)
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sketchy', player : req.user });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Sketchy' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Chat Sample' });
});

router.get( '/game/:id', function( request, response ) {
  //response.send( 'Your game is ' + request.params.id )
  response.render('game' , {title: 'Sketchy' , gameid : request.params.id })
});

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

module.exports = router;
