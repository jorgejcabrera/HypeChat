'use strict';

module.exports = (sequelize, type) => {
  var WorkspaceUsers = sequelize.define('WorkspaceUsers', {
    userId: {
      type: type.INTEGER,
      allowNull: false,
    },
    workspaceId: {
      type: type.INTEGER,
      allowNull: false,
    },
    role: {
      type: type.ENUM('CREATOR', 'MODERATOR', 'MEMBER'),
      defaultValue: 'MEMBER',
      required: true,
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

  WorkspaceUsers.associate = (models) => {
    // Add any relations (foreign keys) here.
    WorkspaceUsers.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    WorkspaceUsers.belongsTo(models.Workspace, {
      foreignKey: 'workspaceId',
      as: 'workspace',
    });
  };
  return WorkspaceUsers;
};
