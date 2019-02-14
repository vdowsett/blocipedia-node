const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";

const User = require("../../src/db/models").User;

const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

    beforeEach((done) => {

        this.user;
        this.wiki;
    
        sequelize.sync({force: true}).then((res) => {
            
          User.create({
            username: "test-user",
            email: "test@test.com",
            password: "test",
          })
          .then((user) => {
            this.user = user; //store the user
            done();
            
            Wiki.create({
              title: "Wiki Example for User View",
              body: "Wiki example body",
              private: false,
              userId: this.user.id
            })
            .then((wiki) => {
              this.wiki = wiki; //store the wiki
              done();
            })
          })
          .catch((err) => {
            done();
          });
        });
    }); //working

    describe("GET /users/sign_up", () => {

        it("should render a view with a sign up form", (done) => {
        request.get(`${base}sign_up`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Sign up");
            done();
        });
        });

        //   describe("POST /users/signUp + payment", () => { });

    }); //passed

    describe("POST /users", () => {

        it("should create a new user and redirect", (done) => {

            const options = {
                url: base,
                form: {
                    email: "create@test.com",
                    username: "create",
                    password: "password"
                }
            }

            request.post(options, (err, res, body) => {

                User.findOne({where: {email: "create@test.com"}})
                .then((user) => {
                    expect(user).not.toBeNull();
                    expect(user.username).toBe("create");
                    expect(user.email).toBe("create@test.com");
                    expect(user.id).toBe(2);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
            });
        });

        it("should not create a user without valid attributes", () => {
            
            request.post(
                {
                    url: base,
                    form: {
                        email: "not valid",
                        password: "password"
                    }
                },
                (err, req, body) => {
                    
                    User.findOne({where: {email: "not valid"}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                })
        });
        
    }); //passed

    describe("GET /users/signIn", () => { 

        it("should render a view with a sign in form", (done) => {
            request.get(`${base}sign_in`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Sign In");
              done();
            });
          });
    }); //passed
  
    describe("GET /users/:id", () => {

        it("should present a list of public wikis a user has created", (done) => {

            request.get(`${base}${this.user.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain(this.user.username);
            done();
            });
    
        });

        //   it("should upgrade users to premium", (done) => { });

        //   it("should downgrade users to free", (done) => { });

    });





});