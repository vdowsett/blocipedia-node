const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";

const User = require("../../src/db/models").User;

const sequelize = require("../../src/db/models/index").sequelize;

const sgMail = require('@sendgrid/mail');



describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/sign_up", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });

  });

  describe("POST /users", () => {

    it("should create a new user and redirect", (done) => {

        const options = {
            url: base,
            form: {
                email: "user@example.com",
                username: "example",
                password: "password"
            }
        }

        request.post(options, (err, res, body) => {

            User.findOne({where: {email: "user@example.com"}})
            .then((user) => {
                expect(user).not.toBeNull();
                expect(user.username).toBe("example");
                expect(user.email).toBe("user@example.com");
                expect(user.id).toBe(1);
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

    it("should create a new user, redirect and send an email via sendgrid", (done) => {

        const options = {
            url: base,
            form: {
                email: "vdowsett@gmail.com",
                username: "example",
                password: "password"
            }
        }

        request.post(options, (err, res, body) => {

            User.findOne({where: {email: "vdowsett@gmail.com"}})
            .then((user) => {

                const msg = {
                    to: this.user.email,
                    from: 'test@example.com',
                    subject: 'Sending with SendGrid is Fun',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                  };

                  sgMail.send(msg);

                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
          });

    });
    
  });

//   describe("GET /users/signIn", () => { });

//   describe("GET /users/signOut", () => { });
  
//   describe("GET /users/:id", () => { });
});