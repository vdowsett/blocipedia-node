const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

    signUp(req, res, next){
      res.render("users/sign_up");
    },

    create(req, res, next){
      
           let newUser = {
             username: req.body.username,
             email: req.body.email,
             password: req.body.password,
             passwordConfirmation: req.body.passwordConfirmation
           };

           const msg = {
            to: newUser.email,
            from: 'vdowsett@gmail.com',
            subject: 'Welcome to Blocipedia',
            text: 'Did you know? Every citizen of Kentucky is required by law to take a bath once a year.',
            html: '<strong>Did you know? </strong> Every citizen of Kentucky is required by law to take a bath once a year.',
          };
           
           userQueries.createUser(newUser, (err, user) => {
             if(err){
               req.flash("error", err);
               console.log(err);
               res.redirect("/users/sign_up");
             } else {
               passport.authenticate("local")(req, res, () => {
                sgMail.send(msg);
                req.flash("notice", "You've successfully signed up!");
                res.redirect("/");
               })
             }
           });
         }

}