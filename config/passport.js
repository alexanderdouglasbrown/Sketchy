var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

var configAuth = require('./authentication')

var Player = function(id, email, displayName) {
    this.id = id
    this.email = email
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
            clientID: (process.env.GAPI_CLIENT_ID || configAuth.googleAuth.client_id),
            clientSecret: (process.env.GAPI_CLIENT_SECRET || configAuth.googleAuth.client_secret),
            callbackURL: (process.env.GAPI_CALLBACK_URL || configAuth.googleAuth.callback_url)
        },

        function( token, refreshToken, profile, done ) {
            process.nextTick( function() {
                var player = new Player(profile.id, profile.emails[0].value, profile.displayName)
                console.log(player)
                return done(null, player)
            })
        }))
}