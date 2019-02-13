'use strict';

const faker = require("faker");

let users = [];

for(let i = 1 ; i <= 10 ; i++){
  users.push({
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    role: faker.random.number({min: 0, max: 3}),
    plan: faker.random.arrayElement(["free", "premium"]),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
