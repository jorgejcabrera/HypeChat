'use strict';

module.exports = (sequelize, type) => {
  var WorkspaceUsers = sequelize.define('WorkspaceUsers', {
    userId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    workspaceId: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'Workspace',
        key: 'id',
      },
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

  /* WorkspaceUsers.associate = (models) => {
    // Add any relations (foreign keys) here.
    WorkspaceUsers.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
    });
    WorkspaceUsers.belongsTo(models.Workspace, {
        foreignKey: 'workspaceId',
        as: 'workspace',
    });
  };*/

  return WorkspaceUsers;
};
