'use strict';

module.exports = (sequelize, DataTypes) => {

  var Wiki = sequelize.define('Wiki', {

    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    body: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    private: {
      allowNull: false,
      default: false,
      type: DataTypes.BOOLEAN,
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Users", //table name
        key: "id",
        as: "userId",
      }
    }

  }, {});

  Wiki.associate = function(models) {
    // associations can be defined here

    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    
  };

  return Wiki;

};