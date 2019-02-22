const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
    
    index(req, res, next){

        wikiQueries.getLatestWikis((err, wikis) => {

            if(err || wikis == null){
                res.redirect(404, "/");
            } else {
                
                res.render( "static/index", {title: "Welcome to Bloccit", wikis });
            }
        });
    }
}