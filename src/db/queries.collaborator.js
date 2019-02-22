const Collaborator = require("./models").Collaborator;

const Authorizer = require("../policies/application");

module.exports = {
    
    createCollaborator(newCollaborator, callback) {
        return Collaborator.create( newCollaborator )
        .then(( collaborator ) => { callback(null, collaborator); })
        .catch((err) => { callback(err); })
    },

    removeCollaborator(req, callback) {

        return Collaborator.findById(req.params.id)

            .then((collaborator) => {

            const authorized = new Authorizer(req.user, collaborator).destroy();

            if(authorized) {

                collaborator.destroy()
                .then((res) => {
                callback(null, collaborator);
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
}