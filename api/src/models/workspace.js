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
    // TODO: check how to store the location.
    location: {
      allowNull: false,
      type: type.STRING,
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
    Workspace.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      onDelete: 'CASCADE',
    });
  };

  return Workspace;
};
