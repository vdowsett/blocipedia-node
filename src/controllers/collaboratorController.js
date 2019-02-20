const collaboratorQueries = require("../db/queries.collaborator.js");

const Authorizer = require("../policies/wiki");

module.exports = {

create(req, res, next){
      
    let newCollaborator = {
      email: req.body.collaboratorEmail,
    };
    
    userQueries.addCollaborator(newCollaborator, (err, collaborator) => {
      if(err){
        req.flash("notice", "We could not add that collaborator!", err);
        res.redirect(req.headers.referer);
      } else {
        passport.authenticate("local")(req, res, () => {
         req.flash("notice", "You've successfully added a new collaborator!");
         res.redirect(req.headers.referer);
        })
      }
    });
  }, //developing

}