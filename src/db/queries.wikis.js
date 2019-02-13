const Wiki = require("./models").Wiki;

//const Authorizer = require("../policies/application");

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

    return Wiki.findById(id)

    .then((wiki) => {
      callback(null, wiki);
      console.log(wiki.posts);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback){

    return Wiki.findById(req.params.id)

    .then((wiki) => {

        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });

    })
    .catch((err) => {
      callback(err);
    });
  },

  updateWiki(req, updatedWiki, callback){

    return Wiki.findById(req.params.id)

    .then((wiki) => {

      if(!wiki){
        return callback("Wiki not found");
      }

      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
        
    });
  }
}