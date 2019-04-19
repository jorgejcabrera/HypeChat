'use strict';

module.exports = (sequelize, type) => {
  var UserGroup = sequelize.define('UserGroup', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    userId: {
      allowNull: true,
      type: type.INTEGER,
    },
    groupId: {
      type: type.INTEGER,
      allowNull: true,
    },
    isActive: {
      allowNull: false,
      type: type.BOOLEAN,
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

  UserGroup.associate = (models) => {
    // Add any relations (foreign keys) here.
    UserGroup.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
    });

    UserGroup.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return UserGroup;
};
