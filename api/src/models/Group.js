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
    totalMessages: {
      type: type.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    visibility: {
      type: type.ENUM('PUBLIC', 'PRIVATE'),
      defaultValue: 'PUBLIC',
      allowNull: false,
    },
    description: {
      type: type.STRING,
      defaultValue: 'Descripción del grupo',
      allowNull: false,
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
    Group.belongsToMany(models.User, {
      through: 'UserGroup',
      as: 'users',
      foreignKey: 'groupId',
    });
  };

  return Group;
};
