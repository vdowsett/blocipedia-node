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

    Wiki.hasMany(models.Collaborator, { 
      foreignKey: 'wikiId',
      as: "collaborators" 
    });

    Wiki.addScope("lastTen", (userId) => {
      return {
        where: { userId: userId },
        limit: 10,
        order: [["createdAt", "DESC"]]
      }
    });
    
  };

    //a function to return all associated collaborators of a wiki


  return Wiki;

};