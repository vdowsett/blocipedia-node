const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../db/models").User;

const authHelper = require("../auth/helpers");

module.exports = {
  init(app){

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
      function(username, password, done) {
        User.findOne({ where: { username: user.username } }, function (err, user) {

          if (err) { return done(err); }

          if (!user || !authHelper.comparePass(password, user.password)) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);

        });
      }
      
    ));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

  }
}