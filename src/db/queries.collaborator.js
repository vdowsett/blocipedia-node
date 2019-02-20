const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
    
    addCollaborator(newCollaborator, callback) {

        Wiki.findById(id)
        .then((wiki) => { return wiki.id; })
        .catch((err) => { callback(err); });

        User.findAll({
        where: {
            email: newCollaborator.email
        }
        })
        .then((user) => { return user.id; })
        .catch((err) => { callback(err); });

        return Collaborator.create({
            collabId: this.user.id,
            wikiId: this.wiki.id,
        })
        .then((collaborator) => {
        callback(null, collaborator);
        })
        .catch((err) => {
        callback(err);
        })
  },

}