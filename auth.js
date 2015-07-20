var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('./models/user'),
    config = require('./_config');
    var bcrypt = require('bcrypt-nodejs');
	
	passport.use(new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
   new User.User({UserName: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if (password !== user.Password) {
            return done(null, false, {message: 'Invalid username or password'});
         } else {
            return done(null, user);
         }
      }
   });
}));


//passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});


module.exports = passport;
