const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;

const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

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
          title: "Wiki Example",
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
  });

  describe("wikis pulic access", () => {

    describe("GET /wikis", () => {
        
      it("should view wiki list", (done) => {
  
          request.get(base, (err, res, body) => {
              expect(res.statusCode).toBe(200);
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              done();
          });
          
      });
    });

  });

  describe("wikis user access", () => {

    beforeEach((done) => {
      User.create({
        email: "member@member.com",
        username: "member",
        password: "12345",
      })
      .then((user) => {
        this.user = user;
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            email: "member@member.com",
            userId: this.user.id
          }
        });
        done();
      });
    });

    describe("GET /wikis", () => {
        
      it("should view wiki list with new wiki button visible", (done) => {
  
          request.get(base, (err, res, body) => {
              expect(this.user.id).toBe(2);
              expect(res.statusCode).toBe(200);
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              done();
          });
          
      });
    });

    describe("GET /new", () => {
        
      it("should view new wiki page", (done) => {
  
        request.get(`${base}new`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
      });
          
      });
    });
  
    describe("POST /wikis/create", () => {
  
        it("should create a new wiki with associated user ID", (done) => {
  
          const options = {
            url: `${base}create`,
            form: {
              title: "Example of wiki create title",
              body: "Example of wiki create body",
              private: false,
            }
          }
  
          request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "Example of wiki create title"}})
            .then((wiki) => {
              expect(wiki.title).toBe("Example of wiki create title");
              expect(wiki.body).toContain("wiki create body");
              expect(wiki.userId).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
  
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki", (done) => {
        expect(this.wiki.id).toBe(1);
        request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findById(1)
          .then((wiki) => {
            expect(err).toBeNull();
            expect(wiki).not.toBeNull();
            done();
          })
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render an edit view with an update form", (done) => {
        request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Wiki Editing Example",
            body: "changing wiki",
            private: true,
            userId: this.user.id
          }
        };
        request.post(options, (err, res, body) => {
          Wiki.findOne({
            where: {id: this.wiki.id}
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Wiki Editing Example");
            done();
          });
        });
      });
    });

  });

});