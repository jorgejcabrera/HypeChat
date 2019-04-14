'use strict';

module.exports = (sequelize, type) => {
  var MessageRecipient = sequelize.define('MessageRecipient', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: type.INTEGER,
    },
    recipientId: {
      allowNull: true,
      type: type.INTEGER,
    },
    recipientGroupId: {
      allowNull: true,
      type: type.INTEGER,
    },
    messageId: {
      allowNull: false,
      type: type.INTEGER,
    },
    isRead: {
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

  MessageRecipient.associate = (models) => {
    // Add any relations (foreign keys) here.
    MessageRecipient.belongsTo(models.User, { 
        foreignKey: 'recipientId', 
        as: 'user' 
    });
    MessageRecipient.belongsTo(models.UserGroup, { 
        foreignKey: 'recipientGroupId', 
        as: 'recipientGroup' 
    });
    MessageRecipient.belongsTo(models.Message, { 
        foreignKey: 'messageId', 
        as: 'message' 
    });
  };

  return MessageRecipient;
};
