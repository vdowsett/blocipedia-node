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
        password: "test"
      })
      .then((user) => {
        this.user = user; //store the user
        
        Wiki.create({
          title: "Wiki Example",
          body: "Wiki example body",
          private: false,
        })
        .then((wiki) => {
          this.wiki = wiki; //store the wiki
          done();
        })
      })
    });
  });

  describe("#create()", () => {
      
    it("should create a Wiki object associated with a user", (done) => {

      Wiki.create({
        title: "Wiki title",
        body: "wiki body",
        private: false,
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Wiki title");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});