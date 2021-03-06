'use strict';

module.exports = (sequelize, type) => {
  var Workspace = sequelize.define('Workspace', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    name: {
      allowNull: false,
      type: type.STRING,
    },
    // TODO: define how to store images.
    // For now let's just use an external URL.
    image: {
      allowNull: false,
      type: type.STRING,
      validate: {
        isUrl: true,
      },
    },
    base64Image: {
      allowNull: true,
      type: type.STRING,
    },
    // TODO: check how to store the location.
    location: {
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
    creatorId: {
      allowNull: false,
      type: type.INTEGER,
    },
    description: {
      type: type.STRING,
    },
    welcomeMessage: {
      allowNull: false,
      type: type.STRING,
    },
    // TODO: Active users
  }, {
    hooks: {
      beforeValidate: (workspace, options) => {
        workspace.welcomeMessage = 'Welcome to ' + workspace.name + '!';
      },
    },
  });

  Workspace.associate = (models) => {
    // Add any relations (foreign keys) here.
    Workspace.belongsToMany(models.User, {
      through: 'WorkspaceUsers',
      as: 'users',
      foreignKey: 'workspaceId',
    });

    Workspace.hasMany(models.Group, {
      foreignKey: 'workspaceId',
      as: 'groups',
    });

  };

  return Workspace;
};
