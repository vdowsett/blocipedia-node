'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define('Collaborator', {
    wikiId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    collabId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  Collaborator.associate = function(models) {
  };
  return Collaborator;
};