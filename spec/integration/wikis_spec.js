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
    });
  });

  describe("GET /wikis", () => {
        
    it("should view wiki list and have button for new a new wiki", (done) => {

        request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(err).toBeNull();
            expect(body).toContain("Wikis");
            expect(body).toContain("Wiki Example");
            done();
        });
        
    });
  });

});