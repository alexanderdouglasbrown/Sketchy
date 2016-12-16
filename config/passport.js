var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

var configAuth = require('./authentication')

var Player = function(id, displayName) {
  this.id = id;
  this.displayName = displayName
}


module.exports = function( passport ) {
  passport.serializeUser( function( player, done ) {
    done( null, player.displayName)
  })

  passport.deserializeUser( function( id, done ) {
    done(null, id)
  })

  passport.use( new GoogleStrategy( {
    clientID: configAuth.googleAuth.client_id,
    clientSecret: configAuth.googleAuth.client_secret,
    callbackURL: configAuth.googleAuth.callback_url
  },
  
  function( token, refreshToken, profile, done ) {
    process.nextTick( function() {
      var player = new Player(profile.id, profile.emails[0].value)
      console.log(player)
      return done(null, player)
    })
  }))
}

