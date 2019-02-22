const User = require("./models").User;
const Wiki = require("./models").Wiki;
const wikiQueries = require("../db/queries.wikis.js");

const bcrypt = require("bcryptjs");

module.exports = {
    
  createUser(newUser, callback){
      
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
      role: newUser.role,
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  }, //working

  getUser(id, callback){
    
       let result = {};

       User.findById(id)
       .then((user) => {
            
        if(!user) {
          callback(404);
        } else {
          result["user"] = user;
          Wiki.scope({method: ["lastTenPerUser", id]}).all()
          .then((wikis) => {
            result["wikis"] = wikis;
            callback(null, result);
          })
          .catch((err) => {
            callback(err);
          });
        }
      });
  }, //working

  upgradeUser(id, callback) {

    return User.findById(id)
    
       .then((user) => {

          if(!user){
            return callback("User not found");
          }

          user.update({ role: 1 })
          .then((res) => {
            callback(null, user);
          })
          .catch((err) => {
            callback(err);
          });

        })
       .catch((err) => {
         callback(err);
       });

  }, //working

  downgradeUser(id, callback) {

    return User.findById(id, {
      include: [{
        model: Wiki,
        as: "wikis"
      }]
    })
    .then((user) => {

      if(!user){
        return callback("User not found");
      };

      if(user.wikis.length > 0) {
        user.wikis.forEach((wiki) => { 
          wiki.update( {private:false} ).then(() => { }).catch((err) => { });
        });
      };
      
      user.update( { role: 0 } ).then(() => { }).catch((err) => { });

      callback(null, user);

    })
    .catch((err) => {
      callback(err);
    });

  },

  emailLookup(email, callback) {
    User.findOne({ where: { email: email } })
    .then((user) => { callback(null, user); })
    .catch((err) => { callback(err); });
  },

}