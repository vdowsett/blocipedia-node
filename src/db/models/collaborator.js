'use strict';

const Wiki = require("./").Wiki;
const User = require("./").User;

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
    
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.User, {
      foreignKey: "collabId",
      onDelete: "CASCADE"
    });
  };
  return Collaborator;
};