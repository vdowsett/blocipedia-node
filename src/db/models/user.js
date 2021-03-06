'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here

    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

    User.hasMany(models.Collaborator, { 
      foreignKey: 'collabId',
      as: "collaborators"
    });

  };
  return User;
};