const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

const Authorizer = require("../policies/application");

module.exports = {
  
  getAllWikis(callback){
    
    return Wiki.findAll()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getLatestWikis(callback) {

    let wikis = {};

    Wiki.findAll()
    .then((wikis) => {

      if(!wikis) {
        callback(null, result);
      } else {
        Wiki.scope( { method: ["lastTenPublic"] } ).all()
        .then((wikis) => {
          wikis["wikis"] = wikis;
          callback(null, wikis);
        })
      }
    
    })
    .catch((err) => {callback(404)});
      
    
  },

  addWiki(newWiki, callback) {

    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback) {

    return Wiki.findById(id, {
      include: [{
        model: Collaborator, 
        as: "collaborators",
        include: [{
          model: User
        }]
      }]
    })
    .then((wiki) => {
      if (!wiki) {
        callback(404);
      } else {
        callback(null, wiki);
      }
      
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback){

    return Wiki.findById(req.params.id)

    .then((wiki) => {

      const authorized = new Authorizer(req.user, wiki).destroy();

      if(authorized) {

        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });

      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },

  updateWiki(req, updatedWiki, callback){

    return Wiki.findById(req.params.id, {
      include: [ //need this to add collaborators, but breaks show view so need to work on it
        {
          model: Collaborator, 
          as: "collaborators", 
          include: [{ model: User }]
        },
      ]
    })

    .then((wiki) => {

      if(!wiki){
        return callback("Wiki not found");
      }

      const authorized = new Authorizer(req.user, wiki).update();

      if(authorized) {
        
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });

    } else {

      req.flash("notice", "You are not authorized to do that.");
      callback("Forbidden");
      
    }
        
    });
  },

  updatePrivate(req, callback){

    return Wiki.findById(req.params.id)

    .then((wiki) => {

      if(!wiki){
        return callback("Wiki not found");
      }

      const authorized = new Authorizer(req.user, wiki).update();

      if(authorized) {

        if (wiki.private === false) {
          wiki.update({private:true}, {fields: ['private']})
          .then((res) => {
            callback(null, wiki);
          });
        } else {
          wiki.update({private:false}, {fields: ['private']})
          .then((res) => {
            callback(null, wiki);
          });
        }

      }
    })
  },

  

}