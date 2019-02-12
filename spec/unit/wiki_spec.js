const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {
      
    it("should create a Wiki object associated with a user", (done) => {
      User.create({
        username: "example",
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        Wiki.create({
            title: "Wiki title",
            body: "wiki body",
            private: false,
          })
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});