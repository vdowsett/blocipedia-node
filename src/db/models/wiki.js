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

    Wiki.addScope("lastFivePublic", (userId) => {
      return {
        where: { userId: userId, private: false },
        limit: 5,
        order: [["createdAt", "DESC"]]
      }
    });

    Wiki.addScope("lastFivePrivate", (userId) => {
      return {
        where: { userId: userId, private: true },
        limit: 5,
        order: [["createdAt", "DESC"]]
      }
    });
    
  };

  return Wiki;

};