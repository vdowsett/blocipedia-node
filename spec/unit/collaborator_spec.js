const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("Collaborator", () => {

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
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki; //store the wiki
          done();
        })
      })
    });
  });

  describe("#create()", () => {

    beforeEach((done) => {

      User.create({
        username: "test-collaborator",
        email: "collaborator@collaborator.com",
        password: "collaborator"
      }).then((collabUser) => {
        this.collabUser = collabUser; //store the user
        done();
      })

    });
      
    it("should create a collaborator object with wikiId and collabId pulled from associations", (done) => {

      Collaborator.create({
        wikiId: this.wiki.id,
        collabId: this.collabUser.id
      })
      .then((collaborator) => {
        expect(collaborator.wikiId).toBe(1);
        expect(collaborator.collabId).toBe(2);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

});