'use strict';

module.exports = (sequelize, type) => {
  var Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    name: {
      allowNull: true,
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
  };

  return Group;
};
