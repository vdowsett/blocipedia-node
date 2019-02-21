const wikiQueries = require("../db/queries.wikis.js");

const Authorizer = require("../policies/wiki");

const markdown = require("markdown").markdown;

module.exports = {

  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if(err){
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/wiki", {wikis});
      }
     })
  },

  new(req, res, next){

    const authorized = new Authorizer(req.user).new();

    if(authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next){

    const authorized = new Authorizer(req.user).create();

    setPrivate = (privacyInput) => {

      let private;

      if(privacyInput == null) {
        private = false;
      } else {
        private = privacyInput;
      }
  
      return private;
  
    };

    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: this.setPrivate(req.body.private),
        userId: req.user.id
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {

      if(err || wiki == null){
        res.redirect(404, "/");
      } else {

        console.log(markdown.toHTML(wiki.body));

        res.render( "wikis/show", 
          {
            wiki: {
              id: wiki.id,
              title: wiki.title,
              body: markdown.toHTML(wiki.body)
            }
          },
          );
      }
    });
  },

  destroy(req, res, next){
    
      wikiQueries.deleteWiki(req, (err, wiki) => {
        if(err){
          res.redirect(401, `/wikis/${req.params.id}`)
        } else {
          res.redirect(303, "/wikis")
        }
      });
      
  },

  edit(req, res, next){

      wikiQueries.getWiki(req.params.id, (err, wiki) => {

        if(err || wiki == null) {

          res.redirect(404, "/");

        } else {

          const authorized = new Authorizer(req.user, wiki).edit();

          if(authorized) {

            res.render(`wikis/edit`, {wiki});

          } else {

            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");

          }
        }
      });
  },

  update(req, res, next){
    
      wikiQueries.updateWiki(req, req.body, (err, wiki) => {
        if(err || wiki == null){
          res.redirect(401, `/wikis/${req.params.id}/edit`);
        } else {
          res.redirect(`/wikis/${req.params.id}`);
        }
      });
      
  },

  private(req, res, next) {

    wikiQueries.updatePrivate(req, (err, wiki) => {
      if(err){
        req.flash("notice", "Privacy update failed");
        res.redirect(401, `/wikis/${req.params.id}`)
      } else {
        req.flash("notice", "Privacy update success");
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },

}