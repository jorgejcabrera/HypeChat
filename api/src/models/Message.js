'use strict';

module.exports = (sequelize, type) => {
  var Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    subject: {
      allowNull: false,
      type: type.STRING,
    },
    creatorId: {
      allowNull: false,
      type: type.INTEGER,
    },
    messageBody: {
      allowNull: false,
      type: type.STRING,
    },
    parentMessageId: {
      type: type.STRING,
      allowNull: true,
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
    // Add any relations (foreign keys) here.
    Message.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'creatorId',
      });
    Message.belongsTo(models.Message, {
        as: 'parent',
        foreignKey: 'parentMessageId',
      });
  };

  return Message;
};
