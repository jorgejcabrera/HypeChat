'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MessageRecipient', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recipientId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      recipientGroupId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'UserGroup', key: 'id' },
      },
      messageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Message', key: 'id' },
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }).then(function() {
      return queryInterface.addConstraint('MessageRecipient',
        ['messageId','recipientId','recipientGroupId'], {
        type: 'unique',
        name: 'message_recipient_unique_constraint',
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MessageRecipient');
  },
};