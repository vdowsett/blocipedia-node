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
        }, {
          include: {
              model: Collaborator,
              as: "collaborators"
          }
      })
        .then((wiki) => {
          this.wiki = wiki; //store the wiki
          done();
        })
      })
    });
  }); //working

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

    }); //working

    it("should add a new collaborator to a wiki", (done) => {

      const options = {
        url: `${base}${this.wiki.id}/collaborator/create`,
        form: {
          collaboratorEmail: "collaborator@collaborator.com"
        }
      };

        request.post(options, (err, res, body) => {
          Collaborator.findOne({
              where: { 
                wikiId: this.wiki.id,
                collabId: this.collabUser.id
               }
          })
          .then((collaborator) => {
            expect(collaborator.collabId).toBe(2);
          })
        });

    })

  });

});