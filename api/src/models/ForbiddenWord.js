'use strict';

module.exports = (sequelize, type) => {
  var ForbiddenWord = sequelize.define('ForbiddenWord', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    workspaceId: {
      allowNull: false,
      type: type.INTEGER,
    },
    word: {
      allowNull: false,
      type: type.STRING,
    },
    replaceBy: {
      allowNull: false,
      type: type.STRING,
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

  ForbiddenWord.associate = (models) => {
    ForbiddenWord.belongsTo(models.Workspace, {
      foreignKey: 'workspaceId',
      as: 'workspace',
    });
  };
  return ForbiddenWord;
};
