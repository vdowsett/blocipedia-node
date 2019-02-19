const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

    edit() {

        if ( this.record.private == true ) {
           return this._isOwner
        } else {
            return this.record && this.new();
        }
        
    }
}