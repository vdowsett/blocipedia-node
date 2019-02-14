const userQueries = require("../db/queries.users.js");
const passport = require("passport");

const emails = require('../emails/sign_up');
const payments = require('../payments/payments');

module.exports = {

    signUp(req, res, next){
      res.render("users/sign_up");
    },

    authenticate(req, res, next) {
	    if (!req.user){
	      req.flash("notice", "You need to sign in or sign up before continuing.")
	      return res.redirect("/users/login");
	    } else {
	      next();
	    }
    },

    create(req, res, next){
      
      let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        plan: req.body.plan,
      };

      payments.premiumPayment(newUser, (err, payment) => {

        if(err) {

          req.flash("error" ,err);
          res.redirect("users/signup");
          
        } else {

          userQueries.createUser(newUser, (err, user) => {

            if(err){
    
              req.flash("error", err);
              res.redirect("/users/sign_up");
    
            } else {
    
              passport.authenticate("local")(req, res, () => { 
    
              emails.signUpEmail();
    
              req.flash("notice", "You've successfully signed up!");
              res.redirect("/");
              })
            }
          });

        }
      })

      
    },



    upgrade(req, res, next) {

    },

    downgrade(req, res, next) {
      
    },

    signInView(req, res, next) {
      res.render("users/sign_in");
    },

    signIn(req, res, next) {
      
      passport.authenticate("local")(req, res, function () {
        if(!req.user){
          console.log(res);
          req.flash("notice", "Sign in failed. Please try again.")
          res.redirect("/users/sign_up");
        } else {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        }
      })

    },

    signOut(req, res, next) {
      
      req.logout();
      req.flash("notice", "You've successfully signed out!");
      res.redirect("/");

    },

}