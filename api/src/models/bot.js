'use strict';

module.exports = (sequelize, type) => {
  var Bot = sequelize.define('Bot', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    botName: {
      type: type.STRING,
      allowNull: false,
      unique: true,
    },
    secretKey: {
      type: type.STRING,
      allowNull: false,
      unique: true,
    },
    callbackOnMention: {
      type: type.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    workspaceId: {
      type: type.INTEGER,
      allowNull: false,
    },
    ownerId: {
      type: type.INTEGER,
      allowNull: false,
    }
  }, {});

  Bot.associate = (models) => {};

  return Bot;
};
