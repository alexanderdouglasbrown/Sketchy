var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

var configAuth = require('./authentication')

var Player = function(id, displayName) {
  this.id = id;
  this.displayName = displayName
}


module.exports = function( passport ) {
  passport.serializeUser( function( player, done ) {
    done( null, player)
  })

  passport.deserializeUser( function( id, done ) {
    done(null, id)
  })

  passport.use( new GoogleStrategy( {
    clientID: process.env.GAPI_CLIENT_ID,
    clientSecret: process.env.GAPI_CLIENT_SECRET,
    callbackURL: process.env.GAPI_CALLBACK_URL
  },
  
  function( token, refreshToken, profile, done ) {
    process.nextTick( function() {
      var player = new Player(profile.id, profile.emails[0].value)
      console.log(player)
      return done(null, player)
    })
  }))
}

