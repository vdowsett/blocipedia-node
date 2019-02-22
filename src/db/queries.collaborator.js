const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;

const Authorizer = require("../policies/application");

module.exports = {
    
    createCollaborator(newCollaborator, callback) {
        return Collaborator.create( newCollaborator )
        .then(( collaborator ) => { callback(null, collaborator); })
        .catch((err) => { callback(err); })
    },

    removeCollaborator(req, callback) {

        id = req.params.id;
        console.log(id);

        return Collaborator.findById(req.params.id)

            .then((collaborator) => { 
                Collaborator.destroy({ where: { id }});
                callback(null, collaborator)
            })
            .catch((err) => {});
    }
}