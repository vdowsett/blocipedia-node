'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'plan', Sequelize.STRING, {defaultValue: "free"});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'Users', 'role');
  }
};
