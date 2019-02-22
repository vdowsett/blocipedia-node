const collaboratorQueries = require("../db/queries.collaborator.js");
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");

const passport = require("passport");

module.exports = {
  
create(req, res, next) { 

  const email = req.body.collaboratorEmail;
  const wikiId = req.params.id;

  console.log("balls: " + email);

  userQueries.emailLookup(email, (err, user) => {
    if(err) {
      req.flash("notice", "User not found", err);
      res.redirect(req.headers.referer);
    } else {

      wikiQueries.getWiki(wikiId, (err, wiki) => {
        if(err){
          req.flash("notice", "Wiki not found", err)
          res.redirect(req.headers.referer);
        } else {

          let newCollaborator = {
            wikiId: wiki.id,
            collabId: user.id
          }

          collaboratorQueries.createCollaborator(newCollaborator, (err, collaborator) => {
            if(err){
              req.flash("notice", "Collaborator not created", err);
              res.redirect(req.headers.referer);
            } else {
              req.flash("notice", "Collaborator successfully created");
              res.redirect(req.headers.referer);
            }
          });
          
        }
      });

    }
  });
    
  }, //developing

}