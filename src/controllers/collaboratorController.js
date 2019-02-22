const collaboratorQueries = require("../db/queries.collaborator.js");
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");

const Authorizer = require("../policies/collaborator");

const passport = require("passport");

module.exports = {
  
  create(req, res, next) { 

    const email = req.body.collaboratorEmail;
    const wikiId = req.params.id;

    const authorized = new Authorizer(req.user).create();

    if(authorized) {

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
  
              collaboratorQueries.createCollaborator(newCollaborator, (err, collaborators) => {
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
      
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }

    
      
  }, //working

  destroy(req, res, next) {

    const authorized = new Authorizer(req.user).destroy();

    if(authorized) {

      collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
        if(err){
          req.flash("error", err);
          res.redirect(req.headers.referer);
        } else {
          req.flash("notice", "You've successfully removed the collaborator!");
          res.redirect(req.headers.referer);
        }
      });
      
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }

    
  }
}