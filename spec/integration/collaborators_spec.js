const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

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

    it("should post a wiki update and add a new collaborator", (done) => {

      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Wiki Editing premium Example",
          body: "changing wiki",
          private: true,
          userId: this.user.id,
          collaboratorEmail: "collaborator@collaborator.com"
        }
      };

        request.post(options, (err, res, body) => {
          Wiki.findOne({
            where: {id: this.wiki.id}
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Wiki Editing premium Example");
            Collaborator.findOne({
              where: { id: 1 }
            })
          })
          .then((collaborator) => {
            expect(collaborator.collabId).toBe(2);
          })
        });

    })

  });

});