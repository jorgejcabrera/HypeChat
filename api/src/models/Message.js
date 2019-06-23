'use strict';

module.exports = (sequelize, type) => {
  var Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    userId: {
      allowNull: false,
      type: type.INTEGER,
    },
    workspaceId: {
      allowNull: false,
      type: type.INTEGER,
    },
    total: {
      allowNull: true,
      type: type.INTEGER,
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

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Message.belongsTo(models.Workspace, {
      foreignKey: 'workspaceId',
      as: 'workspace',
    });
  };

  return Message;
};
