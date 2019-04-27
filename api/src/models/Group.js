'use strict';

module.exports = (sequelize, type) => {
  var Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    creatorId: {
      allowNull: false,
      type: type.INTEGER,
    },
    workspaceId: {
      allowNull: false,
      type: type.INTEGER,
    },
    name: {
      allowNull: false,
      type: type.STRING,
    },
    isActive: {
      type: type.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: type.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: type.DATE,
    },
  });

  Group.associate = (models) => {
    // Add any relations (foreign keys) here.
    Group.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    Group.belongsTo(models.Workspace, {
      foreignKey: 'workspaceId',
      as: 'workspace',
    });
  };

  return Group;
};
