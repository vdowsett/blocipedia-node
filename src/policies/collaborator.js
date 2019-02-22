const ApplicationPolicy = require("./application");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {

    create() {

        return this._isOwner && this._isPremium
        
    }

    destroy() {

        return this.create();
        
    }

}