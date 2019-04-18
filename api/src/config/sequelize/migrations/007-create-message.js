'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Message', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      creatorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      messageBody: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      parentMessageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Message', key: 'id' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }).then(() => {
      queryInterface.addIndex('Message',['creatorId']);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Message');
  },
};
