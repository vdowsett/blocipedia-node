module.exports = {
    
    fakeIt(app){
        
        let username, role, id, email;
        
        function middleware(req,res,next){
            
            id = req.body.userId || id;
            email = req.body.email || email;
            username = req.body.username || username;
            
            if(id && id != 0){
            req.user = {
                "id": id,
                "username": username,
                "email": email,
                "role": role
            };
            } else if(id == 0) {
            delete req.user;
            }

            if( next ){ next() }
        }
        
        function route(req,res){
            res.redirect("/")
        }
        
        app.use(middleware)
        app.get("/auth/fake", route)
    
    }

}