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
    lastName: {
      allowNull: false,
      type: type.STRING,
    },
    latitude: {
      allowNull: true,
      type: type.DOUBLE,
    },
    longitude: {
      allowNull: true,
      type: type.DOUBLE,
    },
    firebaseToken: {
      allowNull: true,
      unique: true,
      type: type.STRING,
    },
    facebookId: {
      type: type.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: type.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: type.STRING,
      allowNull: true,
    },
    isBot: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    callbackOnMention: {
      type: type.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: true,
      },
    },
    status: {
      type: type.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    // TODO this attribute must not be updateable
    isAdmin: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    validate: {
      atLeastOneLogin() {
        if (!this.facebookId && !this.password) {
          var e = new Error();
          e.name = 'NoLoginSpecified';
          throw e;
        }
      },
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Workspace, {
      through: 'WorkspaceUsers',
      as: 'workspaces',
      foreignKey: 'userId',
    });

    User.belongsToMany(models.Group, {
      through: 'UserGroup',
      as: 'groups',
      foreignKey: 'userId',
    });
  };

  return User;
};
