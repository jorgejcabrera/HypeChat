'use strict';

module.exports = (sequelize, type) => {
  var User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: type.STRING,
    },
    // TODO this attribute must not be updateable
    isAdmin: {
      type: type.BOOLEAN,
      allowNull: false,
    },
    lastName: {
      allowNull: false,
      type: type.STRING,
    },
    email: {
      type: type.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: type.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: type.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Workspace,{
      through: 'WorkspaceUsers',
      as: 'workspaces',
      foreignKey: 'userId'
    });
  };

  return User;
};
